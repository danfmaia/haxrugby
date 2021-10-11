import { IPosition } from 'inversihax';
import PositionEnum from '../enums/PositionEnum';
import TeamEnum from '../enums/TeamEnum';
import { HaxRugbyPlayer } from '../models/player/HaxRugbyPlayer';
import { IHaxRugbyRoom } from '../rooms/HaxRugbyRoom';

import { IGameService } from '../services/room/IGameService';

class GameUtil {
  constructor(public room: IHaxRugbyRoom, public gameService: IGameService) {}

  public getCanLosingTeamTieOrTurn(ballPosition: IPosition): boolean {
    const blueMinusRed = this.gameService.score.blue - this.gameService.score.red;

    return (
      (-blueMinusRed <= 7 &&
        -blueMinusRed > 0 &&
        ballPosition.x < -this.gameService.map.kickoffLineX) ||
      (blueMinusRed <= 7 && blueMinusRed > 0 && ballPosition.x > this.gameService.map.kickoffLineX)
    );
  }

  public getIsMatchFinished(redScore: number, blueScore: number, isTry: false | TeamEnum): boolean {
    if (this.gameService.isOvertime === false) {
      if (
        redScore >= this.gameService.matchConfig.scoreLimit ||
        blueScore >= this.gameService.matchConfig.scoreLimit
      ) {
        return true;
      }
      return false;
    }

    if (isTry === false) {
      if (redScore !== blueScore) {
        return true;
      }
    } else {
      const ballPosition = this.room.getBallPosition();
      if (ballPosition.x > 0) {
        if (redScore > blueScore) {
          return true;
        } else if (blueScore - redScore <= 2) {
          return false;
        }
      } else {
        if (blueScore > redScore) {
          return true;
        } else if (redScore - blueScore <= 2) {
          return false;
        }
      }
    }
    return false;
  }

  public setPlayerAsPosition(player: HaxRugbyPlayer, position: PositionEnum): void {
    const team = this.room.gameService.teams.getTeamByTeamID(player.team);
    if (!team || this.gameService.isConversionShot) {
      return;
    }

    const oldPlayer = team.positions[position];

    team.positions.setPlayerAsPosition(player, position, team.name);

    if (
      this.gameService.isConversionAttempt === team.teamEnum &&
      position !== PositionEnum.KICKER
    ) {
      return;
    }
    if (
      this.gameService.isConversionAttempt !== team.teamEnum &&
      position !== PositionEnum.GOALKEEPER
    ) {
      return;
    }

    if (
      oldPlayer &&
      oldPlayer.team === player.team &&
      this.gameService.isConversionAttempt &&
      this.gameService.isGameStopped === false
    ) {
      const oldPlayerProps = this.room.getPlayerDiscProperties(oldPlayer.id);
      const newPlayerProps = this.room.getPlayerDiscProperties(player.id);

      this.room.setPlayerDiscProperties(oldPlayer.id, newPlayerProps);
      this.room.setPlayerDiscProperties(player.id, oldPlayerProps);
    }
  }
}

export default GameUtil;
