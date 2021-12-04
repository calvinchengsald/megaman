const GameConstants = {
    NAME: "No Escape",
    GAME_FPS: 40,
    COLLISION_TOLERANCE: .08,
    PLAYER_MOVE_SPEED_PER_SECOND: .4,
    ATTACK_MOVE_SPEED_PER_SECOND: .3,
    ATTACK_SPAWN_PER_SECOND: 1,
    POINTS_PER_SECOND: 120
}

GameConstants.PLAYER_MOVE_SPEED_PER_FRAME = GameConstants.PLAYER_MOVE_SPEED_PER_SECOND/GameConstants.GAME_FPS
GameConstants.ATTACK_MOVE_SPEED_PER_FRAME = GameConstants.ATTACK_MOVE_SPEED_PER_SECOND/GameConstants.GAME_FPS
GameConstants.ATTACK_SPAWN_PER_FRAME = GameConstants.ATTACK_SPAWN_PER_SECOND/GameConstants.GAME_FPS
GameConstants.POINTS_PER_FRAME = Math.floor(GameConstants.POINTS_PER_SECOND/GameConstants.GAME_FPS)


module.exports = {
    GameConstants: GameConstants
}