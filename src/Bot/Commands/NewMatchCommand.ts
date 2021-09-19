import { inject } from 'inversify';
import { CommandBase, CommandDecorator, Types } from 'inversihax';

import { CustomPlayer } from '../models/CustomPlayer';

import { smallConfig } from '../constants/config/smallConfig';
import { ISmallHaxRURoom } from '../Room/ISmallHaxRURoom';
import { IMatchConfig } from '../models/match/MatchConfig';

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

    if (this.room.isMatchInProgress) {
      this.room.cancelMatch(player, callback);
    }

    function callback() {
      const matchConfig: IMatchConfig = smallConfig;

      if (args[0] && typeof args[0] === 'number') {
        const parsedTimeLimit = Math.floor(parseInt(args[0]));
        if (parsedTimeLimit > 0) {
          matchConfig.timeLimit = parsedTimeLimit;
        }
      }

      if (args[1] && typeof args[1] === 'number') {
        const parsedScoreLimit = Math.floor(parseInt(args[1]));
        if (parsedScoreLimit > 0) {
          matchConfig.scoreLimit = parsedScoreLimit;
        }
      }

      this.room.matchConfig = matchConfig;
      this.room.startGame();
    }
  }
}
