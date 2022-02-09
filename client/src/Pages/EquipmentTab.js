

import shotgun from '../resources/weapons/shotgun.png'
import burst from '../resources/bullets/burst.png'
import './EquipmentTab.css'
import StatCard from '../Models/StatCard'
import {StatCardTypes} from '../Models/StatCard'
const EquipmentTab = (props) => {
    return(
        <div className="inventory-container">
          <div className="weapon-container">
            <div className="inventory">
              <div>Weapons</div>
              {props.player.weapons && props.player.weapons.map((weapon) =>
                <img onClick={()=>props.setSelectedWeapon(weapon)} className={"item-icon rarity rarity-" +weapon.rarity + (props.selectedWeapon&&props.selectedWeapon.id===weapon.id?" selected":"")} src={shotgun}/>
              )}
            </div>
            <StatCard item={props.selectedWeapon} setSelectedBullet={props.setSelectedBullet} setWeaponBulletRelationship={props.setWeaponBulletRelationship} selectedBullet={props.selectedBullet} type={StatCardTypes.WEAPON} bullets={props.player.bullets}/>
          </div>
          <div className="bullet-container">
            <div className="inventory">
              <div>Bullets</div>
              {props.player.bullets && props.player.bullets.map((bullet) =>
                <img onClick={()=>props.setSelectedBullet(bullet)} className={"item-icon rarity rarity-" +bullet.rarity + (props.selectedBullet&&props.selectedBullet.id===bullet.id?" selected":"")} src={burst}/>
              )}
            </div>
            <StatCard item={props.selectedBullet} type={StatCardTypes.BULLET} selectedWeapon={props.selectedWeapon} setWeaponBulletRelationship={props.setWeaponBulletRelationship}/>
          </div>
        </div>
  )
}

export default EquipmentTab
