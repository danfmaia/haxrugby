import { IPosition, TeamID } from 'inversihax';
import PositionEnum from '../enums/PositionEnum';
import TeamEnum from '../enums/TeamEnum';
import ITouchInfo from '../models/physics/ITouchInfo';
import { CustomPlayer } from '../models/player/CustomPlayer';
import IPlayerCountByTeam from '../models/team/IPlayerCountByTeam';
import { IHaxRugbyRoom } from '../rooms/HaxRugbyRoom';
import { IGameService } from '../services/room/IGameService';

export class RoomUtil {
  private room: IHaxRugbyRoom;
  private gameService: IGameService;

  constructor(room: IHaxRugbyRoom, gameService: IGameService) {
    this.room = room;
    this.gameService = gameService;
  }

  public countPlayersByTeam(playerIds: number[]): IPlayerCountByTeam {
    const playerCount = {
      red: 0,
      blue: 0,
    };

    playerIds.forEach((playerId) => {
      if (playerId) {
        if (this.room.getPlayer(playerId).team === 1) {
          playerCount.red = playerCount.red + 1;
        } else if (this.room.getPlayer(playerId).team === 2) {
          playerCount.blue = playerCount.blue + 1;
        }
      }
    });

    return playerCount;
  }

  public getCanLosingTeamTieOrTurn(ballPosition: IPosition): boolean {
    const blueMinusRed = this.gameService.score.blue - this.gameService.score.red;

    return (
      (-blueMinusRed <= 7 &&
        -blueMinusRed > 0 &&
        ballPosition.x < -this.gameService.stadium.kickoffLineX) ||
      (blueMinusRed <= 7 &&
        blueMinusRed > 0 &&
        ballPosition.x > this.gameService.stadium.kickoffLineX)
    );
  }

  public getTeamThatTouchedBall(touchInfo: ITouchInfo | null): boolean | TeamEnum {
    if (!touchInfo) {
      return false;
    }

    let hasRedTouched = false as boolean;
    let hasBlueTouched = false as boolean;

    touchInfo.toucherIds.forEach((toucherId) => {
      const team = this.room.getPlayer(toucherId).team;
      if (team === TeamID.RedTeam) {
        hasRedTouched = true;
      } else if (team === TeamID.BlueTeam) {
        hasBlueTouched = true;
      }
    });

    if (hasRedTouched === true && hasBlueTouched === false) {
      return TeamEnum.RED;
    } else if (hasRedTouched === false && hasBlueTouched === true) {
      return TeamEnum.BLUE;
    }
    return true;
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

  public setPlayerAsPosition(player: CustomPlayer, position: PositionEnum): void {
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
