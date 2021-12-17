import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Config } from './Constants/Config'
import { ServerMessageActions } from './Constants/ServerMessageActions'
import { ClientMessageActions } from './Constants/ClientMessageActions'
import { AvatarConstants, AttackConstants, GameModes, PlayerMoveOptions, RoomState, PlayerState, PlayerInputOptions, PlayerDetailOptions } from './Constants/GlobalGameConstants'
import Sprite from './Models/Sprite'
import Room from './Models/Room'
import Connect from './Pages/Connect'

import './App.css';
import { client } from 'websocket';
import { ViewTab } from './Constants/ViewTab';
import EquipmentTab from './Pages/EquipmentTab';

function App() {
  var defaultSocket;
  const [socket, setSocket] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorShow, setErrorShow] = useState(false);
  const [gameMode, setGameMode] = useState(GameModes.TEAM_FIGHT);
  const [player, setPlayer] = useState('');
  const [currentTab, setCurrentTab] = useState(ViewTab.EQUIPMENT);

  const [playerMoveMatrix, setPlayerMoveMatrix] = useState({
    MOVE_UP: false,
    MOVE_DOWN: false,
    MOVE_RIGHT: false,
    MOVE_LEFT: false
  });
  const [joinRoomCode, setJoinRoomCode] = useState('');
  const [currentRoom, setCurrentRoom] = useState('');
  const [displayName, setDisplayName] = useState('Cowvin');
  const [avatar, setAvatar] = useState(AvatarConstants.Spazz.NAME);
  const [clientId, setClientId] = useState('');
  const [selectedWeapon, setSelectedWeapon] = useState(null);
  const [selectedBullet, setSelectedBullet] = useState(null);
  
  const connectToServer = (e) => {
    e.preventDefault();
    var newSocket = io(Config.SERVER_PATH);
    setSocket(newSocket)
    defaultSocket = newSocket;
    newSocket.on('message', messageListener);
    newSocket.on('ROOM_UPDATE', handleUpdateRoom);
    newSocket.on('ROOM_UPDATE_LEAVE', handleUpdateRoomLeave);
    newSocket.on('ERROR', handleError);
  };

  
  const handleUpdateRoom = (message) => {
    // console.log("message from " + "ROOM_UPDATE");
    // console.log("recieved raw message with: " + message);
    const messageJson = JSON.parse(message)
    // console.log(messageJson.room.attacks);
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
    setErrorMessage(messageJson.message)
    setErrorShow(true)
  };

  const messageListener = (message) => {
    const eventSocket = socket?socket:defaultSocket;
    console.log("recieved raw message with: " + message);
    const messageJson = JSON.parse(message)
    console.log("recieved message with: " + messageJson);
    switch(messageJson.method){
      case ServerMessageActions.CONNECT: 
        setClientId(messageJson.clientId);
        const sendJson = basicJsonWithClientId("displayName", displayName, messageJson.clientId)
        setPlayer(messageJson.player)
        sendJson.playerDetailAction = PlayerDetailOptions.DISPLAY_NAME
        eventSocket.emit(ClientMessageActions.PLAYER_DETAIL, JSON.stringify(sendJson));
        break;
    }
  };
  const joinRoom = (e) => {
    e.preventDefault();
    emitMsg(ClientMessageActions.JOIN_ROOM, basicJson("roomCode",joinRoomCode))
  }
  const createRoom = () => {
    emitMsg(ClientMessageActions.CREATE_ROOM, basicJson("gameType",gameMode))
  }
  const selectAvatar = (targetAvatar) => {
    console.log("select avatar")
    setAvatar(targetAvatar)
    const sendJson = basicJson("playerDetailAction",PlayerDetailOptions.AVATAR)
    sendJson.avatar=targetAvatar
    emitMsg(ClientMessageActions.PLAYER_DETAIL,sendJson)
  }
  
  const basicJson = (field, value) => {
    const jsonObj = {
      [field]: value,
      clientId: clientId
    };
    return jsonObj;
  }

  const handlePlayerKeyPress = (e) =>{
    handleKeyPres(e.key, true);
  }
  const handlePlayerKeyRelease = (e) =>{
    handleKeyPres(e.key, false);
  }


  // key - key pressed by player
  // pushed - true if pushed, false if released
  const handleKeyPres = (key, pushed) =>{
    if(!playerMoveMatrix || !currentRoom) return

    // these only apply for pushed keys
    if(pushed){
      switch(key){
        case 'ArrowRight': 
        case 'ArrowLeft': 
        case 'ArrowUp': 
        case 'ArrowDown': 
          changePlayerMovementMatrix(key, pushed);
          break;
        case ' ':
          const sendJson = {
            roomCode: currentRoom.roomCode,
            playerInputAction: PlayerInputOptions.ATTACK,
            attack: AttackConstants.Burst.NAME
          }
          emitMsg(ClientMessageActions.PLAYER_INPUT, sendJson)
          break;
        default:
          console.log(key)
      }
    }
    // these only apply for released keys
    else if(!pushed){
      changePlayerMovementMatrix(key, pushed);
    }

  }


  // key - key pressed by player
  // toggle - set movement mode to true/false
  const changePlayerMovementMatrix = (key, toggle) => {
    const copyPlayerMoveMatrix = playerMoveMatrix;
    switch(key){
      case 'ArrowRight': 
        if(playerMoveMatrix.MOVE_RIGHT===toggle) return
        copyPlayerMoveMatrix.MOVE_RIGHT=toggle;
        copyPlayerMoveMatrix.MOVE_LEFT=false;
        break;
      case 'ArrowLeft': 
        if(playerMoveMatrix.MOVE_LEFT===toggle) return
        copyPlayerMoveMatrix.MOVE_LEFT=toggle;
        copyPlayerMoveMatrix.MOVE_RIGHT=false;
        break;
      case 'ArrowUp': 
        if(playerMoveMatrix.MOVE_UP===toggle) return
        copyPlayerMoveMatrix.MOVE_UP=toggle;
        copyPlayerMoveMatrix.MOVE_DOWN=false;
        break;
      case 'ArrowDown': 
        if(playerMoveMatrix.MOVE_DOWN===toggle) return
        copyPlayerMoveMatrix.MOVE_DOWN=toggle;
        copyPlayerMoveMatrix.MOVE_UP=false;
        break;
      default:
        return
    }
    copyPlayerMoveMatrix.roomCode=currentRoom.roomCode
    copyPlayerMoveMatrix.playerInputAction=PlayerInputOptions.MOVE
    emitMsg(ClientMessageActions.PLAYER_INPUT, copyPlayerMoveMatrix)
    setPlayerMoveMatrix(copyPlayerMoveMatrix)
  }
  
  const basicJsonWithClientId = (field, value, clientId) => {
    const jsonObj = basicJson(field, value);
    jsonObj.clientId = clientId;
    console.log("tried to send json: ")
    console.log(jsonObj)
    return jsonObj
  }

  const emitMsg = (path, msg) => {
    msg.clientId = clientId;
    socket.emit(path, JSON.stringify(msg));
  };

  const handleAppClick = (e) => {
    console.log("app click")
    if(errorShow){
      setErrorShow(false)
    }
  }

  // useEffect(() => {
  //   return () => socket?socket.close():console.log('no socket to close');
  // });
  let ConnectFragment = <Connect connectToServer={connectToServer} displayName={displayName} setDisplayName={setDisplayName}/>
  let GameRoomFragment = <Room currentRoom={currentRoom} clientId={clientId} emitMsg={(path, msg)=>emitMsg(path, msg)}></Room>
  let EquipmentFragment = <EquipmentTab setSelectedWeapon={setSelectedWeapon} setSelectedBullet={setSelectedBullet} player={player}
                            selectedWeapon={selectedWeapon}
                            selectedBullet={selectedBullet}
                          />
  let MenuFragment = 
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
          <button onClick={joinRoom}>Join Room</button>
        </form>
        <button onClick={createRoom}>Create Room</button>
        <div>Select an avatar</div>
        { Object.keys(AvatarConstants).map(key=>
          <img onClick={()=>selectAvatar(AvatarConstants[key].NAME)} src={AvatarConstants[key].DYING[0]} className={avatar===AvatarConstants[key].NAME?"avatar-selector avatar-selected":"avatar-selector"}/>
        )}
        

        <div>Select Game Mode</div>
        <div className="game-mode-body">
          { Object.keys(GameModes).map(key=>
            <div onClick={()=>setGameMode(GameModes[key])} className={gameMode===GameModes[key]?"game-mode-selector avatar-selected":"game-mode-selector"} >{GameModes[key]}</div>
          )}
        </div>
      </div>
    </React.Fragment>

  let TabFragment;
  switch(currentTab){
    case ViewTab.GAME:
      TabFragment=currentRoom?GameRoomFragment:MenuFragment
      break;
    case ViewTab.EQUIPMENT:
      TabFragment=EquipmentFragment
      break;
  }         

  return (
    <div className="" onClick={handleAppClick} onKeyDown={handlePlayerKeyPress} onKeyUp={handlePlayerKeyRelease} tabIndex="0">
      {errorShow?
        <div className="error-modal">
          <p>{errorMessage}</p>
        </div>
        :
        <React.Fragment/>
      }
      {/* <header className="app-header">
        {displayName}
      </header> */}
      {!socket?
        ConnectFragment
        :
        <div className="container">
          <div className="tab-header">
            {
              Object.keys(ViewTab).map(tab=><div className={currentTab===ViewTab[tab]?"tab tab-bg-selected":"tab"} onClick={()=>setCurrentTab(ViewTab[tab])}>{ViewTab[tab]}</div>)
            }
          </div>
          <div className='tab-content'>
            {TabFragment}
          </div>
        </div>
      }
    </div>
  );
}


export default App;