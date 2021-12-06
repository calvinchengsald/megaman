


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

const PlayerDetailOptions = {
    DISPLAY_NAME: "DISPLAY_NAME",
    AVATAR: "AVATAR"
}
const PlayerInputOptions = {
    MOVE: "MOVE",
    START_GAME: "START_GAME"
}

const GameModes = {
    NO_ESCAPE: "No Escape",
    OTHER_GAME: "Other Game",
    TEAM_FIGHT: "Team Fight"
}

module.exports = {
    RoomState: RoomState,
    PlayerState: PlayerState,
    PlayerInputOptions: PlayerInputOptions,
    PlayerDetailOptions: PlayerDetailOptions,
    GameModes: GameModes
}