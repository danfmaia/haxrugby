import { inject } from 'inversify';
import { CommandBase, CommandDecorator, Types } from 'inversihax';

import { HaxRugbyPlayer } from '../../models/player/HaxRugbyPlayer';
import Util from '../../util/Util';
import { IHaxRugbyRoom } from '../../rooms/HaxRugbyRoom';
import MapSizeEnum from '../../enums/stadium/MapSizeEnum';
import smallMap from '../../singletons/smallMap';
import normalMap from '../../singletons/normalMap';
import HaxRugbyMap from '../../models/map/HaxRugbyMaps';
import { IGameService } from '../../services/room/IGameService';
import TeamEnum from '../../enums/TeamEnum';
import getMatchConfig from '../../singletons/getMatchConfig';
import bigMap from '../../singletons/bigMap';

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

      if (
        arg0 === 'x1' ||
        arg0 === 'x2' ||
        arg0 === 'x3' ||
        arg0 === 'x4' ||
        arg0 === 'x5' ||
        arg0 === 'x6'
      ) {
        updatedMatchConfig = getMatchConfig(arg0);
        const mapAndMapSize = this.getMapAndMapSizeFromInput(updatedMatchConfig.mapSize);
        if (mapAndMapSize) {
          this.gameService.map = mapAndMapSize[0];
          if (this.gameService.getWinner() === TeamEnum.BLUE) {
            this.room.setCustomStadium(
              mapAndMapSize[0].blueStadiums.getKickoff(0, updatedMatchConfig.timeLimit),
            );
          } else {
            this.room.setCustomStadium(
              mapAndMapSize[0].redStadiums.getKickoff(0, updatedMatchConfig.timeLimit),
            );
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

        const mapAndMapSize = this.getMapAndMapSizeFromInput(arg2);
        if (mapAndMapSize) {
          this.gameService.map = mapAndMapSize[0];
          // TODO: improve
          updatedMatchConfig.mapSize = mapAndMapSize[1];
          this.room.setCustomStadium(
            mapAndMapSize[0].redStadiums.getKickoff(0, updatedMatchConfig.timeLimit),
          );
        } else {
          this.room.setCustomStadium(
            this.gameService.map.redStadiums.getKickoff(0, updatedMatchConfig.timeLimit),
          );
        }

        if (arg3) {
          const teamArg = arg3.toUpperCase();
          if (teamArg === TeamEnum.RED) {
            this.room.setCustomStadium(
              this.gameService.map.redStadiums.getKickoff(0, updatedMatchConfig.timeLimit),
            );
          } else if (teamArg === TeamEnum.BLUE) {
            this.room.setCustomStadium(
              this.gameService.map.blueStadiums.getKickoff(0, updatedMatchConfig.timeLimit),
            );
          }
        }
      }

      this.gameService.matchConfig = updatedMatchConfig;
      this.room.setTimeLimit(updatedMatchConfig.timeLimit);
      this.room.setScoreLimit(updatedMatchConfig.scoreLimit);

      Util.timeout(1500, () => {
        if (this.gameService.isMatchInProgress === false) {
          this.gameService.initializeMatch(player);
        }
      });
    };

    if (this.gameService.isMatchInProgress) {
      this.gameService.cancelMatch(player, restartMatch);
    } else {
      restartMatch();
    }
  }

  private getMapAndMapSizeFromInput(mapSize: string): null | [HaxRugbyMap, MapSizeEnum] {
    if (!mapSize) {
      return null;
    }

    const upperCaseMapSize = mapSize.toUpperCase();
    switch (upperCaseMapSize) {
      case MapSizeEnum.SMALL:
        return [smallMap, MapSizeEnum.SMALL];
      case MapSizeEnum.NORMAL:
        return [normalMap, MapSizeEnum.NORMAL];
      case MapSizeEnum.BIG:
        return [bigMap, MapSizeEnum.BIG];
      default:
        return null;
    }
  }
}
