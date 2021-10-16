import { IPosition, TeamID } from 'inversihax';
import { OFFSIDE_EMOJI } from '../constants/constants';
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

  public updateAheadPlayers(originPlayer: HaxRugbyPlayer): void {
    this.updateInsidePlayers(originPlayer);
  }

  private updateInsidePlayers(originPlayer: HaxRugbyPlayer): void {
    const players = this.room.getPlayerList().filter((player) => player.id !== originPlayer.id);
    const ballPosition = this.room.getBallPosition();

    if (originPlayer.team === TeamID.RedTeam) {
      const redPlayers = players.filter((player) => player.team === TeamID.RedTeam);
      redPlayers.forEach((player) => {
        if (ballPosition.x < this.gameService.map.tryLineX) {
          if (player.position.x >= this.gameService.map.tryLineXForPlayer) {
            // set own player inside
            this.setAheadPlayer(player);
            this.gameService.penaltyPosition = this.getPenaltyPosition(originPlayer.position);
          } else {
            // clear own player inside
            this.clearAheadPlayer(player);
          }
        } else {
          if (player.position.x < this.gameService.map.tryLineXForPlayer) {
            // clear own player inside
            this.clearAheadPlayer(player);
          }
        }
      });
      const bluePlayers = players.filter((player) => player.team === TeamID.BlueTeam);
      bluePlayers.forEach((player) => {
        if (player.position.x > -this.gameService.map.tryLineXForPlayer) {
          // clear opponent player inside
          this.clearAheadPlayer(player);
        }
      });
    }

    if (originPlayer.team === TeamID.BlueTeam) {
      const bluePlayers = players.filter((player) => player.team === TeamID.BlueTeam);
      bluePlayers.forEach((player) => {
        if (ballPosition.x > -this.gameService.map.tryLineX) {
          if (player.position.x <= -this.gameService.map.tryLineXForPlayer) {
            // set own player inside
            this.setAheadPlayer(player);
            this.gameService.penaltyPosition = this.getPenaltyPosition(originPlayer.position);
          } else {
            // clear own player inside
            this.clearAheadPlayer(player);
          }
        } else {
          if (player.position.x > -this.gameService.map.tryLineXForPlayer) {
            // clear own player inside
            this.clearAheadPlayer(player);
          }
        }
      });
      const redPlayers = players.filter((player) => player.team === TeamID.RedTeam);
      redPlayers.forEach((player) => {
        if (player.position.x < this.gameService.map.tryLineXForPlayer) {
          // clear opponent player inside
          this.clearAheadPlayer(player);
        }
      });
    }
  }

  private getPenaltyPosition(offenderPosition: IPosition): IPosition {
    const revisedPosition = offenderPosition;
    const map = this.gameService.map;

    if (offenderPosition.x < -map.areaLineX) {
      revisedPosition.x = -map.areaLineX;
    } else if (offenderPosition.x > map.areaLineX) {
      revisedPosition.x = map.areaLineX;
    }
    if (offenderPosition.y < -map.penaltyBoundaryY) {
      revisedPosition.y = -map.penaltyBoundaryY;
    } else if (offenderPosition.y > map.penaltyBoundaryY) {
      revisedPosition.y = map.penaltyBoundaryY;
    }
    return revisedPosition;
  }

  private setAheadPlayer(player: HaxRugbyPlayer) {
    this.gameService.aheadPlayers.inside.push(player.id);
    this.room.setPlayerAvatar(player.id, OFFSIDE_EMOJI);
  }

  private clearAheadPlayer(player: HaxRugbyPlayer) {
    this.gameService.aheadPlayers.inside = this.gameService.aheadPlayers.inside.filter(
      (playerId) => playerId !== player.id,
    );
    // @ts-ignore: Unreachable code error
    this.room.setPlayerAvatar(player.id, null);
  }

  public clearAllAheadPlayers(): void {
    this.gameService.aheadPlayers = {
      inside: [],
      offside: [],
    };
    const players = this.room.getPlayerList();
    players.forEach((player) => {
      if (player) {
        // @ts-ignore: Unreachable code error
        this.room.setPlayerAvatar(player.id, null);
      }
    });
  }
}

export default GameUtil;
