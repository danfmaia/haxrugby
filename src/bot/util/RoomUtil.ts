import { CollisionFlag, IDiscPropertiesObject, TeamID } from 'inversihax';
import colors from '../constants/style/colors';
import TeamEnum from '../enums/TeamEnum';
import TTouchInfo from '../models/game/TTouchInfo';
import { TPlayerPropsMap as TPlayerPropsMap } from '../models/player/TPlayerPropsMap';
import TPlayerCountByTeam from '../models/team/TPlayerCountByTeam';
import { IHaxRugbyRoom } from '../rooms/HaxRugbyRoom';

export class RoomUtil {
  public static ballProps: IDiscPropertiesObject | null = null;

  constructor(public room: IHaxRugbyRoom) {}

  public static getOriginalBallProps(room: IHaxRugbyRoom): IDiscPropertiesObject {
    if (this.ballProps) {
      return this.ballProps;
    } else {
      const ballProps = room.getDiscProperties(0);
      this.ballProps = ballProps;
      return ballProps;
    }
  }

  public countPlayersByTeam(playerIds: number[]): TPlayerCountByTeam {
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

  public getTeamThatTouchedBall(touchInfo: TTouchInfo | null): boolean | TeamEnum {
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

  public getAllPlayerPropsMaps(): TPlayerPropsMap[] {
    const players = this.room.getPlayerList();
    const result: TPlayerPropsMap[] = [];

    players.forEach((player) => {
      if (player.team !== TeamID.Spectators) {
        result.push({
          playerId: player.id,
          discProps: this.room.getPlayerDiscProperties(player.id),
        });
      }
    });

    return result;
  }

  public setAllPlayersProps(allPlayerPropsMaps: TPlayerPropsMap[]): void {
    allPlayerPropsMaps.forEach((playerPropsMap) => {
      this.room.setPlayerDiscProperties(playerPropsMap.playerId, playerPropsMap.discProps);
    });
  }

  public toggleAerialBall(toggle: boolean): void {
    const originalBallProps = RoomUtil.getOriginalBallProps(this.room);
    const updatedBallProps = {} as IDiscPropertiesObject;

    if (toggle) {
      updatedBallProps.cGroup = CollisionFlag.ball;
      updatedBallProps.cMask = CollisionFlag.wall;
      this.room.setDiscProperties(0, updatedBallProps);
    } else {
      updatedBallProps.cGroup = originalBallProps.cGroup;
      updatedBallProps.cMask = originalBallProps.cMask;
      this.room.setDiscProperties(0, updatedBallProps);
    }
  }

  public getIsAerialBall(): boolean {
    const ballCMask = this.room.getDiscProperties(0).cMask;
    if (ballCMask === CollisionFlag.wall) {
      return true;
    }
    return false;
  }

  public setBallColor(color: number): void {
    // return early if it's not changing color
    const ballProps = this.room.getDiscProperties(0);
    if (ballProps) {
      const ballCurrentColor = ballProps.color;
      if (ballCurrentColor === color) {
        return;
      }
    }

    const updatedBallProps = { color } as IDiscPropertiesObject;
    this.room.setDiscProperties(0, updatedBallProps);
  }

  public setTeamColor(team: TeamEnum, color: number): void {
    if (team === TeamEnum.RED) {
      this.room.setTeamColors(TeamID.RedTeam, 0, colors.white, new Int32Array([color]));
    } else {
      this.room.setTeamColors(TeamID.BlueTeam, 0, colors.white, new Int32Array([color]));
    }
  }
}
