import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { ServerMessageActions } from './Constants/ServerMessageActions'
import { ClientMessageActions } from './Constants/ClientMessageActions'
import spazz from './resources/spazz.png';

import './App.css';
import { client } from 'websocket';

function App() {
  var defaultSocket;
  const [socket, setSocket] = useState(null);

  const [joinRoomCode, setJoinRoomCode] = useState('');
  const [currentRoom, setCurrentRoom] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [clientId, setClientId] = useState('');
  
  const connectToServer = (e) => {
    e.preventDefault();
    var newSocket = io(`http://localhost:8080`);
    setSocket(newSocket)
    defaultSocket = newSocket;
    newSocket.on('message', messageListener);
    newSocket.on('ROOM_UPDATE', handleUpdateRoom);
    newSocket.on('ROOM_UPDATE_LEAVE', handleUpdateRoomLeave);
    newSocket.on('ERROR', handleError);
  };

  
  const handleUpdateRoom = (message) => {
    console.log("message from " + "ROOM_UPDATE");
    console.log("recieved raw message with: " + message);
    const messageJson = JSON.parse(message)
    console.log("recieved message with: " + messageJson);
    setCurrentRoom(messageJson.room)
  };
  
  const handleUpdateRoomLeave = (message) => {
    console.log("message from " + "ROOM_UPDATE_LEAVE");
    console.log("recieved raw message with: " + message);
    setCurrentRoom()
  };
  
  const handleError = (message) => {
    console.log("message from " + "ERROR");
    const messageJson = JSON.parse(message)
    console.log("ERROR MESSAGE FROM SERVER: " + messageJson.message)
  };

  const messageListener = (message) => {
    const eventSocket = socket?socket:defaultSocket;
    console.log("recieved raw message with: " + message);
    const messageJson = JSON.parse(message)
    console.log("recieved message with: " + messageJson);
    switch(messageJson.method){
      case ServerMessageActions.CONNECT: 
        setClientId(messageJson.clientId);
        // setTimeout(()=> {eventSocket.emit(ClientMessageActions.DISPLAY_NAME, JSON.stringify(basicJsonWithClientId("displayName", displayName, messageJson.clientId)));}, 1000)
        eventSocket.emit(ClientMessageActions.DISPLAY_NAME, JSON.stringify(basicJsonWithClientId("displayName", displayName, messageJson.clientId)));
        break;
      // case ServerMessageActions.JOIN_ROOM:
      //   handleJoinRoom(messageJson);
      //   break
      // case ServerMessageActions.ERROR:
      //   console.log("ERROR MESSAGE FROM SERVER: " + messageJson.message)
      //   break;
    }
  };
  const joinRoom = (e) => {
    e.preventDefault();
    emitMsg(ClientMessageActions.JOIN_ROOM, basicJson("roomCode",joinRoomCode))
  }
  
  const leaveRoom = (e) => {
    emitMsg(ClientMessageActions.LEAVE_ROOM, basicJson("roomCode",currentRoom.roomCode))
  }
  const createRoom = () => {
    let toSendJson = basicJson("","");
    console.log("to send json is")
    console.log(toSendJson)
    emitMsg(ClientMessageActions.CREATE_ROOM, toSendJson)
  }
  const handleJoinRoom = (message) => {
    console.log(message)
    setCurrentRoom(message.room)
  }
  
  const basicJson = (field, value) => {
    const jsonObj = {
      [field]: value,
      clientId: clientId
    };
    return jsonObj;
  }
  
  const basicJsonWithClientId = (field, value, clientId) => {
    const jsonObj = basicJson(field, value);
    jsonObj.clientId = clientId;
    console.log("tried to send json: ")
    console.log(jsonObj)
    return jsonObj
  }

  const emitMsg = (path, msg) => {
    socket.emit(path, JSON.stringify(msg));
  };

  // useEffect(() => {
  //   return () => socket?socket.close():console.log('no socket to close');
  // });
  
  let viewFragment = "";
  let currentView = "";
  if(!socket){
    currentView = "DISPLAY_NAME"
    viewFragment =
      <div className="chat-container">
        <form onSubmit={connectToServer}>
          <input
            autoFocus value={displayName} placeholder="Display Name"
            onChange={(e) => {
              setDisplayName(e.currentTarget.value);
            }}
          />
        </form>
      </div>
  } else if (currentRoom){
    currentView = "ROOM"
    viewFragment =
      <div className="chat-container">
        <div>Game Room</div>
        <div>Host: {currentRoom.hostName}</div>
        <div>Room Code: {currentRoom.roomCode}</div>
        <hr/>
        <div>Players</div>
        {currentRoom.players.map((player)=>(
          <div key={"player_list"+player.clientId}>{player.displayName}</div>
        ))}
        <button onClick={leaveRoom}>Leave Room</button>
        <div>
          <img src={spazz} alt="Logo" />
        </div>
      </div>
  } else {
    currentView = "MENU"
    viewFragment =
      <React.Fragment>
        <div>
          <div>Display Name: {displayName}</div>
          <div>Client Id: {clientId}</div>
          <form onSubmit={joinRoom}>
            <input
                value={joinRoomCode} placeholder="Join Room" onChange={(e) => {
                  setJoinRoomCode(e.currentTarget.value);
                }}
            />
          </form>
          <button onClick={createRoom}>Create Room</button>
        </div>
      </React.Fragment>
  }

  return (
    <div className="App">
      <header className="app-header">
        React Chat
      </header>
      {viewFragment}

    </div>
  );
}

export default App;