import { inject } from 'inversify';
import { CommandBase, CommandDecorator, Types } from 'inversihax';
import LinkEnum from '../../enums/LinkEnum';
import { HaxRugbyPlayer } from '../../models/player/HaxRugbyPlayer';
import { IHaxRugbyRoom } from '../../rooms/HaxRugbyRoom';
import { IChatService } from '../../services/room/ChatService';

@CommandDecorator({
  names: ['facebook', 'face', 'fb'],
})
export class FacebookCommand extends CommandBase<HaxRugbyPlayer> {
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
    if (player.admin) {
      this.chatService.sendSinglePromoLink(LinkEnum.FACEBOOK);
    } else {
      this.chatService.sendSinglePromoLink(LinkEnum.FACEBOOK, 0, player.id);
    }
  }
}
