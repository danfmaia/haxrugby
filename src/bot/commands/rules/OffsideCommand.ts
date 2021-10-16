import { inject } from 'inversify';
import { CommandBase, CommandDecorator, Types } from 'inversihax';
import RuleEnum from '../../enums/RuleEnum';
import { HaxRugbyPlayer } from '../../models/player/HaxRugbyPlayer';
import { IHaxRugbyRoom } from '../../rooms/HaxRugbyRoom';
import { IChatService } from '../../services/room/ChatService';

@CommandDecorator({
  names: ['off', 'offside', 'imp', 'impedimento', 'in', 'inside', 'impedido'],
})
export class OffsideCommand extends CommandBase<HaxRugbyPlayer> {
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
      this.chatService.sendSingleRule(RuleEnum.OFFSIDE);
    } else {
      this.chatService.sendSingleRule(RuleEnum.OFFSIDE, 0, player.id);
    }
  }
}
