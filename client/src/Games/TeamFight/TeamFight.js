
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
                    {this.props.currentRoom.gameCountdownStartTime>0 && this.props.currentRoom.roomState===RoomState.IN_GAME?
                        <div className="game-message">Game starts in {Math.floor(this.props.currentRoom.gameCountdownStartTime)}</div>
                        :
                        <React.Fragment/>
                    }
                    {this.props.currentRoom.blockers && this.props.currentRoom.blockers.map((blocker)=> 
                        <div className="boundary" style={{
                            minWidth: ((blocker.x1-blocker.x0)*GameBoardConstants.GAME_BOARD_WIDTH)+'px',
                            minHeight: ((blocker.y1-blocker.y0)*GameBoardConstants.GAME_BOARD_HEIGHT)+'px',
                            top: (blocker.y0*GameBoardConstants.GAME_BOARD_WIDTH)+'px',
                            left: (blocker.x0*GameBoardConstants.GAME_BOARD_HEIGHT)+'px',
                        }}></div>
                    )}
                    {this.props.currentRoom.shrinkBoundary && this.props.currentRoom.shrinkBoundary.map((blocker)=> 
                        <div className="shrink-boundary" style={{
                            minWidth: Math.floor(((blocker.x1-blocker.x0)*GameBoardConstants.GAME_BOARD_WIDTH))+'px',
                            minHeight: Math.floor(((blocker.y1-blocker.y0)*GameBoardConstants.GAME_BOARD_HEIGHT))+'px',
                            top: Math.floor((blocker.y0*GameBoardConstants.GAME_BOARD_WIDTH))+'px',
                            left: Math.floor((blocker.x0*GameBoardConstants.GAME_BOARD_HEIGHT))+'px',
                        }}></div>
                    )}
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