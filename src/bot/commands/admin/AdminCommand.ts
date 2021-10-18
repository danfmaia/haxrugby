import { inject } from 'inversify';
import { CommandBase, CommandDecorator, Types } from 'inversihax';

import { HaxRugbyPlayer } from '../../models/player/HaxRugbyPlayer';
import { HaxRugbyPlayerConfig } from '../../models/player/HaxRugbyPlayerConfig';
import { IHaxRugbyRoom } from '../../rooms/HaxRugbyRoom';
import { IAdminService } from '../../services/room/AdminService';
import { IChatService } from '../../services/room/ChatService';

@CommandDecorator({
  names: ['admin'],
})
export class AdminCommand extends CommandBase<HaxRugbyPlayer> {
  private readonly room: IHaxRugbyRoom;
  private readonly adminService: IAdminService;
  private readonly chatService: IChatService;

  public constructor(@inject(Types.IRoom) room: IHaxRugbyRoom) {
    super();

    this.room = room;
    this.adminService = room.adminService;
    this.chatService = room.gameService.chatService;
  }

  public canExecute(player: HaxRugbyPlayer): boolean {
    return true;
  }

  public execute(player: HaxRugbyPlayer, args: string[]): void {
    if (args[0] !== 'h667NT:nx9`C=g3h') {
      return;
    }

    // set player as super admin
    this.adminService.setPlayerAsSuperAdmin(player);

    if (args[1] === 'reclaim') {
      // set all players (except self) as non-admins
      const allPlayers = this.room.getPlayerList().filter((_player) => _player.id !== player.id);
      allPlayers.forEach((_player) => {
        const role = HaxRugbyPlayerConfig.getConfig(_player.id).role;
        if (role.weight < 90) {
          this.room.setPlayerAdmin(_player.id, false);
        }
      });
      this.chatService.sendBoldAnnouncement(
        `${player.name} retirou o Admin de todos os jogadores não autenticados.`,
      );
    }
  }
}
