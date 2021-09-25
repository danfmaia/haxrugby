import { inject } from 'inversify';
import { CommandBase, CommandDecorator, Types } from 'inversihax';

import { CustomPlayer } from '../models/CustomPlayer';
import Util from '../util/Util';
import { IHaxRugbyRoom } from '../rooms/HaxRugbyRoom';
import StadiumEnum from '../enums/StadiumEnum';
import smallStadium from '../singletons/smallStadium';
import HaxRugbyStadium from '../models/stadium/HaxRugbyStadium';
import normalStadium from '../singletons/normalStadium';
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
    this.gameService = room.gameService;
  }

  public canExecute(player: CustomPlayer): boolean {
    return player.admin;
  }

  public execute(player: CustomPlayer, args: string[]): void {
    const callback = () => {
      const matchConfig = this.gameService.matchConfig;

      const timeLimit = Util.validatePositiveNumericInput(args[0]);
      if (timeLimit) {
        matchConfig.timeLimit = timeLimit;
      }

      const scoreLimit = Util.validatePositiveNumericInput(args[1]);
      if (scoreLimit) {
        matchConfig.scoreLimit = scoreLimit;
      }

      const stadium = this.getStadiumFromInput(args[2]);
      if (stadium) {
        this.gameService.stadium = stadium;
        this.room.setCustomStadium(stadium.map_red);
      } else {
        this.room.setCustomStadium(this.gameService.stadium.map_red);
      }

      this.gameService.matchConfig = matchConfig;
      this.room.setTimeLimit(matchConfig.timeLimit);
      this.room.setScoreLimit(matchConfig.scoreLimit);

      Util.timeout(1500, () => {
        this.gameService.initializeMatch(player);
      });
    };

    if (this.gameService.isMatchInProgress) {
      this.gameService.cancelMatch(player, callback);
    } else {
      callback();
    }
  }

  private getStadiumFromInput(stadiumInput: string): null | HaxRugbyStadium {
    if (!stadiumInput) {
      return null;
    }

    if (stadiumInput.toUpperCase() === StadiumEnum.SMALL) {
      return smallStadium;
    } else if (stadiumInput.toUpperCase() === StadiumEnum.NORMAL) {
      return normalStadium;
    }
    return null;
  }
}
