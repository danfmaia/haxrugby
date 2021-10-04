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
import getMatchConfig from '../../singletons/getMatchConfig';

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
    const args0 = args[0];
    const args1 = args[1];
    const args2 = args[2];
    const args3 = args[3];

    const callback = () => {
      let updatedMatchConfig = this.gameService.matchConfig;

      if (args0 === 'x2' || args0 === 'x3' || args0 === 'x4') {
        updatedMatchConfig = getMatchConfig(args0);
        const stadium = this.getStadiumFromInput(updatedMatchConfig.stadium);
        if (stadium) {
          this.gameService.stadium = stadium;
          if (this.gameService.getLastWinner() === TeamEnum.BLUE) {
            this.room.setCustomStadium(stadium.blueMaps.kickoff);
          } else {
            this.room.setCustomStadium(stadium.redMaps.kickoff);
          }
        }
      } else {
        const timeLimit = Util.parseNumericInput(args0, true);
        if (timeLimit) {
          updatedMatchConfig.timeLimit = timeLimit;
        }

        const scoreLimit = Util.parseNumericInput(args1, true);
        if (scoreLimit) {
          updatedMatchConfig.scoreLimit = scoreLimit;
        }

        const stadium = this.getStadiumFromInput(args2);
        if (stadium) {
          this.gameService.stadium = stadium;
          this.room.setCustomStadium(stadium.redMaps.kickoff);
        } else {
          this.room.setCustomStadium(this.gameService.stadium.redMaps.kickoff);
        }

        if (args3) {
          const teamArg = args3.toUpperCase();
          if (teamArg === TeamEnum.RED) {
            this.room.setCustomStadium(this.gameService.stadium.redMaps.kickoff);
          } else if (teamArg === TeamEnum.BLUE) {
            this.room.setCustomStadium(this.gameService.stadium.blueMaps.kickoff);
          }
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
