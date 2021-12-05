
const { GameModes, RoomState, PlayerState }  = require('../../Constants/GameBoardConstants');
const { GameConstants, DirectionMatrix, AvatarConstants, AttackConstants } = require('./GameConstants')
const { WaveSpawner } = require('./WaveSpawner')
const Utility = require('../../Utils/Utility');
const fs = require('fs');

class NoEscape {

    constructor(ioSocket, room, leaderboard){
        console.log("initialized game No Escape")
        this.ioSocket = ioSocket
        this.room = room
        this.room.attacks = []
        this.room.score = 0
        //keeps track of the time this game has been running
        this.room.timer = 0
        this.leaderboard = leaderboard
        this.setRoomHighScore()
        console.log(this.room)

        // counts up, when reachs 1 will spawn an attack
        this.createAttackSpawn = 0

        //configure the wave spawners
        const waveSpawnerFile = fs.readFileSync('Games/NoEscape/resources/spawner.json');
        const spawnerData = JSON.parse(waveSpawnerFile);
        this.waveSpawners = []
        //create a wave spawner object for each spawn data in the file
        for(var i = 0; i<spawnerData.length; i++){
            const waveSpawner = new WaveSpawner((attack)=>this.createAttack(attack, this.room.attacks), spawnerData[i])
            this.waveSpawners.push(waveSpawner)
        }
    }

    // handle create game needed when creating this game.
    // event bubbled down from creating room
    handleCreateGame(playerObject){
        this.handleJoinRoom(playerObject)
    }

    handleJoinRoom(playerObject){
        // this game rquires every player to have an initial position and an avatar type
        playerObject.x=0.5
        playerObject.y=0.5
        // if no avatar type then lets default to Spazz
        playerObject.type=playerObject.type?playerObject.type:AvatarConstants.Spazz.NAME
    }

    run(noEscapeGame){
        var skipTicks = 1000 / GameConstants.GAME_FPS;
        var nextGameTick = (new Date).getTime();

        return function(noEscapeGame) {
            if ((new Date).getTime() > nextGameTick) {
                nextGameTick += skipTicks;
                noEscapeGame.update();
                noEscapeGame.ioSocket.to("room_"+noEscapeGame.room.roomCode).emit("ROOM_UPDATE",JSON.stringify(Utility.basicJson("room", noEscapeGame.room)));
              }
        }
    }

    update() {
        this.room.time += GameConstants.TIME_PER_FRAME
        this.room.score += GameConstants.POINTS_PER_FRAME

        // check for collision before movement
        // loop through all players, if they have move matrix and alive then move them
        this.room.players.forEach(player => {
            if(player.state===PlayerState.ALIVE) {
                if(this.checkCollision(player)){
                    console.log('player killed')
                    player.state=PlayerState.DYING
                    player.animationTimer=1
                    player.animationFrame=0
                    return
                } 
                this.handlePlayerMovement(player)
            }

            // you get points for dying animation as well :)
            if(player.state===PlayerState.ALIVE || player.state===PlayerState.DYING){
                player.score = this.room.score
                this.handlePlayerAnimation(player)
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
            this.handleAttackMovement(attack)
            this.handleAttackAnimation(attack)
        })

        // createAttack
        // this.createAttackSpawn+=GameConstants.ATTACK_SPAWN_PER_FRAME
        // if(this.createAttackSpawn>1){
        //     this.createAttackSpawn-=1
        //     this.createAttack( Math.floor(Math.random()*2)>=1?AttackConstants.Burst.NAME:AttackConstants.Boomerang.NAME)
        // }

        this.waveSpawners.map((waveSpawner)=>{
            waveSpawner.update(GameConstants.TIME_PER_FRAME)
        })

        //check for game over
        this.gameOver()
    }

    //checks where the player is moving and move them
    // also keeps them within the boundary of the board
    handlePlayerMovement(player){
        if(player.state !== PlayerState.ALIVE) return
        if(player.MOVE_UP){
            player.y -= GameConstants.PLAYER_MOVE_SPEED_PER_FRAME
            player.y = Math.max(player.y, 0.05)
        }
        if(player.MOVE_DOWN){
            player.y += GameConstants.PLAYER_MOVE_SPEED_PER_FRAME
            player.y = Math.min(player.y, 0.95)
        }
        if(player.MOVE_LEFT){
            player.x -= GameConstants.PLAYER_MOVE_SPEED_PER_FRAME
            player.x = Math.max(player.x, 0.05)
        }
        if(player.MOVE_RIGHT){
            player.x += GameConstants.PLAYER_MOVE_SPEED_PER_FRAME
            player.x = Math.min(player.x, 0.95)
        }
    }

    // when the players animationTimer<0 then it is time to advance their animation frame
    handlePlayerAnimation(player){
        player.animationTimer-= AvatarConstants[player.type][player.state].ANIMATION_SPEED_PER_FRAME
        if(player.animationTimer<=0){
            player.animationTimer=1
            //if we are looping animation for DYING, then set it to DEAD
            if(player.state===PlayerState.DYING && player.animationFrame+1===AvatarConstants[player.type].DYING.ANIMATION_MAX_FRAME){
                player.state=PlayerState.DEAD
                player.animationFrame=0
                return
            }
            player.animationFrame= (player.animationFrame+1)%AvatarConstants[player.type][player.state].ANIMATION_MAX_FRAME
        } 
    }
    
    // when the players animationTimer<0 then it is time to advance their animation frame
    handleAttackAnimation(attack){
        attack.animationTimer-= AttackConstants[attack.type].ANIMATION_SPEED_PER_FRAME
        if(attack.animationTimer<=0){
            attack.animationTimer=1
            attack.animationFrame= (attack.animationFrame+1)%AttackConstants[attack.type].ANIMATION_MAX_FRAME
        } 
    }

    handleAttackMovement(attack){
        switch(attack.moveDirection){
            case(DirectionMatrix.RIGHT): 
                attack.x += AttackConstants[attack.type].MOVE_SPEED_PER_FRAME
                break;
            case(DirectionMatrix.DOWN): 
                attack.y += AttackConstants[attack.type].MOVE_SPEED_PER_FRAME
                break;
            case(DirectionMatrix.LEFT): 
                attack.x -= AttackConstants[attack.type].MOVE_SPEED_PER_FRAME
                break;
            case(DirectionMatrix.UP): 
                attack.y -= AttackConstants[attack.type].MOVE_SPEED_PER_FRAME
                break;
        }
    }

    //checks if the conditions are met to end this game
    gameOver(){
        //all players are dead?
        const players = this.room.players
        var havePlayerAlive = false
        for( var i = 0; i<players.length; i++){
            if(players[i].state===PlayerState.ALIVE || players[i].state===PlayerState.DYING){
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
        //for attacks that can rebound, reverse their direction if they are out of bounds
        if(attack.SPECIAL_ATTRIBUTES.RETURN_COUNT && attack.SPECIAL_ATTRIBUTES.RETURN_COUNT>0){
            if(attack.x <= -0.03 || attack.x >= 1.03 || attack.y <= -0.03 || attack.y >= 1.03){
                switch(attack.moveDirection){
                    case(DirectionMatrix.RIGHT): 
                        attack.moveDirection = DirectionMatrix.LEFT;
                        attack.x = 1
                        break;
                    case(DirectionMatrix.LEFT): 
                        attack.moveDirection = DirectionMatrix.RIGHT;
                        attack.x = 0
                        break;
                    case(DirectionMatrix.UP): 
                        attack.moveDirection = DirectionMatrix.DOWN;
                        attack.y = 0
                        break;
                    case(DirectionMatrix.DOWN): 
                        attack.moveDirection = DirectionMatrix.UP;
                        attack.y = 1
                        break;
                }
                attack.SPECIAL_ATTRIBUTES.RETURN_COUNT--;
            }
        }
        return !(attack.x <= -0.03 || attack.x >= 1.03 || attack.y <= -0.03 || attack.y >= 1.03)
    }

    // check this players position against every attack, if within collision then return true
    checkCollision(player){
        const attacks = this.room.attacks
        for( var i = 0; i<attacks.length; i++){
            if( Math.abs(attacks[i].x-player.x)<=GameConstants.COLLISION_TOLERANCE &&
                Math.abs(attacks[i].y-player.y)<=GameConstants.COLLISION_TOLERANCE )
            return true
        }
        return false;
    }

    createAttack(attackName, attacks) {
        // is this a valid avatar type?
        const attackConstant = AttackConstants[attackName]
        if(!attackConstant){
            console.log("unable to create an attack of type: " + attackName)
            return
        }
        // which way is it moving
        const moveDir = DirectionMatrix[Object.keys(DirectionMatrix)[Math.floor(Math.random() * 4)]];
        const spawnPoint = Math.floor(Math.random() * (94) + 3)/100
        const attack = {
            type: attackName,
            animationFrame: 0,
            animationTimer: 1,
            SPECIAL_ATTRIBUTES: {}
        }
        Object.assign(attack.SPECIAL_ATTRIBUTES,attackConstant.SPECIAL_ATTRIBUTES)
        switch(moveDir){
            // move right
            case(DirectionMatrix.RIGHT): 
                attack.moveDirection = moveDir
                attack.x = 0
                attack.y = spawnPoint
                break;
            // move down
            case(DirectionMatrix.DOWN): 
                attack.moveDirection = moveDir
                attack.x = spawnPoint
                attack.y = 0
                break;
            // move left
            case(DirectionMatrix.LEFT): 
                attack.moveDirection = moveDir
                attack.x = 1
                attack.y = spawnPoint
                break;
            // move up
            case(DirectionMatrix.UP): 
                attack.moveDirection = moveDir
                attack.x = spawnPoint
                attack.y = 1
                break;
        }
        attacks.push(attack)
    }

    start(){
        console.log("start game")
        this.setRoomHighScore()
        this.room.roomState=RoomState.IN_GAME
        //set all players to ALIVE and reset their positions
        this.room.players.forEach(player => {
            player.state = PlayerState.ALIVE
            player.x = 0.5
            player.y = 0.5
            player.animationFrame = 0
            player.animationTimer = 1
        })
        this.room.attacks = []
        this.room.score = 0
        this.room.timer = 0
        this.waveSpawners.map((waveSpawner)=>{
            waveSpawner.initialize()
        })
        this.gameLoop = setInterval(this.run(), 0, this);
    }

    end() {
        console.log("ending game")
        clearInterval(this.gameLoop)
        //set the high score if applicable:
        for(var i = 0; i<this.room.players.length; i++){
            if(this.room.players[i].score && this.room.players[i].score > this.leaderboard.highScore){
                this.leaderboard.highScore = this.room.players[i].score
                this.leaderboard.highScoreName = this.room.players[i].displayName
            }
        }
        this.setRoomHighScore()

        this.room.players.forEach(player => {
            player.state = PlayerState.READY
        })
        this.room.roomState=RoomState.IN_LOBBY
    }

    // set the room high score levels by copying whats in the Leaderboard
    setRoomHighScore(){
        this.room.highScore = this.leaderboard.highScore
        this.room.highScoreName = this.leaderboard.highScoreName
    }
        
}

module.exports = {
    NoEscape: NoEscape
}