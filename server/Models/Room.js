
const { GameModes, RoomState, PlayerState, PlayerInputOptions }  = require('../Constants/GameBoardConstants');
const Utility = require('../Utils/Utility');
class Room {

    constructor(roomJson, gameObject, emitError){
        this.gameObject = gameObject
        this.emitError = emitError
        this.roomJson = roomJson
        this.roomJson.players[0] = {
            ...this.roomJson.players[0],
            x: 0.5,
            y: 0.5,
            playerState: PlayerState.READY
        }
    }


    handleJoinRoom(messageJson, clients){
        if(Utility.existsInArray(this.roomJson.players, "clientId", messageJson.clientId)){
            this.emitError(messageJson.clientId, "Cannot join a room you are already a part of")
            return false
        }
        
        const playerObj = {
            clientId: messageJson.clientId,
            displayName: clients[messageJson.clientId].displayName,
            x: 0.5,
            y: 0.5,
            playerState: PlayerState.READY
        }
        this.roomJson.players.push(playerObj)
        return true
    }

    handlePlayerInput(messageJson){
        switch(messageJson.playerInputAction){
            case PlayerInputOptions.MOVE:
                // target room
                var targetPlayer = Utility.getFromArray(this.roomJson.players, "clientId", messageJson.clientId)
                if(targetPlayer){
                    targetPlayer.MOVE_UP = messageJson.MOVE_UP
                    targetPlayer.MOVE_DOWN = messageJson.MOVE_DOWN
                    targetPlayer.MOVE_LEFT = messageJson.MOVE_LEFT
                    targetPlayer.MOVE_RIGHT = messageJson.MOVE_RIGHT
                }
                return true;
            default:
                return false;
        }
    }

    removePlayerFromRoom(clientId){
        // is this player a part of this room
        if(!Utility.existsInArray(this.roomJson.players, "clientId", clientId)){
            return false
        }
        this.roomJson.players = Utility.removeElementFromArrayByKey(this.roomJson.players, "clientId", clientId)
        // if we just removed the host, lets pick the next player as host
        if(this.roomJson.hostId===clientId && this.roomJson.players[0]){
            this.roomJson.hostId=this.roomJson.players[0].clientId
            this.roomJson.hostName=this.roomJson.players[0].displayName
        }
        return true
    }

    // clean up this room
    // end current game
    cleanupRoom(){
        this.gameObject.end()
    }
    
}


module.exports = {
    Room: Room
}