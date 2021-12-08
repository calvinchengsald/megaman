const GameConstants = {
    NAME: "Team Fight",
    GAME_FPS: 40,
    SPRITE_UNIT_SIZE: .1,
    PLAYER_MOVE_SPEED_PER_SECOND: .4,
    ATTACK_MOVE_SPEED_PER_SECOND: .3,
    ATTACK_SPAWN_PER_SECOND: 1,
    EXP_PER_SECOND: 120,
    BOUND_SRINK_RATE_PER_SECOND: 0.01,
    BOUND_SHRINK_START: 60
}

GameConstants.TIME_PER_FRAME = 1/GameConstants.GAME_FPS
GameConstants.PLAYER_MOVE_SPEED_PER_FRAME = GameConstants.PLAYER_MOVE_SPEED_PER_SECOND/GameConstants.GAME_FPS
GameConstants.ATTACK_MOVE_SPEED_PER_FRAME = GameConstants.ATTACK_MOVE_SPEED_PER_SECOND/GameConstants.GAME_FPS
GameConstants.ATTACK_SPAWN_PER_FRAME = GameConstants.ATTACK_SPAWN_PER_SECOND/GameConstants.GAME_FPS
GameConstants.EXP_PER_FRAME = Math.floor(GameConstants.EXP_PER_SECOND/GameConstants.GAME_FPS)
GameConstants.BOUND_SRINK_RATE_PER_FRAME = GameConstants.BOUND_SRINK_RATE_PER_SECOND/GameConstants.GAME_FPS
GameConstants.COLLISION_TOLERANCE = GameConstants.SPRITE_UNIT_SIZE/2

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
    },
    Teemo: {
        NAME: "Teemo",
        ALIVE: {
            ANIMATION_SPEED_PER_FRAME: 5 /GameConstants.GAME_FPS,
            ANIMATION_MAX_FRAME: 1
        },
        DYING: {
            ANIMATION_SPEED_PER_FRAME: 8 /GameConstants.GAME_FPS,
            ANIMATION_MAX_FRAME: 1
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
        MOVE_SPEED_PER_FRAME: .5 / GameConstants.GAME_FPS,
        ANIMATION_SPEED_PER_FRAME: 10 /GameConstants.GAME_FPS,
        ANIMATION_MAX_FRAME: 5,
        SPECIAL_ATTRIBUTES: {
            RETURN_COUNT: 1
        }
    },
    Fireball: {
        NAME: "Boomerang",
        MOVE_SPEED_PER_FRAME: .2 / GameConstants.GAME_FPS,
        ANIMATION_SPEED_PER_FRAME: 10 /GameConstants.GAME_FPS,
        ANIMATION_MAX_FRAME: 5,
        SPECIAL_ATTRIBUTES: {
        }
    },
    Spike: {
        NAME: "Spike",
        MOVE_SPEED_PER_FRAME: .7 / GameConstants.GAME_FPS,
        ANIMATION_SPEED_PER_FRAME: 10 /GameConstants.GAME_FPS,
        ANIMATION_MAX_FRAME: 5,
        SPECIAL_ATTRIBUTES: {
        }
    }
}

const TeamConstants = {
    LEFT: "LEFT",
    RIGHT: "RIGHT"
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
    DirectionMatrix: DirectionMatrix,
    TeamConstants: TeamConstants
}