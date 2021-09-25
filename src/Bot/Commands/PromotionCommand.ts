import { inject } from 'inversify';
import { CommandBase, CommandDecorator, Types } from 'inversihax';
import { CustomPlayer } from '../models/CustomPlayer';
import { IHaxRugbyRoom } from '../rooms/HaxRugbyRoom';
import { IChatService } from '../services/room/ChatService';

@CommandDecorator({
  names: ['promo'],
})
export class PromotionCommand extends CommandBase<CustomPlayer> {
  // private readonly room: IHaxRugbyRoom;
  private readonly chatService: IChatService;

  public constructor(@inject(Types.IRoom) room: IHaxRugbyRoom) {
    super();

    // this.room = room;
    this.chatService = room.gameService.chatService;
  }

  public canExecute(player: CustomPlayer): boolean {
    return true;
  }

  public execute(player: CustomPlayer, args: string[]): void {
    if (player.admin) {
      this.chatService.sendPromotionLinks();
    } else {
      this.chatService.sendPromotionLinks(0, player.id);
    }
  }
}
