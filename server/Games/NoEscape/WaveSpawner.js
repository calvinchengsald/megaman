

// This class is meant to control the way attacks spawn
// Each wave spawner is configurable to spawn a certain pattern of attacks
class WaveSpawner{

    constructor(createAttack, spawnerData) {
        this.createAttack = createAttack
        this.spawnerData = spawnerData
        this.initialize()
    }

    initialize(){
        this.currentTime=0;
        // spawn first one immediately
        this.spawnAttackTime=0
        this.spawnWaveCount=0
    }

    update(dt){
        // console.log("Wave spawner update " + dt)
        // console.log("currentTime " + this.currentTime)
        // console.log("triggerTime " + this.spawnerData.triggerTime)
        // console.log("spawnWaveCount " + this.spawnWaveCount)
        // console.log("waveCount " + this.spawnerData.waveCount)
        // console.log(this.currentTime < this.spawnerData.triggerTime)
        // console.log(this.spawnWaveCount >= this.spawnerData.waveCount)
        this.currentTime+=dt;
        if(this.currentTime < this.spawnerData.triggerTime || this.spawnWaveCount >= this.spawnerData.waveCount) return
        this.spawnAttackTime-=dt

        //spawn attack according to the spawn schedule
        if(this.spawnAttackTime<=0){
            // reset attack spawn timer to its original spawn interval
            this.spawnAttackTime=this.spawnerData.spawnInterval
            this.spawnWaveCount++
            for(var i = 0; i<this.spawnerData.spawnCount; i++){
                this.createAttack(this.spawnerData.attack)
            }
        }
    }

}

module.exports = {
    WaveSpawner: WaveSpawner
}