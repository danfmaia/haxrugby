import { IPosition, TeamID } from 'inversihax';
import { AHEAD_EMOJI, PLAYER_RADIUS } from '../constants/constants';
import AheadEnum from '../enums/AheadEnum';
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
    const players = this.room.getPlayerList().filter((player) => player.id !== originPlayer.id);
    const ballPosition = this.room.getBallPosition();

    const redPlayers = players.filter((player) => player.team === TeamID.RedTeam);
    const bluePlayers = players.filter((player) => player.team === TeamID.BlueTeam);

    if (originPlayer.team === TeamID.RedTeam) {
      redPlayers.forEach((player) => {
        const isRedPlayerInside = this.isPlayerInside(player);
        const isRedPlayerOffside = this.isPlayerOffside(
          originPlayer.position.x,
          player,
          bluePlayers,
        );

        if (ballPosition.x < this.gameService.map.tryLineX) {
          if (isRedPlayerInside) {
            // set own player inside
            this.setAheadPlayer(player, AheadEnum.INSIDE);
            this.gameService.penaltyPosition = this.getPenaltyPosition(originPlayer.position);
          } else {
            // clear own player inside
            this.clearAheadPlayer(player, AheadEnum.INSIDE);
          }
          if (isRedPlayerOffside) {
            // set own player offside
            this.setAheadPlayer(player, AheadEnum.OFFSIDE);
            this.gameService.penaltyPosition = this.getPenaltyPosition(originPlayer.position);
          } else {
            // clear own player offside
            this.clearAheadPlayer(player, AheadEnum.OFFSIDE);
          }
        } else {
          if (isRedPlayerInside === false) {
            // clear own player inside
            this.clearAheadPlayer(player, AheadEnum.INSIDE);
          }
          if (isRedPlayerOffside === false) {
            // clear own player offside
            this.clearAheadPlayer(player, AheadEnum.OFFSIDE);
          }
        }

        // if not ahead, clear player avatar
        if (isRedPlayerInside === false && isRedPlayerOffside === false) {
          this.clearPlayerAvatar(player.id);
        }
      });

      bluePlayers.forEach((player) => {
        if (
          ballPosition.x > -this.gameService.map.tryLineX &&
          player.position.x > -this.gameService.map.tryLineXForPlayer
        ) {
          // clear opposing player inside & offside
          this.clearAheadPlayer(player, true);
          this.clearPlayerAvatar(player.id);
        }
      });
    }

    if (originPlayer.team === TeamID.BlueTeam) {
      bluePlayers.forEach((player) => {
        const isBluePlayerInside = this.isPlayerInside(player);
        const isBluePlayerOffside = this.isPlayerOffside(
          originPlayer.position.x,
          player,
          redPlayers,
        );

        if (ballPosition.x > -this.gameService.map.tryLineX) {
          if (isBluePlayerInside) {
            // set own player inside
            this.setAheadPlayer(player, AheadEnum.INSIDE);
            this.gameService.penaltyPosition = this.getPenaltyPosition(originPlayer.position);
          } else {
            // clear own player inside
            this.clearAheadPlayer(player, AheadEnum.INSIDE);
          }
          if (isBluePlayerOffside) {
            // set own player offside
            this.setAheadPlayer(player, AheadEnum.OFFSIDE);
            this.gameService.penaltyPosition = this.getPenaltyPosition(originPlayer.position);
          } else {
            // clear own player offside
            this.clearAheadPlayer(player, AheadEnum.OFFSIDE);
          }
        } else {
          if (isBluePlayerInside === false) {
            // clear own player inside
            this.clearAheadPlayer(player, AheadEnum.INSIDE);
          }
          if (isBluePlayerOffside === false) {
            // clear own player offside
            this.clearAheadPlayer(player, AheadEnum.OFFSIDE);
          }
        }

        // if not ahead, clear player avatar
        if (isBluePlayerInside === false && isBluePlayerOffside === false) {
          this.clearPlayerAvatar(player.id);
        }
      });

      redPlayers.forEach((player) => {
        if (
          ballPosition.x < this.gameService.map.tryLineX &&
          player.position.x < this.gameService.map.tryLineXForPlayer
        ) {
          // clear opposing player inside & offside
          this.clearAheadPlayer(player, true);
          this.clearPlayerAvatar(player.id);
        }
      });
    }
  }

  private isPlayerInside(player: HaxRugbyPlayer): boolean {
    const team = player.team;

    if (team === TeamID.RedTeam) {
      if (player.position.x >= this.gameService.map.tryLineXForPlayer) {
        return true;
      }
    }

    if (team === TeamID.BlueTeam) {
      if (player.position.x <= -this.gameService.map.tryLineXForPlayer) {
        return true;
      }
    }

    return false;
  }

  private isPlayerOffside(
    originX: number,
    player: HaxRugbyPlayer,
    opposingPlayers: HaxRugbyPlayer[],
  ): boolean {
    const team = player.team;

    if (team === TeamID.RedTeam) {
      if (
        player.position.x >= -(this.gameService.map.areaLineX + PLAYER_RADIUS) &&
        player.position.x < this.gameService.map.tryLineXForPlayer
      ) {
        const offsideLineX = this.getOffsideLineX(originX, opposingPlayers);
        if (offsideLineX && player.position.x > offsideLineX) {
          return true;
        }
      }
    }

    if (team === TeamID.BlueTeam) {
      if (
        player.position.x <= this.gameService.map.areaLineX + PLAYER_RADIUS &&
        player.position.x > -this.gameService.map.tryLineXForPlayer
      ) {
        const offsideLineX = this.getOffsideLineX(originX, opposingPlayers);
        if (offsideLineX && player.position.x < offsideLineX) {
          return true;
        }
      }
    }

    return false;
  }

  private getOffsideLineX(originX: number, teamPlayers: HaxRugbyPlayer[]): number | null {
    if (teamPlayers.length === 0) {
      return null;
    }

    const team = teamPlayers[0].team;
    let deepestX: number = originX;

    if (team === TeamID.RedTeam) {
      teamPlayers.forEach((player) => {
        if (!deepestX || player.position.x < deepestX) {
          deepestX = player.position.x;
        }
      });
    } else if (team === TeamID.BlueTeam) {
      teamPlayers.forEach((player) => {
        if (!deepestX || player.position.x > deepestX) {
          deepestX = player.position.x;
        }
      });
    }

    return deepestX;
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

  private setAheadPlayer(player: HaxRugbyPlayer, aheadEnum: AheadEnum) {
    if (aheadEnum === AheadEnum.INSIDE) {
      this.gameService.aheadPlayers.inside.push(player.id);
    } else {
      this.gameService.aheadPlayers.offside.push(player.id);
    }
    this.room.setPlayerAvatar(player.id, AHEAD_EMOJI);
  }

  private clearAheadPlayer(player: HaxRugbyPlayer, aheadEnum: AheadEnum | true) {
    if (aheadEnum === AheadEnum.INSIDE) {
      this.gameService.aheadPlayers.inside = this.gameService.aheadPlayers.inside.filter(
        (playerId) => playerId !== player.id,
      );
    } else if (aheadEnum === AheadEnum.OFFSIDE) {
      this.gameService.aheadPlayers.offside = this.gameService.aheadPlayers.offside.filter(
        (playerId) => playerId !== player.id,
      );
    } else {
      this.gameService.aheadPlayers.inside = this.gameService.aheadPlayers.inside.filter(
        (playerId) => playerId !== player.id,
      );
      this.gameService.aheadPlayers.offside = this.gameService.aheadPlayers.offside.filter(
        (playerId) => playerId !== player.id,
      );
    }
  }

  public clearAllAheadPlayers(): void {
    this.gameService.aheadPlayers = {
      inside: [],
      offside: [],
    };
    const players = this.room.getPlayerList();
    players.forEach((player) => {
      if (player) {
        this.clearPlayerAvatar(player.id);
      }
    });
  }

  public clearPlayerAvatar(playerId: number): void {
    // @ts-ignore: Unreachable code error
    this.room.setPlayerAvatar(playerId, null);
  }
}

export default GameUtil;
