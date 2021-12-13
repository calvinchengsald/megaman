
const { v4: uuidv4 } = require('uuid');
const { ClientMessageActions: ClientMessageActions }  = require('./Constants/ClientMessageActions');
const { ServerMessageActions: ServerMessageActions }  = require('./Constants/ServerMessageActions');
const { GameModes, RoomState, PlayerState, PlayerInputOptions, PlayerDetailOptions, Rarity }  = require('./Constants/GameBoardConstants');
const { NoEscape: NoEscape }  = require('./Games/NoEscape/NoEscape');
const { TeamFight: TeamFight }  = require('./Games/TeamFight/TeamFight');
const { Room: Room }  = require('./Models/Room');
const Utility   = require('./Utils/Utility');
const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
var socketio = require('socket.io');
const { Console } = require('console');
const server = http.createServer(app);
var io = socketio(server,{
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });
app.use(cors());

app.get('/', (req, res) => {
  res.send('i am a server');
});

const clients = {}
const rooms = {}
const games = {}
const leaderboard = {
    highScore: 0,
    highScoreName: ""
}

io.on('connection', (socket) => {
    console.log('a user connected');
    
    socket.on('getMessages', () => console.log('getMessages'));
    socket.on(ClientMessageActions.PLAYER_DETAIL, (value) => handlePlayerDetail(value));
    socket.on(ClientMessageActions.CREATE_ROOM, (value) => handleCreateRoom(value));
    socket.on(ClientMessageActions.JOIN_ROOM, (value) => handleJoinRoom(value));
    socket.on(ClientMessageActions.LEAVE_ROOM, (value) => handleLeaveRoom(value));
    socket.on(ClientMessageActions.PLAYER_INPUT, (value) => handlePlayerInput(value));
    // socket.on('message', (value) => handleMessage(value));
    socket.on('connect_error', (err) => {
        console.log(`connect_error due to ${err.message}`);
    });
  
    //generate a new clientId
    const clientId = uuidv4();
    clients[clientId] = {
        "socket":  socket,
        player: {
            weapons: [
                {
                    id: uuidv4(),
                    rarity: Rarity.COMMON
                },
                {
                    id: uuidv4(),
                    rarity: Rarity.RARE
                }
            ],
            bullets: [
                {
                    id: uuidv4(),
                    rarity: Rarity.UNCOMMON
                },
                {
                    id: uuidv4(),
                    rarity: Rarity.COMMON
                },
                {
                    id: uuidv4(),
                    rarity: Rarity.RARE
                },
                {
                    id: uuidv4(),
                    rarity: Rarity.EPIC
                },
                {
                    id: uuidv4(),
                    rarity: Rarity.LEGENDARY
                }
            ]
        }
        
    }
    initializeDefaultPlayer(clients[clientId])

    const payLoad = {
        "method": ServerMessageActions.CONNECT,
        "clientId": clientId,
        player: clients[clientId].player
    }
    socket.on('disconnect', ()=>handleDisconnect(clientId));
    //send back the client connect
    socket.send(JSON.stringify(payLoad))
});

function initializeDefaultPlayer(client){
    for(let i=0; i<20; i++){
        client.player.bullets.push({
            id: uuidv4(),
            rarity: Rarity.UNCOMMON
        })
    }
}

function emitError(clientId, errorMessage){
    clients[clientId].socket.emit(ServerMessageActions.ERROR, JSON.stringify(Utility.basicJson("message", errorMessage)))
}

function handlePlayerInput(message){
    const messageJson = JSON.parse(message)
    //offload the player input handling to each individual game's controller function
    //but first validate that this player is part of this room
    var targetRoom = rooms[messageJson.roomCode]
    var targetGame = games[messageJson.roomCode]
    var targetPlayer = Utility.getFromArray(targetRoom.roomJson.players, "clientId", messageJson.clientId)
    if(!targetRoom){
        emitError(messageJson.clientId, "This room does not exist")
        return
    }
    if(!targetGame){
        emitError(messageJson.clientId, "This game does not exist")
        return
    }
    if(!targetPlayer){
        emitError(messageJson.clientId, "Player is not a part of this room")
        return
    }

    if(targetRoom.handlePlayerInput(messageJson)){

    }
    else {
        switch(messageJson.playerInputAction){
            case PlayerInputOptions.START_GAME:
                console.log("Game Started")
                // start the game
                if(targetRoom.roomJson.hostId !== messageJson.clientId){
                    clients[messageJson.clientId].socket.emit(ServerMessageActions.ERROR, JSON.stringify(Utility.basicJson("message", "Only the host can start the game")))
                    break;
                }
                if(games[messageJson.roomCode]) games[messageJson.roomCode].start()
                break;
            default:
                console.log("unrecognized action: " + messageJson.playerInputAction)
        }
    }

    

}

function handleDisconnect(clientId){
    console.log("disconnect")
    //remove this player from the room he may be in
    if(clients[clientId].roomCode){
        removePlayerFromRoom(clients[clientId].roomCode, clientId)
    }
    //clean up this client
    delete clients[clientId]
}

// handle events when a player leaves the room
function handleLeaveRoom(message){
    const messageJson = JSON.parse(message)
    removePlayerFromRoom(messageJson.roomCode, messageJson.clientId)
}

// removing player with 'clientId' from room with 'roomCode'
// cleanup the room is there are no other players
// transfer host if host left
function removePlayerFromRoom(roomCode, clientId){
    // does this room exists?
    const targetRoom = rooms[roomCode]
    if(!targetRoom) {
        emitError(clientId, "This room does not exist")
        return;
    }
    if(targetRoom.removePlayerFromRoom(clientId)){
        //one final leave room event for this client as well as removing them from this room so they dont get future events from here
        clients[clientId].socket.emit("ROOM_UPDATE_LEAVE", JSON.stringify(Utility.basicJson("room", rooms[roomCode].roomJson)))
        clients[clientId].socket.leave("room_"+roomCode)

        // are there any players left?
        if(targetRoom.roomJson.players.length===0){
            console.log("empty room, delete room")
            targetRoom.cleanupRoom()
            delete rooms[roomCode]
            if(games[roomCode]) delete games[roomCode]
            // no need to broadcast this since no one else is in this room
            return
        }
        io.to("room_"+roomCode).emit(ServerMessageActions.ROOM_UPDATE,JSON.stringify(Utility.basicJson("room", rooms[roomCode].roomJson)))
    } 
    else {
        emitError(clientId, "This player is not part of this room")
    }
}


function handlePlayerDetail(message){
    const messageJson = JSON.parse(message)
    console.log(messageJson)
    switch(messageJson.playerDetailAction){
        case PlayerDetailOptions.DISPLAY_NAME:
            clients[messageJson.clientId].displayName = messageJson.displayName;
            console.log(messageJson.displayName);
            break;
        case PlayerDetailOptions.AVATAR:
            clients[messageJson.clientId].type = messageJson.avatar;
            console.log(messageJson.avatar);
            break;
        default:
            console.log("unrecognized action: " + messageJson.PlayerDetailOptions)
    }
}

function handleCreateRoom(message){
    const messageJson = JSON.parse(message)
    let clientId = messageJson.clientId;
    let gameType = messageJson.gameType;

    // make sure this is one of the available game types for this room
    if(!gameType || !Utility.existsInObject(GameModes, gameType)){
        emitError(clientId, "Invalid game type")
        return
    }
    // keep trying to create a room code until you find one that doest exist
    let roomCode = Utility.generateRandomLetterString(5);
    while(rooms[roomCode]){
        roomCode = Utility.generateRandomLetterString(5);
    }

    // create the room with the basics
    const roomJson = {
        roomCode: roomCode,
        hostId: clientId,
        hostName: clients[clientId].displayName,
        roomState: RoomState.IN_LOBBY,
        gameType: gameType,
        players: [{
            clientId: clientId,
            displayName: clients[clientId].displayName
        }],
    }
    
    //create a game object
    var gameObject
    switch(gameType){
        case GameModes.NO_ESCAPE: 
            gameObject = new NoEscape(io, roomJson, leaderboard)
            break;
        case GameModes.TEAM_FIGHT: 
            gameObject = new TeamFight(io, roomJson, leaderboard)
            break;
        default:
            emitError(clientId, "This game type does not exist")
            return;
    }
    games[roomCode] = gameObject
    // rooms[roomCode] = newRoom
    rooms[roomCode] = new Room(roomJson, gameObject, (clientId, errorMessage) => emitError(clientId, errorMessage), clients[clientId]) 
    clients[clientId].roomCode = roomCode
    clients[clientId].socket.join("room_"+roomCode)
    io.to("room_"+roomCode).emit(ServerMessageActions.ROOM_UPDATE,JSON.stringify(Utility.basicJson("room", rooms[roomCode].roomJson)))
}

function handleJoinRoom(message){
    const messageJson = JSON.parse(message)
    let clientId = messageJson.clientId;
    const roomObject = rooms[messageJson.roomCode]
    //try to join the room
    if(!roomObject) {
        console.log("this room doesnt exist");
        emitError(clientId, "This room does not exist")
        return;
    }
    var successfullJoinRoom = roomObject.handleJoinRoom(messageJson, clients)
    if(successfullJoinRoom){
        //keep track of the room on player side as well for easy reference when we want to remove the player from the room
        clients[clientId].roomCode = messageJson.roomCode
        clients[clientId].socket.join("room_"+messageJson.roomCode)
        io.to("room_"+messageJson.roomCode).emit("ROOM_UPDATE",JSON.stringify(Utility.basicJson("room", rooms[messageJson.roomCode].roomJson)));
    }
}

const port = process.env.port || 8080
server.listen(port, () => {
  console.log('listening on *:' + port);
});


