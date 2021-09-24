import { inject } from 'inversify';
import { CommandBase, CommandDecorator, Types } from 'inversihax';

import { CustomPlayer } from '../models/CustomPlayer';
import smallConfig from '../singletons/smallConfig';
import Util from '../util/Util';
import { IHaxRugbyRoom } from '../rooms/HaxRugbyRoom';
import GameService from '../services/room/GameService';
import { IGameService } from '../services/room/IGameService';

@CommandDecorator({
  names: ['new', 'new-match'],
})
export class NewMatchCommand extends CommandBase<CustomPlayer> {
  private readonly room: IHaxRugbyRoom;
  private readonly gameService: IGameService;

  public constructor(@inject(Types.IRoom) room: IHaxRugbyRoom) {
    super();

    this.room = room;
    this.gameService = new GameService(room);
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

      this.gameService.matchConfig = matchConfig;
      this.room.setTimeLimit(matchConfig.timeLimit);
      this.room.setScoreLimit(matchConfig.scoreLimit);
      Util.timeout(1500, () => this.gameService.initializeMatch(player));
    };

    if (this.gameService.isMatchInProgress) {
      this.gameService.cancelMatch(player, callback);
    } else {
      callback();
    }
  }
}
