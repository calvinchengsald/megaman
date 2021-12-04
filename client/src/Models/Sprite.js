import React, { Component } from "react";
import { GameBoardConstants } from '../Constants/GameBoardConstants'


class Sprite extends React.Component {




  render() {
      const spriteStyle = {
        position: 'absolute',
        width: GameBoardConstants.SPRITE_SIZE+'px',
        height: GameBoardConstants.SPRITE_SIZE+'px',
        top:  (this.props.model.y*GameBoardConstants.GAME_BOARD_PLAYABLE_SIZE - (GameBoardConstants.SPRITE_SIZE/2))  +'px' ,
        left: (this.props.model.x*GameBoardConstants.GAME_BOARD_PLAYABLE_SIZE - (GameBoardConstants.SPRITE_SIZE/2))  +'px'
      }
      const nameStyle = {
        position: 'absolute',
        width: GameBoardConstants.SPRITE_SIZE+'px',
        top:  (this.props.model.y*GameBoardConstants.GAME_BOARD_PLAYABLE_SIZE - 20 - (GameBoardConstants.SPRITE_SIZE/2))   +'px' ,
        left: (this.props.model.x*GameBoardConstants.GAME_BOARD_PLAYABLE_SIZE - (GameBoardConstants.SPRITE_SIZE/2))   +'px',
        'text-align': 'center'
      }
    return (
        <React.Fragment>
            {this.props.name?
            <div style={nameStyle}>{this.props.name}</div>
            :
            <React.Fragment/>
            }
            <img src={this.props.sprite} className="sprite" style={spriteStyle} />
        </React.Fragment>
    );
  }
}

export default Sprite;