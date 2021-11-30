
const { GameBoardConstants: GameBoardConstants }  = require('../Constants/GameBoardConstants');
const Utility = require('../Utils/Utility');

class NoEscape {

    constructor(ioSocket, room){
        console.log("initialized game No Escape")
        this.ioSocket = ioSocket
        this.room = room
        console.log(this.room)
    }


    run(noEscapeGame){
        var skipTicks = 1000 / GameBoardConstants.GAME_FPS;
        var nextGameTick = (new Date).getTime();

        return function(noEscapeGame) {
            while ((new Date).getTime() > nextGameTick) {
                console.log("game update")
                nextGameTick += skipTicks;
                noEscapeGame.update();
                noEscapeGame.ioSocket.to("room_"+noEscapeGame.room.roomCode).emit("ROOM_UPDATE",JSON.stringify(Utility.basicJson("room", noEscapeGame.room)));
              }
        }
    }


    update() {
        // loop through all players, if they have move matrix then move them
        Object.keys(this.room.players).forEach(key => {
            const player = this.room.players[key]
            if(player.MOVE_UP){
                player.y -= GameBoardConstants.PLAYER_MOVE_SPEED_PER_FRAME
            }
            if(player.MOVE_DOWN){
                player.y += GameBoardConstants.PLAYER_MOVE_SPEED_PER_FRAME
            }
            if(player.MOVE_LEFT){
                player.x -= GameBoardConstants.PLAYER_MOVE_SPEED_PER_FRAME
            }
            if(player.MOVE_RIGHT){
                player.x += GameBoardConstants.PLAYER_MOVE_SPEED_PER_FRAME
            }
        })
    }

    start(){
        console.log("start game")
        this.gameLoop = setInterval(this.run(), 0, this);
    }
    end() {
        clearInterval(this.gameLoop)
    }
        
}

module.exports = {
    NoEscape: NoEscape
}