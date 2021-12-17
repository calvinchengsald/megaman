import React, { Component } from "react";
import { AvatarConstants, AttackConstants } from '../Constants/GlobalGameConstants'
import { GameBoardConstants, DirectionMatrix } from '../Games/NoEscape/GameConstants'
import shotgun from '../resources/weapons/shotgun.png'
import burst from '../resources/bullets/burst.png'
import empty from '../resources/bullets/empty.png'
import './StatCard.css';
import {getFromArray} from "../Utils/Utility";
const StatCard = (props) => {
    const emptyBullets = []
    if(props.item){
        console.log(props.item.bullets)
        for(let i = props.item.bullets?props.item.bullets.length:0; i<props.item.slots; i++){
            emptyBullets.push(<img className="stat-card-bullet-icon rarity rarity-Rare" src={empty}/>)
        }
    }

    return(
        <div className="stat-card">
            {props.item?
                <React.Fragment>
                    {props.type===StatCardTypes.WEAPON?
                        <React.Fragment>
                            <div className={"stat-card-top-bot"}>
                                <img className={"stat-card-item-icon stat-card-rarity rarity-" +props.item.rarity} src={shotgun}/>
                                <div className="stat-card-top-right">
                                    <div>Type: {props.item.type}</div>
                                    <div>Rarity: {props.item.rarity}</div>
                                    <div>Slots: {props.item.slots}</div>
                                </div>
                            </div>
                            <div className="stat-card-top-bot">
                                {props.item.bullets && props.item.bullets.map((bullet)=>{
                                    const bulletJson = getFromArray(props.bullets, "id", bullet);
                                    return(
                                    <img className={"stat-card-bullet-icon rarity rarity-"+bulletJson.rarity + (props.selectedBullet&&props.selectedBullet.id===bulletJson.id?" selected":"")} src={burst}
                                        onClick={()=>props.setSelectedBullet(bulletJson)}
                                    />)
                                })}
                                {emptyBullets}
                            </div>
                        </React.Fragment>
                        :
                        <React.Fragment>
                            <div className={"stat-card-top-bot"}>
                                <img className={"stat-card-item-icon stat-card-rarity rarity-" +props.item.rarity} src={burst}/>
                                <div className="stat-card-top-right">
                                    <div>Type: {props.item.type}</div>
                                    <div>Rarity: {props.item.rarity}</div>
                                    <div>Damage: {props.item.damage}</div>
                                    <div>Reload Speed: {props.item.reloadSpeed}</div>
                                </div>
                            </div>
                        </React.Fragment>
                    }
                </React.Fragment>
            :
            <div className="centered-main-text">
                <div className="">Select an item</div>
            </div>
            }
            
        </div>
    );
}

export default StatCard;



export const StatCardTypes = {
    WEAPON: "WEAPON",
    BULLET: "BULLET"
}