import React, { Component } from "react";
import { ClientMessageActions } from '../Constants/ClientMessageActions'
import { GameModes, PlayerMoveOptions, RoomState, PlayerState, PlayerInputOptions, PlayerDetailOptions } from '../Constants/GlobalGameConstants'
import NoEscape from '../Games/NoEscape/NoEscape'
import Sprite from './Sprite'
import TeamFight from "../Games/TeamFight/TeamFight";
/**
 * Uses:
 * currentRoom
 * clientId
 */
class Room extends React.Component {



    leaveRoom(e) {
        const sendJson = {
            clientId: this.props.clientId,
            roomCode: this.props.currentRoom.roomCode
        }
        this.props.emitMsg(ClientMessageActions.LEAVE_ROOM, sendJson)
    }

    startGame(e){
        const sendJson = {
            clientId: this.props.clientId,
            roomCode: this.props.currentRoom.roomCode,
            playerInputAction: PlayerInputOptions.START_GAME
        }
        this.props.emitMsg(ClientMessageActions.PLAYER_INPUT, sendJson )
    }

    render() {
        return (
            <div className="flex-container">
                <div className="info-box">
                    <div>Game Room</div>
                    <div>Host: {this.props.currentRoom.hostName}</div>
                    <div>Room Code: {this.props.currentRoom.roomCode}</div>
                    <hr/>
                    <div>Players</div>
                    {this.props.currentRoom.players.map((player)=>(
                        <div key={"player_list"+player.clientId}>{player.displayName}</div>
                    ))}
                    <button onClick={()=>this.leaveRoom()}>Leave Room</button>
                    { this.props.currentRoom.roomState===RoomState.IN_LOBBY?
                        <button onClick={()=>this.startGame()}>Start Game</button>
                        :
                        <div>Game Started</div>
                    }
                    <hr></hr>
                    <div>Score: {this.props.currentRoom.score? this.props.currentRoom.score:"N/A"}</div>
                    <div>High Score {this.props.currentRoom.highScore&&this.props.currentRoom.highScore!=0?"["+this.props.currentRoom.highScoreName+"] : "+this.props.currentRoom.highScore:"N/A"}</div>
                </div>
                {
                    this.props.currentRoom.gameType===GameModes.NO_ESCAPE?
                    <NoEscape currentRoom={this.props.currentRoom} clientId={this.props.clientId}></NoEscape>
                    :
                    <TeamFight currentRoom={this.props.currentRoom} clientId={this.props.clientId}></TeamFight>
                }
            </div>
        );
    }
}

export default Room;