import { inject } from 'inversify';
import { CommandBase, CommandDecorator, Types } from 'inversihax';

import { CustomPlayer } from '../models/CustomPlayer';

import { smallConfig } from '../constants/config/smallConfig';
import { ISmallHaxRURoom } from '../Room/ISmallHaxRURoom';
import { IMatchConfig } from '../models/match/MatchConfig';
import Util from '../util/Utils';

@CommandDecorator({
  names: ['new-match', 'new']
})
export class NewMatchCommand extends CommandBase<CustomPlayer> {
  private readonly room: ISmallHaxRURoom;

  public constructor(@inject(Types.IRoom) room: ISmallHaxRURoom) {
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
      const matchConfig: IMatchConfig = smallConfig;

      const timeLimit = Util.validatePositiveNumericInput(args[0]);
      if (timeLimit) {
        matchConfig.timeLimit = timeLimit;
      }

      const scoreLimit = Util.validatePositiveNumericInput(args[1]);
      if (scoreLimit) {
        matchConfig.scoreLimit = scoreLimit;
      }

      this.room.matchConfig = matchConfig;
      this.room.setTimeLimit(matchConfig.timeLimit);
      this.room.setScoreLimit(matchConfig.scoreLimit);
      Util.timeout(1500, () => this.room.initializeMatch(player));
    };

    if (this.room.isMatchInProgress) {
      this.room.cancelMatch(player, callback);
    } else {
      callback();
    }
  }
}
