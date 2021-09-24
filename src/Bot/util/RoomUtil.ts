import { IHaxRugbyRoom } from '../rooms/HaxRugbyRoom';

export class RoomUtil {
  room: IHaxRugbyRoom;

  constructor(room: IHaxRugbyRoom) {
    this.room = room;
  }

  public countPlayersByTeam(playerIds: (number | null)[]) {
    const playerCount = {
      red: 0,
      blue: 0,
    };

    playerIds.forEach((playerId) => {
      if (playerId) {
        if (this.room.getPlayer(playerId).team === 1) {
          playerCount.red = playerCount.red + 1;
        } else if (this.room.getPlayer(playerId).team === 2) {
          playerCount.blue = playerCount.blue + 1;
        }
      }
    });

    return playerCount;
  }
}
