import { IDiscPropertiesObject, IPosition, TeamID } from 'inversihax';
import { AHEAD_EMOJI, PLAYER_RADIUS } from '../constants/constants';
import colors from '../constants/style/colors';
import { ALL_BLACKS_TEAM_NAME, BLUE_TEAM_NAME, RED_TEAM_NAME } from '../constants/team/team';
import AheadEnum from '../enums/AheadEnum';
import PositionEnum from '../enums/PositionEnum';
import TeamEnum from '../enums/TeamEnum';
import { HaxRugbyPlayer } from '../models/player/HaxRugbyPlayer';
import { TTeam } from '../models/team/Teams';
import { IHaxRugbyRoom } from '../rooms/HaxRugbyRoom';

import { IGameService } from '../services/room/IGameService';
import Util from './Util';

class GameUtil {
  constructor(public room: IHaxRugbyRoom, public gameService: IGameService) {}

  // public freezeGame(freeze: boolean = true): void {
  //   if (freeze) {
  //     const ballProps = this.room.getDiscProperties(0);

  //     const playerPropMaps: TPlayerPropsMap[] = [];
  //     const players = this.room
  //       .getPlayerList()
  //       .filter((player) => player.team !== TeamID.Spectators);
  //     players.forEach((player) => {
  //       playerPropMaps.push({
  //         playerId: player.id,
  //         discProps: this.room.getPlayerDiscProperties(player.id),
  //       });
  //     });

  //     this.gameService.freezeInfo = {
  //       ballProps,
  //       playerPropsMaps: playerPropMaps,
  //     };
  //   } else {
  //     this.gameService.freezeInfo = null;
  //   }
  // }

  public triggerScoringEffect(team: TeamEnum): void {
    this.gameService.isGameFrozen = true;

    const y = this.gameService.tryY ? this.gameService.tryY : 0;

    if (team === TeamEnum.RED) {
      this.room.setDiscProperties(14, {
        y,
        xspeed: 1,
      } as IDiscPropertiesObject);
    } else {
      this.room.setDiscProperties(13, {
        y,
        xspeed: -1,
      } as IDiscPropertiesObject);
    }
  }

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

  public cancelEmptyMatch(): void {
    const playersOnTeams_1 = this.room
      .getPlayerList()
      .filter((_player) => _player.team !== TeamID.Spectators);

    if (playersOnTeams_1.length === 0) {
      Util.timeout(15000, () => {
        const playersOnTeams_2 = this.room
          .getPlayerList()
          .filter((_player) => _player.team !== TeamID.Spectators);

        if (this.gameService.isMatchInProgress && playersOnTeams_2.length === 0) {
          this.gameService.chatService.sendBoldAnnouncement(
            `Partida cancelada automaticamente por ausência de jogadores.`,
            2,
          );
          Util.logWithTime('Partida cancelada automaticamente por ausência de jogadores.');
          this.gameService.cancelMatch();
        }
      });
    }
  }

  public transitionBallColor(team: TeamEnum, count: number, totalTicks: number): number | false {
    const percentage = (totalTicks - count) / totalTicks;
    const step = Math.floor(10 * percentage);

    if (team === TeamEnum.RED) {
      switch (step) {
        case 0:
          return 0xf7bdb4;
        case 1:
          return 0xf8c5bd;
        case 2:
          return 0xf9ccc5;
        case 3:
          return 0xfad3cd;
        case 4:
          return 0xfadad6;
        case 5:
          return 0xfbe2de;
        case 6:
          return 0xfce9e6;
        case 7:
          return 0xfdf0ee;
        case 8:
          return 0xfef8f7;
        case 9:
          return 0xffffff;
        default:
      }
    } else if (team === TeamEnum.BLUE) {
      switch (step) {
        case 0:
          return 0xb1cbf2;
        case 1:
          return 0xb9d1f3;
        case 2:
          return 0xc2d6f4;
        case 3:
          return 0xcbdcf6;
        case 4:
          return 0xd4e2f8;
        case 5:
          return 0xdce8f9;
        case 6:
          return 0xe5eefa;
        case 7:
          return 0xeef3fc;
        case 8:
          return 0xf6f9fe;
        case 9:
          return 0xffffff;
        default:
      }
    }

    return false;
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
          ballPosition.x > -this.gameService.map.tryLineX ||
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
          ballPosition.x < this.gameService.map.tryLineX ||
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
        player.position.x > -(this.gameService.map.areaLineX - PLAYER_RADIUS) &&
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
        player.position.x < this.gameService.map.areaLineX - PLAYER_RADIUS &&
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

  public grantAdvantage(player?: HaxRugbyPlayer, team?: TTeam): void {
    if (this.gameService.isPenalty === false) {
      return;
    }

    this.gameService.remainingTimeAtPenalty = null;
    this.gameService.isPenalty = false;
    this.gameService.util.clearAllAheadPlayers();

    if (player) {
      const playerTeam = this.gameService.teams.getTeamByTeamID(player.team);
      if (!playerTeam) {
        return;
      }
      this.gameService.chatService.sendBoldAnnouncement(
        `${player.name} (${playerTeam.name}) optou por VANTAGEM!   Segue o jogo!   ⏩`,
        2,
        undefined,
        colors.green,
      );
      return;
    }

    if (team) {
      this.gameService.chatService.sendBoldAnnouncement(
        `VANTAGEM AUTOMÁTICA para o ${team.name}!   Segue o jogo!   ⏩`,
        2,
        undefined,
        colors.green,
      );
    }
  }

  public getStreakVictoriesNumber(lastWinners: TeamEnum[]): number {
    if (lastWinners.length === 0) {
      return 0;
    }

    const lastWinner = lastWinners[0];

    let result: number = 0;
    for (let i = 0; i < lastWinners.length; i++) {
      const winner = lastWinners[i];
      if (winner === lastWinner) {
        result = result + 1;
      } else {
        return result;
      }
    }

    return result;
  }

  public allBlackerizeTeam(team: TeamEnum, streak: number): void {
    let colorNumber: number;
    if (streak === 0) {
      colorNumber = 0;
    } else {
      colorNumber = streak - 1;
    }

    let msgColor: number;
    if (team === TeamEnum.RED) {
      this.room.util.setTeamColor(team, colors.playerRedStreak[colorNumber]);
      msgColor = colors.playerRed;
    } else {
      this.room.util.setTeamColor(team, colors.playerBlueStreak[colorNumber]);
      msgColor = colors.playerBlue;
    }

    let msg: string | null = null;
    const teamName = this.gameService.teams.getTeamName(team);

    switch (streak) {
      case 0:
        if (teamName !== ALL_BLACKS_TEAM_NAME) {
          msg = `   ‐ ‐ ‐ ‐ ‐   O ${teamName} voltou ao normal.`;
        } else {
          if (team === TeamEnum.RED) {
            msg = `   ‐ ‐ ‐ ‐ ‐   O ${teamName} voltou a ser apenas um simples ${RED_TEAM_NAME}.`;
          } else {
            msg = `   ‐ ‐ ‐ ‐ ‐   O ${teamName} voltou a ser apenas um simples ${BLUE_TEAM_NAME}.`;
          }
        }
        this.gameService.teams.setTeamName(team, null);
        this.gameService.teams.setTeamMessageColor(team, null);
        msgColor = this.gameService.teams.getTeamMessageColor(team);
        break;
      case 2:
        msg = `   • • ‐ ‐ ‐   O ${teamName} ganhou 2 partidas seguidas!`;
        break;
      case 3:
        msg = `   • • • ‐ ‐   O ${teamName} ganhou 3 partidas seguidas. Alguém pára esse time!`;
        break;
      case 4:
        msg = `   • • • • ‐   O ${teamName} ganhou 4 partidas seguidas. Mais uma vitória e ele se transformará no ALL BLACKS!`;
        break;
      case 5:
        msg = `   • • • • •   🏔️   O ${teamName} ganhou 5 partidas seguidas! O ${teamName} se transformou no ALL BLACKS!   🏔️`;
        this.gameService.teams.setTeamName(team, ALL_BLACKS_TEAM_NAME);
        this.gameService.teams.setTeamMessageColor(team, colors.airBall);
        msgColor = this.gameService.teams.getTeamMessageColor(team);
        break;
      default:
        if (streak > 5) {
          msg = `   🏔️   O ${teamName} ganhou ${streak} partidas seguidas!   KA MATE!!!   KA MATE!!!   🏔️`;
          msgColor = this.gameService.teams.getTeamMessageColor(team);
        }
    }

    if (msg) {
      this.gameService.chatService.sendBoldAnnouncement(msg, 0, undefined, msgColor);
      this.gameService.chatService.sendBlankLine();
    }
  }
}

export default GameUtil;
