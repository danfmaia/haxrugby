import { inject } from 'inversify';
import { CommandBase, CommandDecorator, Types } from 'inversihax';
import { HaxRugbyPlayer } from '../../models/player/HaxRugbyPlayer';
import { IHaxRugbyRoom } from '../../rooms/HaxRugbyRoom';
import Util from '../../util/Util';

@CommandDecorator({
  names: ['krl', 'kick-rate-limit'],
})
export class KickRateLimitCommand extends CommandBase<HaxRugbyPlayer> {
  private room: IHaxRugbyRoom;
  // private readonly chatService: IChatService;

  public constructor(@inject(Types.IRoom) room: IHaxRugbyRoom) {
    super();

    this.room = room;
    // this.chatService = room.gameService.chatService;
  }

  public canExecute(player: HaxRugbyPlayer): boolean {
    return player.admin;
  }

  public execute(player: HaxRugbyPlayer, args: string[]): void {
    const min = Util.parseNumericInput(args[0]);
    const rate = Util.parseNumericInput(args[1]);
    const burst = Util.parseNumericInput(args[2]);

    if (min && rate && burst) {
      this.room.setKickRateLimit(min, rate, burst);
    }
  }
}
