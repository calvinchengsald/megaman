
const { GameModes, RoomState, PlayerState, PlayerInputOptions }  = require('../../Constants/GameBoardConstants');
const { GameConstants, DirectionMatrix, AvatarConstants, AttackConstants, TeamConstants } = require('../TeamFight/GameConstants')
const Utility = require('../../Utils/Utility');


class TeamFight {

    constructor(ioSocket, room, leaderboard){
        console.log("initialized game TeamFight")
        this.ioSocket = ioSocket
        this.room = room
        this.leaderboard = leaderboard
        this.room.timer=0

        //players are in 2 teams, each with their respective attacks
        this.room.leftTeam ={
            players: [],
            attacks: []
        }
        this.room.rightTeam ={
            players: [],
            attacks: []
        }

        // room y position shrinkage. As the game goes on this value will increase
        // 0.5 will mean the whole screen is out of outbounds (50% top and 50% bottom)
        this.roomBound = 0
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
        playerObject.spriteSize=GameConstants.SPRITE_UNIT_SIZE
        // if no avatar type then lets default to Spazz
        playerObject.type=playerObject.type?playerObject.type:AvatarConstants.Spazz.NAME

        //join a team
        if(this.room.leftTeam.players.length<=this.room.rightTeam.players.length){
            this.room.leftTeam.players.push(playerObject)
        } else {
            this.room.rightTeam.players.push(playerObject)
        }
    }

    run(teamFightGame){
        var skipTicks = 1000 / GameConstants.GAME_FPS;
        var nextGameTick = (new Date).getTime();

        return function(teamFightGame) {
            if ((new Date).getTime() > nextGameTick) {
                nextGameTick += skipTicks;
                teamFightGame.update();
                teamFightGame.ioSocket.to("room_"+teamFightGame.room.roomCode).emit("ROOM_UPDATE",JSON.stringify(Utility.basicJson("room", teamFightGame.room)));
              }
        }
    }

    update(){
        this.room.timer += GameConstants.TIME_PER_FRAME

        // check for collision before movement
        // loop through all players, if they have move matrix and alive then move them
        this.room.leftTeam.players.forEach(player => {
            if(player.state===PlayerState.ALIVE) {
                if(this.checkCollision(player, TeamConstants.LEFT)){
                    console.log('player killed')
                    player.state=PlayerState.DYING
                    player.animationTimer=1
                    player.animationFrame=0
                    return
                } 
                this.handlePlayerMovement(player)
            }

            if(player.state===PlayerState.ALIVE || player.state===PlayerState.DYING){
                this.handlePlayerAnimation(player)
            }
        })

        this.room.rightTeam.players.forEach(player => {
            if(player.state===PlayerState.ALIVE) {
                if(this.checkCollision(player, TeamConstants.RIGHT)){
                    console.log('player killed')
                    player.state=PlayerState.DYING
                    player.animationTimer=1
                    player.animationFrame=0
                    return
                } 
                this.handlePlayerMovement(player)
            }

            if(player.state===PlayerState.ALIVE || player.state===PlayerState.DYING){
                this.handlePlayerAnimation(player)
            }
        })

        // remove attacks outside of bounds
        this.room.leftTeam.attacks=this.handleAttackAnimationAndMovement(this.room.leftTeam.attacks, TeamConstants.LEFT)
        this.room.rightTeam.attacks=this.handleAttackAnimationAndMovement(this.room.rightTeam.attacks, TeamConstants.RIGHT)

        //check for game over
        this.gameOver()
    }
    
    /**
     * handles all attack animation and movement
     * @param [Object] attacks - array of attack jsons
     * @param {TeamConstants} team - TeamConstants.LEFT
     */
    handleAttackAnimationAndMovement(attacks, team){
        const validAttacks = []
        attacks.forEach(attack => {
            if(this.attackInBounds(attack) && (!attack.state || attack.state!==PlayerState.DEAD)){
                validAttacks.push(attack)
            }
        })
        // move all attacks
        validAttacks.forEach(attack => {
            this.handleAttackMovement(attack)
            this.handleAttackAnimation(attack)
        })
        return validAttacks
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

    
    handlePlayerInput(messageJson){
        switch(messageJson.playerInputAction){
            case PlayerInputOptions.ATTACK:
                // target room
                var targetPlayer = Utility.getFromArray(this.room.players, "clientId", messageJson.clientId)
                this.createAttack(messageJson.attack, targetPlayer)
                return true;
            default:
                return false;
        }
    }


    /**
     * check this players position against every attack, if within collision then return true
     * left players can only collide with right attacks and vice versa
     * @param {Object} player - player json
     * @param {TeamConstants} team - TeamConstants.LEFT
     */
    checkCollision(player, team){
        const attacks = team===TeamConstants.LEFT?this.room.rightTeam.attacks:this.room.leftTeam.attacks
        for( var i = 0; i<attacks.length; i++){
            //also might as well kill the missle that collided with the player
            if( Math.abs(attacks[i].x-player.x)<=GameConstants.COLLISION_TOLERANCE &&
                Math.abs(attacks[i].y-player.y)<=GameConstants.COLLISION_TOLERANCE ) {
                    attacks[i].state=PlayerState.DEAD
                    return true
                }
        }
        return false;
    }

    /**
     * Creates an attack of type: attackName for the team
     * @param {AttackConstants} attackName - AttackConstants.BURST 
     * @param {Object} shooter - Player json that created this attack
     */
    createAttack(attackName, shooter) {
        // is this a valid avatar type?
        const attackConstant = AttackConstants[attackName].NAME
        if(!attackConstant){
            console.log("unable to create an attack of type: " + attackName)
            return
        }

        // which team is this player from
        let team
        if(Utility.existsInArray(this.room.leftTeam.players, "clientId", shooter.clientId)){
            team = TeamConstants.LEFT
        } else if (Utility.existsInArray(this.room.rightTeam.players, "clientId", shooter.clientId)){
            team = TeamConstants.RIGHT
        } else {
            console.log("unable to create an attack because the shooter is not in any team")
            return
        }

        // Left team attacks will always move right
        // Right team attacks will always move left
        // spawn attack at the x and y point of the shooter
        const attack = {
            type: attackName,
            animationFrame: 0,
            animationTimer: 1,
            spriteSize: GameConstants.SPRITE_UNIT_SIZE,
            moveDirection: team===TeamConstants.LEFT?DirectionMatrix.RIGHT:DirectionMatrix.LEFT,
            x: shooter.x,
            y: shooter.y,
            SPECIAL_ATTRIBUTES: {}
        }
        Object.assign(attack.SPECIAL_ATTRIBUTES,attackConstant.SPECIAL_ATTRIBUTES)
        
        if(team===TeamConstants.LEFT){
            this.room.leftTeam.attacks.push(attack)
        } else {
            this.room.rightTeam.attacks.push(attack)
        }
    }
    
    start(){
        console.log("start game")
        this.room.roomState=RoomState.IN_GAME
        //set all players to ALIVE and reset their positions according to their team
        this.room.leftTeam.players.forEach(player => {
            player.state = PlayerState.ALIVE
            player.x = 0.1
            player.y = Math.floor(Math.random() * (92) + 4)/100
            player.animationFrame = 0
            player.animationTimer = 1
        })
        this.room.rightTeam.players.forEach(player => {
            player.state = PlayerState.ALIVE
            player.x = 0.9
            player.y = Math.floor(Math.random() * (92) + 4)/100
            player.animationFrame = 0
            player.animationTimer = 1
        })
        this.room.leftTeam.attacks=[]
        this.room.rightTeam.attacks=[]
        this.room.timer = 0
        this.gameLoop = setInterval(this.run(), 0, this);
    }

    end() {
        console.log("ending game")
        clearInterval(this.gameLoop)
        this.room.players.forEach(player => {
            player.state = PlayerState.READY
        })
        this.room.roomState=RoomState.IN_LOBBY
    }

    
    //checks if the conditions are met to end this game
    gameOver(){
        //all players are dead?
        var havePlayerAliveLeft = false
        const leftPlayers = this.room.leftTeam.players
        for( var i = 0; i<leftPlayers.length; i++){
            if(leftPlayers[i].state===PlayerState.ALIVE || leftPlayers[i].state===PlayerState.DYING){
                havePlayerAliveLeft = true;
            }
        }
        var havePlayerAliveRight = false
        const rightPlayers = this.room.rightTeam.players
        for( var i = 0; i<rightPlayers.length; i++){
            if(rightPlayers[i].state===PlayerState.ALIVE || rightPlayers[i].state===PlayerState.DYING){
                havePlayerAliveRight = true;
            }
        }

        if(havePlayerAliveLeft && havePlayerAliveRight){
            // not game over - nothing to do
            return
        }

        //game over - end the game
        this.end()
    }
}

module.exports = {
    TeamFight: TeamFight
}