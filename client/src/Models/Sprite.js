import React, { Component } from "react";
import spazz from '../resources/spazz.png';
import { GameBoardConstants } from '../Constants/GameBoardConstants'


class Sprite extends React.Component {




  render() {
      const customStyle = {
        position: 'absolute',
        width: GameBoardConstants.SPRITE_SIZE+'px',
        height: GameBoardConstants.SPRITE_SIZE+'px',
        top:  (this.props.player.y*GameBoardConstants.GAME_BOARD_PLAYABLE_SIZE -(GameBoardConstants.SPRITE_SIZE/2))  +'px' ,
        left: (this.props.player.x*GameBoardConstants.GAME_BOARD_PLAYABLE_SIZE -(GameBoardConstants.SPRITE_SIZE/2))  +'px'
      }
    return (
        <img src={spazz} className="sprite" style={customStyle} />
    );
  }
}

export default Sprite;