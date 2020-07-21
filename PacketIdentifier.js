class PacketIdentifier{
    constructor(){
        this.kNoAction = 0;
        this.kMovement = 1;
        this.kSpawn = 2;
        this.kDespawn = 3;
        this.kSelf = 4;
        this.kPing = 5;
        this.kInteraction = 6;
        this.kCollision = 7;
        this.kInGame = 8;
        this.kLeftGame = 9;
        this.kObjective = 10;
        this.kAddSegment = 11;
        this.kDirection = 12;
        this.kDespawnObjective = 13;
        this.kSpawnObjective = 14;
        this.kGhost = 15;
    }
}
/*
enum class PacketIdentifiers : uint32_t{
    kNoAction = 0,
    kMovement = 1,
    kSpawn = 2,
    kDespawn = 3,
    kSelf = 4,
    kPing = 5,
    kInteraction = 6,
    kHitLocation = 7,
    kInGame = 8,
    kLeftGame = 9
};
*/