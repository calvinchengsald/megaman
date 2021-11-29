
const GameBoardConstants = {
    GAME_FPS: 10,
    COLLISION_TOLERANCE: 50,
    PLAYER_MOVE_SPEED_PER_SECOND: .1,
}
GameBoardConstants.PLAYER_MOVE_SPEED_PER_FRAME = GameBoardConstants.PLAYER_MOVE_SPEED_PER_SECOND/GameBoardConstants.GAME_FPS


module.exports = {
    GameBoardConstants: GameBoardConstants
}