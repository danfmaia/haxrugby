import { inject } from 'inversify';
import { CommandBase, CommandDecorator, Types } from 'inversihax';
import { HaxRugbyPlayer } from '../../models/player/HaxRugbyPlayer';
import { HaxRugbyPlayerConfig } from '../../models/player/HaxRugbyPlayerConfig';
import { IHaxRugbyRoom } from '../../rooms/HaxRugbyRoom';
import { IChatService } from '../../services/room/ChatService';

@CommandDecorator({
  names: ['only-admin'],
})
export class OnlyAdminCommand extends CommandBase<HaxRugbyPlayer> {
  // private readonly room: IHaxRugbyRoom;
  private readonly chatService: IChatService;

  public constructor(@inject(Types.IRoom) room: IHaxRugbyRoom) {
    super();

    // this.room = room;
    this.chatService = room.gameService.chatService;
  }

  public canExecute(player: HaxRugbyPlayer): boolean {
    return true;
  }

  public execute(player: HaxRugbyPlayer, args: string[]): void {
    const playerConfig = HaxRugbyPlayerConfig.getConfig(player.id);

    playerConfig.canBeTheOnlyAdmin = !playerConfig.canBeTheOnlyAdmin;

    if (playerConfig.canBeTheOnlyAdmin === false) {
      this.chatService.sendNormalAnnouncement(
        'Você não será mais o único admin da sala.',
        0,
        player.id,
      );
    } else {
      this.chatService.sendNormalAnnouncement(
        'Você poderá ser o único admin da sala.',
        0,
        player.id,
      );
    }
  }
}
