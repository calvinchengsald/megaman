
const { GameModes, RoomState, PlayerState }  = require('../../Constants/GameBoardConstants');
const { GameConstants, DirectionMatrix, AvatarConstants, AttackConstants } = require('../NoEscape/GameConstants')
const Utility = require('../../Utils/Utility');


class TeamFight {

    constructor(ioSocket, room, leaderboard){
        console.log("initialized game No Escape")
        this.ioSocket = ioSocket
        this.room = room
        this.leaderboard = leaderboard
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

    }
    
    start(){
        console.log("start game")
        this.room.roomState=RoomState.IN_GAME
        //set all players to ALIVE and reset their positions
        this.room.players.forEach(player => {
            player.state = PlayerState.ALIVE
            player.x = 0.5
            player.y = 0.5
            player.animationFrame = 0
            player.animationTimer = 1
        })
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
}

module.exports = {
    TeamFight: TeamFight
}