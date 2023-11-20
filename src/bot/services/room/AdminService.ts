import { IPlayerObject } from 'inversihax';
import appConfig from '../../constants/appConfig';
import { MINUTE_IN_MS } from '../../constants/constants';
import colors from '../../constants/style/colors';
import { HaxRugbyPlayer } from '../../models/player/HaxRugbyPlayer';
import { HaxRugbyPlayerConfig } from '../../models/player/HaxRugbyPlayerConfig';
import { HaxRugbyRole } from '../../models/player/HaxRugbyRole';
import { IHaxRugbyRoom } from '../../rooms/HaxRugbyRoom';
import Util from '../../util/Util';
import ChatService, { IChatService } from './ChatService';

export interface IAdminService {
  handlePlayerJoin(player: IPlayerObject): void;
  handlePlayerLeave(player: HaxRugbyPlayer): void;
  handlePlayerKicked(
    player: HaxRugbyPlayer,
    reason: string,
    ban: boolean,
    byPlayer?: HaxRugbyPlayer,
  ): void;

  setFirstPlayerAsAdmin(playerId: number): void;
  setEarliestPlayerAsAdmin(): void;
  setPlayerAsSuperAdmin(player: HaxRugbyPlayer): void;
}

export default class AdminService implements IAdminService {
  private room: IHaxRugbyRoom;
  private chatService: IChatService;

  constructor(room: IHaxRugbyRoom) {
    this.room = room;
    this.chatService = new ChatService(room, room.gameService);
  }

  public handlePlayerJoin(player: IPlayerObject): void {
    HaxRugbyPlayerConfig.getConfig(player.id);

    const playerTotal = this.room.getPlayerList().length;
    Util.logWithTime(`${player.name} (ID: ${player.id}) entrou na sala. Total: ${playerTotal}`);

    if (appConfig.isOpen === false) {
      Util.timeout(MINUTE_IN_MS, () => {
        if (player.id > 1) {
          this.room.kickPlayer(player.id, '𝗗𝗶𝘀𝗰𝗼𝗿𝗱: discord.gg/F962NBhRgy', false);
        }
      });
      return;
    }

    this.setFirstPlayerAsAdmin(player.id);
  }

  public handlePlayerLeave(player: HaxRugbyPlayer): void {
    const playerTotal = this.room.getPlayerList().length;
    Util.logWithTime(`${Util.getPlayerNameAndId(player)} saiu da sala. Total: ${playerTotal}`);

    if (appConfig.isOpen === false) {
      return;
    }

    this.setEarliestPlayerAsAdmin();
  }

  public handlePlayerKicked(
    player: HaxRugbyPlayer,
    reason: string,
    ban: boolean,
    byPlayer?: HaxRugbyPlayer,
  ): void {
    const BOT_KICK_MESSAGE = 'Você não tem permissão para kickar.';
    const BOT_BAN_MESSAGE = 'Você não tem permissão para banir.';

    if (['!bb', BOT_KICK_MESSAGE, BOT_BAN_MESSAGE].includes(reason)) {
      return;
    }

    const playerNameAndId = Util.getPlayerNameAndId(player);

    if (byPlayer && byPlayer.id > 0) {
      const playerConfig = HaxRugbyPlayerConfig.getConfig(byPlayer.id);
      const byPlayerNameAndId = Util.getPlayerNameAndId(byPlayer);

      if (playerConfig.role.weight < 90) {
        if (ban === false) {
          this.chatService.sendBoldAnnouncement(
            `${byPlayer.name} tentou kickar ${player.name} sem permissão.`,
            2,
            undefined,
            colors.red,
          );
          Util.logWithTime(`${byPlayerNameAndId} tentou kickar ${playerNameAndId} sem permissão.`);
          this.room.kickPlayer(byPlayer.id, BOT_KICK_MESSAGE, false);
        } else {
          this.chatService.sendBoldAnnouncement(
            `${byPlayer.name} tentou banir ${player.name} sem permissão. O ban foi retirado.`,
            2,
            undefined,
            colors.red,
          );
          Util.logWithTime(
            `${byPlayerNameAndId} tentou banir ${playerNameAndId} sem permissão. O ban foi retirado.`,
          );
          this.room.clearBan(player.id);
          this.room.kickPlayer(byPlayer.id, BOT_BAN_MESSAGE, false);
        }
        return;
      }

      if (ban === false) {
        Util.logWithTime(`${playerNameAndId} foi kickado por ${byPlayerNameAndId}).`);
      } else {
        Util.logWithTime(`${playerNameAndId} foi banido por ${byPlayerNameAndId}).`);
      }
    } else {
      if (ban === false) {
        Util.logWithTime(`${playerNameAndId} foi kickado pelo bot.`);
      } else {
        Util.logWithTime(`${playerNameAndId} foi banido pelo bot.`);
      }
    }

    if (reason) {
      console.log(`    Motivo: ${reason}.`);
    }
  }

  public setPlayerAsSuperAdmin(player: HaxRugbyPlayer): void {
    this.room.setPlayerAdmin(player.id, true);
    const config = HaxRugbyPlayerConfig.getConfig(player.id);
    config.role = HaxRugbyRole.SuperAdmin;
    this.chatService.sendHaxRugbyBoldAnnouncement(
      `  🏉  ${player.name} se autenticou como SuperAdmin.  🏉`,
      2,
    );
    this.chatService.sendHaxRugbyAnnouncement(
      '  🙌  Curvem-se perante seu supremo poder rugbístico!  🙌',
      2,
    );
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
