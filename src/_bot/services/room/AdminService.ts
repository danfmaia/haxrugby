import { IHaxRugbyRoom } from '../../rooms/HaxRugbyRoom';

export interface IAdminService {
  setFirstPlayerAsAdmin(playerId: number): void;
  setEarliestPlayerAsAdmin(): void;
}

export default class AdminService implements IAdminService {
  private room: IHaxRugbyRoom;

  constructor(room: IHaxRugbyRoom) {
    this.room = room;
  }

  public setFirstPlayerAsAdmin(playerId: number): void {
    if (this.room.getPlayerList().length === 1) {
      this.room.setPlayerAdmin(playerId, true);
    }
  }

  public setEarliestPlayerAsAdmin(): void {
    const remainingPlayers = this.room.getPlayerList();
    if (remainingPlayers.length === 0) {
      return;
    }
    // remainingPlayers.shift();
    const isTherePlayerAdmin = remainingPlayers.some((player) => player.admin);
    if (isTherePlayerAdmin === false) {
      if (remainingPlayers.length >= 2) {
        remainingPlayers.sort((a, b) => a.id - b.id);
      }
      this.room.setPlayerAdmin(remainingPlayers[0].id, true);
    }
  }
}
