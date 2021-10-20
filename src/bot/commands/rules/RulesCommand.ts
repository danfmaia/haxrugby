import { inject } from 'inversify';
import { CommandBase, CommandDecorator, Types } from 'inversihax';
import LinkEnum from '../../enums/LinkEnum';
import { HaxRugbyPlayer } from '../../models/player/HaxRugbyPlayer';
import { IHaxRugbyRoom } from '../../rooms/HaxRugbyRoom';
import { IChatService } from '../../services/room/ChatService';

@CommandDecorator({
  names: ['r', 'R', 'regras', 'rules'],
})
export class RulesCommand extends CommandBase<HaxRugbyPlayer> {
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
    if (args[0] !== 'link') {
      if (player.admin) {
        this.chatService.sendMainRules(2);
      } else {
        this.chatService.sendMainRules(0, player.id);
      }
    } else {
      if (player.admin) {
        this.chatService.sendSinglePromoLink(LinkEnum.RULES);
      } else {
        this.chatService.sendSinglePromoLink(LinkEnum.RULES, 0, player.id);
      }
    }
  }
}
