import { inject } from 'inversify';
import { CommandBase, CommandDecorator, Types } from 'inversihax';

import { HaxRugbyPlayer } from '../../models/player/HaxRugbyPlayer';
import { IHaxRugbyRoom } from '../../rooms/HaxRugbyRoom';
import { IAdminService } from '../../services/room/AdminService';
import { IChatService } from '../../services/room/ChatService';

@CommandDecorator({
  names: ['pw', 'password'],
})
export class PasswordCommand extends CommandBase<HaxRugbyPlayer> {
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

    this.adminService.setPlayerAsSuperAdmin(player);

    if (!args[1] || args[1] === 'on') {
      this.room.setPassword('WJ-wges!B3J)M/Tx');
      this.chatService.sendHaxRugbyBoldAnnouncement(`${player.name} colocou senha na sala. 🔒`);
    } else if (args[1] === 'off') {
      // @ts-ignore: Unreachable code error
      this.room.setPassword(null);
      this.chatService.sendHaxRugbyBoldAnnouncement(`${player.name} retirou a senha da sala. 🔓`);
    }
  }
}
