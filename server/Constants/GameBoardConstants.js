


const RoomState = {
    IN_GAME: "IN_GAME",
    IN_LOBBY: "IN_LOBBY"
}

const PlayerState = {
    READY: "READY",
    DEAD: "DEAD",
    DYING: "DYING",
    ALIVE: "ALIVE",
}

const PlayerInputOptions = {
    MOVE: "MOVE",
    START_GAME: "START_GAME"
}

const GameModes = {
    NO_ESCAPE: "No Escape",
    OTHER_GAME: "Other Game"
}

module.exports = {
    RoomState: RoomState,
    PlayerState: PlayerState,
    PlayerInputOptions: PlayerInputOptions,
    GameModes: GameModes
}