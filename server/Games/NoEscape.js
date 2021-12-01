
const { GameBoardConstants, RoomState, PlayerState }  = require('../Constants/GameBoardConstants');
const Utility = require('../Utils/Utility');

class NoEscape {

    constructor(ioSocket, room){
        console.log("initialized game No Escape")
        this.ioSocket = ioSocket
        this.room = room
        this.room.attacks = []
        console.log(this.room)

        // counts up, when reachs 1 will spawn an attack
        this.createAttackSpawn = 0
    }


    run(noEscapeGame){
        var skipTicks = 1000 / GameBoardConstants.GAME_FPS;
        var nextGameTick = (new Date).getTime();

        return function(noEscapeGame) {
            if ((new Date).getTime() > nextGameTick) {
                nextGameTick += skipTicks;
                noEscapeGame.update();
                noEscapeGame.ioSocket.to("room_"+noEscapeGame.room.roomCode).emit("ROOM_UPDATE",JSON.stringify(Utility.basicJson("room", noEscapeGame.room)));
              }
        }
    }
    
    // run(noEscapeGame){
    //     this.targetDeltaUntilUpdate = 1000 / GameBoardConstants.GAME_FPS;
    //     this.deltaUntilUpdate=this.targetDeltaUntilUpdate
    //     this.lastUpdateTime=(new Date).getTime()

    //     return function(noEscapeGame) {
    //         const currentTime = (new Date).getTime()
    //         var delta = currentTime-noEscapeGame.lastUpdateTime
    //         noEscapeGame.deltaUntilUpdate-=delta;
    //         if(noEscapeGame.deltaUntilUpdate<=0){
    //             noEscapeGame.deltaUntilUpdate=noEscapeGame.targetDeltaUntilUpdate
    //             noEscapeGame.update(delta);
    //             noEscapeGame.ioSocket.to("room_"+noEscapeGame.room.roomCode).emit("ROOM_UPDATE",JSON.stringify(Utility.basicJson("room", noEscapeGame.room)));
    //         } 
    //         noEscapeGame.lastUpdateTime=currentTime
    //     }
    // }



    update() {
        // check for collision before movement
        // loop through all players, if they have move matrix and alive then move them
        this.room.players.forEach(player => {
            if(player.playerState!==PlayerState.ALIVE) return
            if(this.checkCollision(player)){
                console.log('player killed')
                player.playerState=PlayerState.DEAD
                return
            } 
            if(player.MOVE_UP){
                player.y -= GameBoardConstants.PLAYER_MOVE_SPEED_PER_FRAME
                player.y = Math.max(player.y, 0.05)
            }
            if(player.MOVE_DOWN){
                player.y += GameBoardConstants.PLAYER_MOVE_SPEED_PER_FRAME
                player.y = Math.min(player.y, 0.95)
            }
            if(player.MOVE_LEFT){
                player.x -= GameBoardConstants.PLAYER_MOVE_SPEED_PER_FRAME
                player.x = Math.max(player.x, 0.05)
            }
            if(player.MOVE_RIGHT){
                player.x += GameBoardConstants.PLAYER_MOVE_SPEED_PER_FRAME
                player.x = Math.min(player.x, 0.95)
            }
        })


        // remove attacks outside of bounds
        const validAttacks = []
        this.room.attacks.forEach(attack => {
            if(this.attackInBounds(attack)){
                validAttacks.push(attack)
            }
        })
        this.room.attacks=validAttacks
        // move all attacks
        this.room.attacks.forEach(attack => {
            attack.x += attack.xSpeed
            attack.y += attack.ySpeed
        })

        // createAttack
        this.createAttackSpawn+=GameBoardConstants.ATTACK_SPAWN_PER_FRAME
        if(this.createAttackSpawn>1){
            this.createAttackSpawn-=1
            this.createAttack()
        }

        //check for game over
        this.gameOver()
    }

    //checks if the conditions are met to end this game
    gameOver(){
        //all players are dead?
        const players = this.room.players
        var havePlayerAlive = false
        for( var i = 0; i<players.length; i++){
            if(players[i].playerState===PlayerState.ALIVE){
                havePlayerAlive = true;
            }
        }

        if(havePlayerAlive){
            // not game over - nothing to do
            return
        }

        //game over - end the game
        this.end()
    }

    // returns if this attack is still within the board and should be removed
    attackInBounds(attack){
        return !(attack.x <= -0.05 || attack.x >= 1.05 || attack.y <= -0.05 || attack.y >= 1.05)
    }

    // checek this players position against every attack, if within collision then return true
    checkCollision(player){
        const attacks = this.room.attacks
        for( var i = 0; i<attacks.length; i++){
            if( Math.abs(attacks[i].x-player.x)<=GameBoardConstants.COLLISION_TOLERANCE &&
                Math.abs(attacks[i].y-player.y)<=GameBoardConstants.COLLISION_TOLERANCE )
            return true
        }
        return false;
    }

    createAttack() {
        // which way is it moving
        const moveDir = Math.floor(Math.random() * 4);
        const spawnPoint = Math.floor(Math.random() * (96) + 5)/100
        const attack = {}
        switch(moveDir){
            // move right
            case(0): 
                attack.xSpeed = GameBoardConstants.ATTACK_MOVE_SPEED_PER_FRAME
                attack.ySpeed = 0
                attack.x = 0
                attack.y = spawnPoint
                break;
            // move down
            case(1): 
                attack.xSpeed = 0
                attack.ySpeed = GameBoardConstants.ATTACK_MOVE_SPEED_PER_FRAME
                attack.x = spawnPoint
                attack.y = 0
                break;
            // move left
            case(2): 
                attack.xSpeed = -GameBoardConstants.ATTACK_MOVE_SPEED_PER_FRAME
                attack.ySpeed = 0
                attack.x = 1
                attack.y = spawnPoint
                break;
            // move up
            case(3): 
                attack.xSpeed = 0
                attack.ySpeed = -GameBoardConstants.ATTACK_MOVE_SPEED_PER_FRAME
                attack.x = spawnPoint
                attack.y = 1
                break;
        }
        this.room.attacks.push(attack)
    }

    start(){
        console.log("start game")
        this.room.roomState=RoomState.IN_GAME
        //set all players to ALIVE and reset their positions
        this.room.players.forEach(player => {
            player.playerState = PlayerState.ALIVE
            player.x = 0.5
            player.y = 0.5
        })
        this.room.attacks = []
        this.gameLoop = setInterval(this.run(), 0, this);
    }
    end() {
        clearInterval(this.gameLoop)
        this.room.players.forEach(player => {
            player.playerState = PlayerState.READY
        })
        this.room.roomState=RoomState.IN_LOBBY
    }
        
}

module.exports = {
    NoEscape: NoEscape
}