
import React, { Component } from "react";
import { RoomState, PlayerState } from '../../Constants/GlobalGameConstants'
import { GameBoardConstants } from './GameConstants'
import Sprite from '../../Models/Sprite'

class NoEscape extends React.Component {

    render() {
        return(
            <div className="game-box" 
            style={{minWidth: GameBoardConstants.GAME_BOARD_SIZE+'px', minHeight: GameBoardConstants.GAME_BOARD_SIZE+'px'}}
            >
                
                <div className="game-board" style={{minWidth: GameBoardConstants.GAME_BOARD_SIZE+'px', minHeight: GameBoardConstants.GAME_BOARD_SIZE+'px'}}>
                    {this.props.currentRoom.gameCountdownStartTime>0 && this.props.currentRoom.roomState===RoomState.IN_GAME?
                        <div className="game-message">Game starts in {Math.floor(this.props.currentRoom.gameCountdownStartTime)}</div>
                        :
                        <React.Fragment/>
                    }
                    {this.props.currentRoom && this.props.currentRoom.roomState===RoomState.IN_GAME && this.props.currentRoom.players && this.props.currentRoom.players.map((player)=>{
                    if(player.state === PlayerState.ALIVE || player.state === PlayerState.DYING){
                        return (<Sprite mainPlayer={this.props.clientId===player.clientId?true:false} type="avatar" name={player.displayName} model={player}></Sprite>)
                    }
                    })}
                    {this.props.currentRoom && this.props.currentRoom.roomState===RoomState.IN_GAME && this.props.currentRoom.attacks && this.props.currentRoom.attacks.map((attack)=>
                    <Sprite type="attack" model={attack}></Sprite>
                    )}
                </div>
            </div>
        )
    }
}


export default NoEscape;