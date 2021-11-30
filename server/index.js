
const { v4: uuidv4 } = require('uuid');
const { ClientMessageActions: ClientMessageActions }  = require('./Constants/ClientMessageActions');
const { ServerMessageActions: ServerMessageActions }  = require('./Constants/ServerMessageActions');
const { GameBoardConstants: GameBoardConstants }  = require('./Constants/GameBoardConstants');
const { NoEscape: NoEscape }  = require('./Games/NoEscape');
const  Utility   = require('./Utils/Utility');
const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
var socketio = require('socket.io');
const { client } = require('websocket');
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


io.on('connection', (socket) => {
    console.log('a user connected');
    
    socket.on('getMessages', () => console.log('getMessages'));
    socket.on(ClientMessageActions.DISPLAY_NAME, (value) => handleDisplayName(value));
    socket.on(ClientMessageActions.CREATE_ROOM, (value) => handleCreateRoom(value));
    socket.on(ClientMessageActions.JOIN_ROOM, (value) => handleJoinRoom(value));
    socket.on(ClientMessageActions.LEAVE_ROOM, (value) => handleLeaveRoom(value));
    socket.on(ClientMessageActions.PLAYER_MOVE, (value) => handlePlayerMove(value));
    // socket.on('message', (value) => handleMessage(value));
    socket.on('connect_error', (err) => {
        console.log(`connect_error due to ${err.message}`);
    });
  
    //generate a new clientId
    const clientId = uuidv4();
    clients[clientId] = {
        "socket":  socket
    }

    const payLoad = {
        "method": ServerMessageActions.CONNECT,
        "clientId": clientId
    }
    socket.on('disconnect', ()=>handleDisconnect(clientId));
    //send back the client connect
    socket.send(JSON.stringify(payLoad))
});

function handlePlayerMove(message){
    console.log("got message to move")
    const messageJson = JSON.parse(message)
    messageJson.clientId

    // target room
    var targetPlayer = Utility.getFromArray(rooms[messageJson.roomCode].players, "clientId", messageJson.clientId)
    if(targetPlayer){
        targetPlayer.MOVE_UP = messageJson.MOVE_UP
        targetPlayer.MOVE_DOWN = messageJson.MOVE_DOWN
        targetPlayer.MOVE_LEFT = messageJson.MOVE_LEFT
        targetPlayer.MOVE_RIGHT = messageJson.MOVE_RIGHT
    }

}

function handleDisconnect(clientId){
    console.log("disconnect")
    console.log(clientId);
    //remove this player from the room he may be in
    if(clients[clientId].roomCode){
        removePlayreFromRoom(clients[clientId].roomCode, clientId)
        // rooms[roomCode].players = Utility.removeElementFromArrayByKey(rooms[roomCode].players, "clientId", clientId)
        // // broadcast the updated room
        // clients[clientId].socket.to("room_"+roomCode).emit("ROOM_UPDATE",JSON.stringify(Utility.basicJson("room", rooms[roomCode])))
    }
    //clean up this client
    delete clients[clientId]
    console.log("all clients")
    console.log(clients)
}

// handle events when a player leaves the room
function handleLeaveRoom(message){
    const messageJson = JSON.parse(message)
    const clientId = messageJson.clientId
    removePlayreFromRoom(messageJson.roomCode, messageJson.clientId)
}

// removing player with 'clientId' from room with 'roomCode'
// cleanup the room is there are no other players
// transfer host if host left
function removePlayreFromRoom(roomCode, clientId){
    // does this room exists?
    if(!rooms[roomCode]) {
        console.log("this room doesnt exist");
        return;
    }

    rooms[roomCode].players = Utility.removeElementFromArrayByKey(rooms[roomCode].players, "clientId", clientId)
    //one final leave room event for this client as well as removing them from this room so they dont get future events from here
    clients[clientId].socket.emit("ROOM_UPDATE_LEAVE", JSON.stringify(Utility.basicJson("room", rooms[roomCode])))
    clients[clientId].socket.leave("room_"+roomCode)
    // are there any players left?
    if(rooms[roomCode].players.length===0){
        console.log("empty room, delete room")
        delete rooms[roomCode]
        games[roomCode].end()
        delete games[roomCode]
        console.log("Current Rooms")
        console.log(rooms)
        // no need to broadcast this sunce no one else is in this room
        return
    }
    // if we just removed the host, lets pick the next player as host
    if(rooms[roomCode].hostId===clientId){
        rooms[roomCode].hostId=rooms[roomCode].players[0].clientId
        rooms[roomCode].hostName=rooms[roomCode].players[0].displayName
        console.log("host changed to " + rooms[roomCode].hostName)
    }
    //broadcast this room update to everyone
    clients[clientId].socket.to("room_"+roomCode).emit("ROOM_UPDATE",JSON.stringify(Utility.basicJson("room", rooms[roomCode])))
}


function handleDisplayName(message){
    const messageJson = JSON.parse(message)
    clients[messageJson.clientId].displayName = messageJson.displayName;
    console.log(messageJson.displayName);
}
function handleCreateRoom(message){
    const messageJson = JSON.parse(message)
    let clientId = messageJson.clientId;
    // keep trying to create a room code until you find one that doest exist
    let roomCode = Utility.generateRandomLetterString(5);
    while(rooms[roomCode]){
        roomCode = Utility.generateRandomLetterString(5);
    }


    // create the room
    const newRoom = {
        roomCode: roomCode,
        hostId: clientId,
        hostName: clients[clientId].displayName,
        players: [{
            clientId: clientId,
            displayName: clients[clientId].displayName,
            x: 0.5,
            y: 0.5
        }],
    }
    
    //create a game object
    const noEscape = new NoEscape(io, newRoom)
    games[roomCode] = noEscape

    rooms[roomCode] = newRoom
    clients[clientId].roomCode = roomCode
    clients[clientId].socket.join("room_"+roomCode)
    clients[clientId].socket.emit("ROOM_UPDATE", JSON.stringify(Utility.basicJson("room", rooms[roomCode])))
    // clients[clientId].socket.on("room_"+roomCode).emit("ROOM_UPDATE", JSON.stringify(Utility.jsonWithMethod("room", rooms[message.roomCode], ServerMessageActions.JOIN_ROOM)))
   
    // start the game
    noEscape.start()
}
function handleJoinRoom(message){
    const messageJson = JSON.parse(message)
    let clientId = messageJson.clientId;
    //try to join the room
    if(!rooms[messageJson.roomCode]) {
        console.log("this room doesnt exist");
        clients[clientId].socket.emit(ServerMessageActions.ERROR, JSON.stringify(Utility.basicJson("message", "This room doesnt exists")))
        return;
    }
    if(Utility.existsInArray(rooms[messageJson.roomCode].players, "clientId", messageJson.clientId)){
        console.log("cannot join a room you are already in");
        clients[clientId].socket.emit("message", JSON.stringify(Utility.basicJson("message", "Cannot join a room you are already in")))
        return;
    }
    const playerObj = {
        clientId: messageJson.clientId,
        displayName: clients[messageJson.clientId].displayName,
        x: 0.5,
        y: 0.5
    }
    //keep track of the room on player side as well for easy reference when we want to remove the player from the room
    clients[messageJson.clientId].roomCode = messageJson.roomCode
    console.log("successfully joined room");
    rooms[messageJson.roomCode].players = [...rooms[messageJson.roomCode].players, playerObj]
    // clients[clientId].socket.emit("message", JSON.stringify(Utility.jsonWithMethod("room", rooms[message.roomCode], ServerMessageActions.JOIN_ROOM)))
        

    clients[clientId].socket.join("room_"+messageJson.roomCode)
    clients[clientId].socket.emit("ROOM_UPDATE", JSON.stringify(Utility.basicJson("room", rooms[messageJson.roomCode])))
    let sendJson =  JSON.stringify(Utility.basicJson("room", rooms[messageJson.roomCode]))
    console.log("sending back on room: " + "room_"+messageJson.roomCode)
    console.log(sendJson)
    clients[clientId].socket.to("room_"+messageJson.roomCode).emit("ROOM_UPDATE",sendJson)
    console.log(rooms[messageJson.roomCode].players)

}


server.listen(8080, () => {
  console.log('listening on *:8080');
});


