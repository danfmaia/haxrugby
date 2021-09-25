import { inject } from 'inversify';
import { CommandBase, CommandDecorator, Types } from 'inversihax';

import { CustomPlayer } from '../models/CustomPlayer';
import smallConfig from '../singletons/smallConfig';
import Util from '../util/Util';
import { IHaxRugbyRoom } from '../rooms/HaxRugbyRoom';

@CommandDecorator({
  names: ['new', 'new-match'],
})
export class NewMatchCommand extends CommandBase<CustomPlayer> {
  private readonly room: IHaxRugbyRoom;

  public constructor(@inject(Types.IRoom) room: IHaxRugbyRoom) {
    super();

    this.room = room;
  }

  public canExecute(player: CustomPlayer): boolean {
    return true;
  }

  public execute(player: CustomPlayer, args: string[]): void {
    if (!player.admin) {
      return;
    }

    const callback = () => {
      const matchConfig = smallConfig;

      const timeLimit = Util.validatePositiveNumericInput(args[0]);
      if (timeLimit) {
        matchConfig.timeLimit = timeLimit;
      }

      const scoreLimit = Util.validatePositiveNumericInput(args[1]);
      if (scoreLimit) {
        matchConfig.scoreLimit = scoreLimit;
      }

      this.room.gameService.matchConfig = matchConfig;
      this.room.setTimeLimit(matchConfig.timeLimit);
      this.room.setScoreLimit(matchConfig.scoreLimit);
      Util.timeout(1500, () => this.room.gameService.initializeMatch(player));
    };

    if (this.room.gameService.isMatchInProgress) {
      this.room.sendChat('passed 1');
      this.room.gameService.cancelMatch(player, callback);
    } else {
      callback();
    }
  }
}
