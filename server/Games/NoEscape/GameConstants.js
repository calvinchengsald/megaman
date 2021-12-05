const GameConstants = {
    NAME: "No Escape",
    GAME_FPS: 40,
    COLLISION_TOLERANCE: .05,
    PLAYER_MOVE_SPEED_PER_SECOND: .4,
    ATTACK_MOVE_SPEED_PER_SECOND: .3,
    ATTACK_SPAWN_PER_SECOND: 1,
    POINTS_PER_SECOND: 120
}

GameConstants.TIME_PER_FRAME = 1/GameConstants.GAME_FPS
GameConstants.PLAYER_MOVE_SPEED_PER_FRAME = GameConstants.PLAYER_MOVE_SPEED_PER_SECOND/GameConstants.GAME_FPS
GameConstants.ATTACK_MOVE_SPEED_PER_FRAME = GameConstants.ATTACK_MOVE_SPEED_PER_SECOND/GameConstants.GAME_FPS
GameConstants.ATTACK_SPAWN_PER_FRAME = GameConstants.ATTACK_SPAWN_PER_SECOND/GameConstants.GAME_FPS
GameConstants.POINTS_PER_FRAME = Math.floor(GameConstants.POINTS_PER_SECOND/GameConstants.GAME_FPS)

/**
 * ANIMATION_SPEED_PER_FRAME = Number of frames expected to animate per second / FPS of game
 * ANIMATION_MAX_FRAME = Max frames available for this animation type before it loops back to the beginning
 */
const AvatarConstants = {
    Spazz: {
        NAME: "Spazz",
        ALIVE: {
            ANIMATION_SPEED_PER_FRAME: 8 /GameConstants.GAME_FPS,
            ANIMATION_MAX_FRAME: 8
        },
        DYING: {
            ANIMATION_SPEED_PER_FRAME: 8 /GameConstants.GAME_FPS,
            ANIMATION_MAX_FRAME: 5
        }
    },
    Rotiggu: {
        NAME: "Rotiggu",
        ALIVE: {
            ANIMATION_SPEED_PER_FRAME: 5 /GameConstants.GAME_FPS,
            ANIMATION_MAX_FRAME: 5
        },
        DYING: {
            ANIMATION_SPEED_PER_FRAME: 8 /GameConstants.GAME_FPS,
            ANIMATION_MAX_FRAME: 5
        }
    },
    Bristlebust: {
        NAME: "Bristlebust",
        ALIVE: {
            ANIMATION_SPEED_PER_FRAME: 5 /GameConstants.GAME_FPS,
            ANIMATION_MAX_FRAME: 5
        },
        DYING: {
            ANIMATION_SPEED_PER_FRAME: 8 /GameConstants.GAME_FPS,
            ANIMATION_MAX_FRAME: 5
        }
    },
    Bauli: {
        NAME: "Bauli",
        ALIVE: {
            ANIMATION_SPEED_PER_FRAME: 5 /GameConstants.GAME_FPS,
            ANIMATION_MAX_FRAME: 5
        },
        DYING: {
            ANIMATION_SPEED_PER_FRAME: 8 /GameConstants.GAME_FPS,
            ANIMATION_MAX_FRAME: 5
        }
    },
    Beholder: {
        NAME: "Beholder",
        ALIVE: {
            ANIMATION_SPEED_PER_FRAME: 5 /GameConstants.GAME_FPS,
            ANIMATION_MAX_FRAME: 5
        },
        DYING: {
            ANIMATION_SPEED_PER_FRAME: 8 /GameConstants.GAME_FPS,
            ANIMATION_MAX_FRAME: 5
        }
    }
}

const AttackConstants = {
    Burst: {
        NAME: "Burst",
        MOVE_SPEED_PER_FRAME: .4 / GameConstants.GAME_FPS,
        ANIMATION_SPEED_PER_FRAME: 5 /GameConstants.GAME_FPS,
        ANIMATION_MAX_FRAME: 5,
        SPECIAL_ATTRIBUTES: {
        }
    },
    Boomerang: {
        NAME: "Boomerang",
        MOVE_SPEED_PER_FRAME: .7 / GameConstants.GAME_FPS,
        ANIMATION_SPEED_PER_FRAME: 10 /GameConstants.GAME_FPS,
        ANIMATION_MAX_FRAME: 5,
        SPECIAL_ATTRIBUTES: {
            RETURN_COUNT: 1
        }
    }
}

const DirectionMatrix = {
    LEFT: "LEFT",
    RIGHT: "RIGHT",
    UP: "UP",
    DOWN: "DOWN"
}

module.exports = {
    GameConstants: GameConstants,
    AvatarConstants: AvatarConstants,
    AttackConstants: AttackConstants,
    DirectionMatrix: DirectionMatrix
}