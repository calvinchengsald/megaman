

import shotgun from '../resources/weapons/shotgun.png'
import burst from '../resources/bullets/burst.png'
import './EquipmentTab.css'
const EquipmentTab = (props) => {
    console.log(props)
    return(
        <div className="inventory-container">
          <div className="weapon-container">
            <div className="inventory">
              <div>Weapons</div>
              {props.player.weapons && props.player.weapons.map((weapon) =>
                <img className={"item-icon rarity rarity-" +weapon.rarity} src={shotgun}/>
              )}
            </div>
            <div className="stat-card">Stat Card here</div>
          </div>
          <div className="bullet-container">
            <div className="inventory">
              <div>Bullets</div>
              {props.player.bullets && props.player.bullets.map((bullet) =>
                <img className={"item-icon rarity rarity-" +bullet.rarity} src={burst}/>
              )}
            </div>
            <div className="stat-card">Stat Card here</div>
          </div>
        </div>
  )
}

export default EquipmentTab
