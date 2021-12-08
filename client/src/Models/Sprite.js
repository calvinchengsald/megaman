import React, { Component } from "react";
import { AvatarConstants, AttackConstants } from '../Constants/GlobalGameConstants'
import { GameBoardConstants, DirectionMatrix } from '../Games/NoEscape/GameConstants'
import './Sprite.css';
class Sprite extends React.Component {

  render() {
      const spriteSize = GameBoardConstants.GAME_BOARD_PLAYABLE_SIZE*this.props.model.spriteSize;
      const spriteStyle = {
        position: 'absolute',
        width: spriteSize+'px',
        height: spriteSize+'px',
        top:  (this.props.model.y*GameBoardConstants.GAME_BOARD_PLAYABLE_SIZE - (spriteSize/2))  +'px' ,
        left: (this.props.model.x*GameBoardConstants.GAME_BOARD_PLAYABLE_SIZE - (spriteSize/2))  +'px',
        zIndex: this.props.mainPlayer?98:1
      }
      if(this.props.model.moveDirection){
          switch(this.props.model.moveDirection){
              case(DirectionMatrix.RIGHT):
                spriteStyle.transform = 'rotate(90deg)'
                break
              case(DirectionMatrix.DOWN):
                spriteStyle.transform = 'rotate(180deg)'
                break
              case(DirectionMatrix.LEFT):
                spriteStyle.transform = 'rotate(270deg)'
                break
          }
      }
      const nameStyle = {
        position: 'absolute',
        width: spriteSize+'px',
        top:  (this.props.model.y*GameBoardConstants.GAME_BOARD_PLAYABLE_SIZE - 20 - (spriteSize/2))   +'px' ,
        left: (this.props.model.x*GameBoardConstants.GAME_BOARD_PLAYABLE_SIZE - (spriteSize/2))   +'px',
        'text-align': 'center'
      }
      const imageDiv = 
        this.props.type==="avatar"?
        <img src={AvatarConstants[this.props.model.type][this.props.model.state][this.props.model.animationFrame]} className='sprite' style={spriteStyle} />
        :
        <img src={AttackConstants[this.props.model.type].DEFAULT[this.props.model.animationFrame]} className="sprite" style={spriteStyle} />
    return (
        <React.Fragment>
            {this.props.model.displayName?
            <div style={nameStyle}>{this.props.model.displayName}</div>
            :
            <React.Fragment/>
            }
            {imageDiv}
        </React.Fragment>
    );
  }
}

export default Sprite;