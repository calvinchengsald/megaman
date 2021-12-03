
const GameBoardConstants = {
    GAME_FPS: 40,
    COLLISION_TOLERANCE: .08,
    PLAYER_MOVE_SPEED_PER_SECOND: .4,
    ATTACK_MOVE_SPEED_PER_SECOND: .3,
    ATTACK_SPAWN_PER_SECOND: 1,
    POINTS_PER_SECOND: 120,
}
GameBoardConstants.PLAYER_MOVE_SPEED_PER_FRAME = GameBoardConstants.PLAYER_MOVE_SPEED_PER_SECOND/GameBoardConstants.GAME_FPS
GameBoardConstants.ATTACK_MOVE_SPEED_PER_FRAME = GameBoardConstants.ATTACK_MOVE_SPEED_PER_SECOND/GameBoardConstants.GAME_FPS
GameBoardConstants.ATTACK_SPAWN_PER_FRAME = GameBoardConstants.ATTACK_SPAWN_PER_SECOND/GameBoardConstants.GAME_FPS
GameBoardConstants.POINTS_PER_FRAME = Math.floor(GameBoardConstants.POINTS_PER_SECOND/GameBoardConstants.GAME_FPS)

const Leaderboard = {
    HIGH_SCORE: 0,
    HIGH_SCORE_NAME: ""
}

const RoomState = {
    IN_GAME: "IN_GAME",
    IN_LOBBY: "IN_LOBBY"
}

const PlayerState = {
    READY: "READY",
    DEAD: "DEAD",
    ALIVE: "ALIVE",
}

const PlayerInputOptions = {
    MOVE: "MOVE",
    START_GAME: "START_GAME"
}


module.exports = {
    GameBoardConstants: GameBoardConstants,
    RoomState: RoomState,
    PlayerState: PlayerState,
    PlayerInputOptions: PlayerInputOptions,
    Leaderboard: Leaderboard
}