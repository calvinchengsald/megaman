import React, { Component } from "react";
import { GameBoardConstants } from '../Constants/GameBoardConstants'


class Sprite extends React.Component {




  render() {
      const customStyle = {
        position: 'absolute',
        width: GameBoardConstants.SPRITE_SIZE+'px',
        height: GameBoardConstants.SPRITE_SIZE+'px',
        top:  (this.props.model.y*GameBoardConstants.GAME_BOARD_PLAYABLE_SIZE -(GameBoardConstants.SPRITE_SIZE/2))  +'px' ,
        left: (this.props.model.x*GameBoardConstants.GAME_BOARD_PLAYABLE_SIZE -(GameBoardConstants.SPRITE_SIZE/2))  +'px'
      }
    return (
        <img src={this.props.sprite} className="sprite" style={customStyle} />
    );
  }
}

export default Sprite;