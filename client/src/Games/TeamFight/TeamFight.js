
import React, { Component } from "react";
import { RoomState, PlayerState } from '../../Constants/GlobalGameConstants'
import { GameBoardConstants } from './GameConstants'
import Sprite from '../../Models/Sprite'

class TeamFight extends React.Component {

    render() {
        return(
            <div className="game-box" 
            style={{minWidth: GameBoardConstants.GAME_BOARD_WIDTH+'px', minHeight: GameBoardConstants.GAME_BOARD_HEIGHT+'px'}}
            >
                <div className="game-board" style={{minWidth: GameBoardConstants.GAME_BOARD_WIDTH+'px', minHeight: GameBoardConstants.GAME_BOARD_HEIGHT+'px'}}>
                    {this.props.currentRoom && this.props.currentRoom.roomState===RoomState.IN_GAME && this.props.currentRoom.players && this.props.currentRoom.players.map((player)=>{
                    if(player.state === PlayerState.ALIVE || player.state === PlayerState.DYING){
                        return (<Sprite mainPlayer={this.props.clientId===player.clientId?true:false} type="avatar" name={player.displayName} model={player}></Sprite>)
                    }
                    })}
                    {this.props.currentRoom && this.props.currentRoom.roomState===RoomState.IN_GAME && this.props.currentRoom.leftTeam.attacks && this.props.currentRoom.leftTeam.attacks.map((attack)=>
                    <Sprite type="attack" model={attack}></Sprite>
                    )}
                    {this.props.currentRoom && this.props.currentRoom.roomState===RoomState.IN_GAME && this.props.currentRoom.rightTeam.attacks && this.props.currentRoom.rightTeam.attacks.map((attack)=>
                    <Sprite type="attack" model={attack}></Sprite>
                    )}
                </div>
            </div>
        )
    }
}


export default TeamFight;