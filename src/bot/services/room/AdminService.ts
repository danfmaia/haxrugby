import { HaxRugbyPlayerConfig } from '../../models/player/HaxRugbyPlayerConfig';
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
    const playerList = this.room.getPlayerList();

    if (playerList.length === 1) {
      this.room.setPlayerAdmin(playerId, true);
      return;
    }

    // set player as admin if all other players can't be only admins
    // TODO: improve this logic if possible
    const admins = playerList.filter((player) => player.admin);
    const playersThatCantBeOnlyAdmins = HaxRugbyPlayerConfig.configs.filter(
      (config) => config.canBeTheOnlyAdmin === false,
    );
    if (
      admins.length === playersThatCantBeOnlyAdmins.length &&
      admins.length === playerList.length - 1
    ) {
      this.room.setPlayerAdmin(playerId, true);
    }
  }

  public setEarliestPlayerAsAdmin(): void {
    const remainingPlayers = this.room.getPlayerList();
    if (remainingPlayers.length === 0) {
      return;
    }

    const isTherePlayerAdmin = remainingPlayers.some((player) => player.admin);
    if (isTherePlayerAdmin === false) {
      if (remainingPlayers.length >= 2) {
        remainingPlayers.sort((a, b) => a.id - b.id);
      }
      this.room.setPlayerAdmin(remainingPlayers[0].id, true);
    }

    // set next earlierst player as admin if all admins can't be only admins:
    // TODO: improve this logic if possible

    const admins = this.room.getPlayerList().filter((player) => player.admin);

    const adminConfigs: HaxRugbyPlayerConfig[] = [];
    admins.forEach((admin) => {
      adminConfigs.push(HaxRugbyPlayerConfig.getConfig(admin.id));
    });

    const adminsThatCantBeOnlyAdmins = adminConfigs.filter(
      (config) => config.canBeTheOnlyAdmin === false,
    );

    if (adminConfigs.length === adminsThatCantBeOnlyAdmins.length) {
      for (let i = 0; i < remainingPlayers.length; i++) {
        const player = remainingPlayers[i];
        const canBeOnlyAdmin = adminsThatCantBeOnlyAdmins.some(
          (admin) => admin.playerId === player.id,
        );
        if (canBeOnlyAdmin === false) {
          this.room.setPlayerAdmin(player.id, true);
          return;
        }
      }
    }
  }
}
