import { inject } from 'inversify';
import { CommandBase, CommandDecorator, Types } from 'inversihax';

import { CustomPlayer } from '../../models/player/CustomPlayer';
import Util from '../../util/Util';
import { IHaxRugbyRoom } from '../../rooms/HaxRugbyRoom';
import StadiumEnum from '../../enums/StadiumEnum';
import smallStadium from '../../singletons/smallStadium';
import HaxRugbyStadium from '../../models/stadium/HaxRugbyStadium';
import normalStadium from '../../singletons/normalStadium';
import { IGameService } from '../../services/room/IGameService';
import TeamEnum from '../../enums/TeamEnum';

@CommandDecorator({
  names: ['new', 'rr', 'new-match'],
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
      const updatedMatchConfig = this.gameService.matchConfig;

      const timeLimit = Util.parseNumericInput(args[0], true);
      if (timeLimit) {
        updatedMatchConfig.timeLimit = timeLimit;
      }

      const scoreLimit = Util.parseNumericInput(args[1], true);
      if (scoreLimit) {
        updatedMatchConfig.scoreLimit = scoreLimit;
      }

      const stadium = this.getStadiumFromInput(args[2]);
      if (stadium) {
        this.gameService.stadium = stadium;
        this.room.setCustomStadium(stadium.redMaps.kickoff);
      } else {
        this.room.setCustomStadium(this.gameService.stadium.redMaps.kickoff);
      }

      if (args[3]) {
        const teamArg = args[3].toUpperCase();
        if (teamArg === TeamEnum.RED) {
          this.room.setCustomStadium(this.gameService.stadium.redMaps.kickoff);
        } else if (teamArg === TeamEnum.BLUE) {
          this.room.setCustomStadium(this.gameService.stadium.blueMaps.kickoff);
        }
      }

      this.gameService.matchConfig = updatedMatchConfig;
      this.room.setTimeLimit(updatedMatchConfig.timeLimit);
      this.room.setScoreLimit(updatedMatchConfig.scoreLimit);

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
