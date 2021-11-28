
const { v4: uuidv4 } = require('uuid');
const { ClientMessageActions: ClientMessageActions }  = require('./Constants/ClientMessageActions');
const { ServerMessageActions: ServerMessageActions }  = require('./Constants/ServerMessageActions');
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


io.on('connection', (socket) => {
    console.log('a user connected');
    
    socket.on('getMessages', () => console.log('getMessages'));
    socket.on(ClientMessageActions.DISPLAY_NAME, (value) => handleDisplayName(value));
    socket.on(ClientMessageActions.CREATE_ROOM, (value) => handleCreateRoom(value));
    socket.on(ClientMessageActions.JOIN_ROOM, (value) => handleJoinRoom(value));
    socket.on(ClientMessageActions.LEAVE_ROOM, (value) => handleLeaveRoom(value));
    // socket.on('message', (value) => handleMessage(value));
    socket.on('disconnect', () => console.log('disconnect'));
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
    //send back the client connect
    socket.send(JSON.stringify(payLoad))
});


function handleLeaveRoom(message){
    const messageJson = JSON.parse(message)
    const targetRoom = messageJson.roomCode
    const clientId = messageJson.clientId
    //remove the target client from this room
    // does this room exists?
    if(!rooms[messageJson.roomCode]) {
        console.log("this room doesnt exist");
        clients[clientId].socket.emit(ServerMessageActions.ERROR, JSON.stringify(Utility.basicJson("message", "This room doesnt exists")))
        return;
    }
    console.log('before remove')
    console.log(rooms[messageJson.roomCode].players)
    rooms[messageJson.roomCode].players = Utility.removeElementFromArrayByKey(rooms[messageJson.roomCode].players, "clientId", messageJson.clientId)
    
    console.log('after remove')
    console.log(rooms[messageJson.roomCode].players)
    // broadcast the updated room
    clients[clientId].socket.emit("ROOM_UPDATE_LEAVE", JSON.stringify(Utility.basicJson("room", rooms[messageJson.roomCode])))
    clients[clientId].socket.to("room_"+messageJson.roomCode).emit("ROOM_UPDATE",JSON.stringify(Utility.basicJson("room", rooms[messageJson.roomCode])))
    clients[clientId].socket.leave("room_"+messageJson.roomCode)

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
            displayName: clients[clientId].displayName
        }]
    }
    rooms[roomCode] = newRoom
    clients[clientId].socket.join("room_"+roomCode)
    clients[clientId].socket.emit("ROOM_UPDATE", JSON.stringify(Utility.basicJson("room", rooms[roomCode])))
    // clients[clientId].socket.on("room_"+roomCode).emit("ROOM_UPDATE", JSON.stringify(Utility.jsonWithMethod("room", rooms[message.roomCode], ServerMessageActions.JOIN_ROOM)))
   
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
        displayName: clients[messageJson.clientId].displayName
    }
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


