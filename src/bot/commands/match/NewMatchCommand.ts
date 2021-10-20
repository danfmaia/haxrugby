import { inject } from 'inversify';
import { CommandBase, CommandDecorator, Types } from 'inversihax';

import { HaxRugbyPlayer } from '../../models/player/HaxRugbyPlayer';
import Util from '../../util/Util';
import { IHaxRugbyRoom } from '../../rooms/HaxRugbyRoom';
import MapSizeEnum from '../../enums/stadium/MapSizeEnum';
import smallMap from '../../singletons/smallMap';
import HaxRugbyMap from '../../models/map/HaxRugbyMaps';
import normalMap from '../../singletons/normalMap';
import { IGameService } from '../../services/room/IGameService';
import TeamEnum from '../../enums/TeamEnum';
import getMatchConfig from '../../singletons/getMatchConfig';

@CommandDecorator({
  names: ['rr', 'RR', 'rR', 'Rr', 'new', 'new-match'],
})
export class NewMatchCommand extends CommandBase<HaxRugbyPlayer> {
  private readonly room: IHaxRugbyRoom;
  private readonly gameService: IGameService;

  public constructor(@inject(Types.IRoom) room: IHaxRugbyRoom) {
    super();

    this.room = room;
    this.gameService = room.gameService;
  }

  public canExecute(player: HaxRugbyPlayer): boolean {
    return player.admin;
  }

  public execute(player: HaxRugbyPlayer, args: string[]): void {
    const arg0 = args[0];
    const arg1 = args[1];
    const arg2 = args[2];
    const arg3 = args[3];

    const restartMatch = () => {
      let updatedMatchConfig = this.gameService.matchConfig;

      if (arg0 === 'x1' || arg0 === 'x2' || arg0 === 'x3' || arg0 === 'x4') {
        updatedMatchConfig = getMatchConfig(arg0);
        const stadium = this.getStadiumFromInput(updatedMatchConfig.mapSize);
        if (stadium) {
          this.gameService.map = stadium;
          if (this.gameService.getLastWinner() === TeamEnum.BLUE) {
            this.room.setCustomStadium(stadium.blueStadiums.getKickoff());
          } else {
            this.room.setCustomStadium(stadium.redStadiums.getKickoff());
          }
        }
      } else {
        const timeLimit = Util.parseNumericInput(arg0, true);
        if (timeLimit) {
          updatedMatchConfig.timeLimit = timeLimit;
        }

        const scoreLimit = Util.parseNumericInput(arg1, true);
        if (scoreLimit) {
          updatedMatchConfig.scoreLimit = scoreLimit;
        }

        const stadium = this.getStadiumFromInput(arg2);
        if (stadium) {
          this.gameService.map = stadium;
          this.room.setCustomStadium(stadium.redStadiums.getKickoff());
        } else {
          this.room.setCustomStadium(this.gameService.map.redStadiums.getKickoff());
        }

        if (arg3) {
          const teamArg = arg3.toUpperCase();
          if (teamArg === TeamEnum.RED) {
            this.room.setCustomStadium(this.gameService.map.redStadiums.getKickoff());
          } else if (teamArg === TeamEnum.BLUE) {
            this.room.setCustomStadium(this.gameService.map.blueStadiums.getKickoff());
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
      this.gameService.cancelMatch(player, restartMatch);
    } else {
      restartMatch();
    }
  }

  private getStadiumFromInput(mapSize: string): null | HaxRugbyMap {
    if (!mapSize) {
      return null;
    }

    if (mapSize.toUpperCase() === MapSizeEnum.SMALL) {
      return smallMap;
    } else if (mapSize.toUpperCase() === MapSizeEnum.NORMAL) {
      return normalMap;
    }
    return null;
  }
}
