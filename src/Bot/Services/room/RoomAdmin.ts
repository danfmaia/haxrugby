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

  public setFirstPlayerAsAdmin(playerId: number) {
    if (this.room.getPlayerList().length === 2) {
      this.room.setPlayerAdmin(playerId, true);
    }
  }

  public setEarliestPlayerAsAdmin() {
    const remainingPlayers = this.room.getPlayerList();
    remainingPlayers.shift();
    const isTherePlayerAdmin = remainingPlayers.some((player) => player.admin);
    if (isTherePlayerAdmin === false) {
      remainingPlayers.sort((a, b) => a.id - b.id);
      this.room.setPlayerAdmin(remainingPlayers[0].id, true);
    }
  }
}
