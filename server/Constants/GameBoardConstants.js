


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
    START_GAME: "START_GAME",
    ATTACK: "ATTACK"
}

const GameModes = {
    NO_ESCAPE: "No Escape",
    OTHER_GAME: "Other Game",
    TEAM_FIGHT: "Team Fight"
}

const Rarity = {
    COMMON: "Common",
    UNCOMMON: "Uncommon",
    RARE: "Rare",
    EPIC: "Epic",
    LEGENDARY: "Legendary"

}


module.exports = {
    RoomState: RoomState,
    PlayerState: PlayerState,
    PlayerInputOptions: PlayerInputOptions,
    PlayerDetailOptions: PlayerDetailOptions,
    GameModes: GameModes,
    Rarity: Rarity
}