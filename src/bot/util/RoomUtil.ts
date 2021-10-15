import { CollisionFlag, IDiscPropertiesObject, TeamID } from 'inversihax';
import colors from '../constants/style/colors';
import TeamEnum from '../enums/TeamEnum';
import TTouchInfo from '../models/game/TTouchInfo';
import { TPlayerPropMap as TPlayerPropsMap } from '../models/player/PlayerPropMap';
import TPlayerCountByTeam from '../models/team/TPlayerCountByTeam';
import { IHaxRugbyRoom } from '../rooms/HaxRugbyRoom';

export class RoomUtil {
  public static ballProps: IDiscPropertiesObject | null = null;
  public static airBallProps: IDiscPropertiesObject | null = null;

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

  public static getOriginalAirBallProps(room: IHaxRugbyRoom): IDiscPropertiesObject {
    if (this.airBallProps) {
      return this.airBallProps;
    } else {
      const airBallProps = room.getDiscProperties(1);
      this.airBallProps = airBallProps;
      return airBallProps;
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

  public toggleAerialBall(toggle: boolean, isDefRec: boolean = false): void {
    if (toggle) {
      this.room.setDiscProperties(0, {
        cGroup: CollisionFlag.ball,
        cMask: CollisionFlag.wall,
        color: colors.airBall,
      } as IDiscPropertiesObject);

      const airBallProps = this.room.getDiscProperties(0);
      this.room.setDiscProperties(1, {
        x: airBallProps.x - 3,
        y: airBallProps.y - 3,
        xspeed: airBallProps.xspeed,
        yspeed: airBallProps.yspeed,
        cGroup: 0,
        cMask: CollisionFlag.c0,
        color: colors.ball,
      } as IDiscPropertiesObject);
    } else {
      const originalAirBallProps = RoomUtil.getOriginalAirBallProps(this.room);
      this.room.setDiscProperties(1, {
        x: originalAirBallProps.x,
        y: originalAirBallProps.y,
        xspeed: originalAirBallProps.xspeed,
        yspeed: originalAirBallProps.yspeed,
      } as IDiscPropertiesObject);

      const originalBallProps = RoomUtil.getOriginalBallProps(this.room);
      this.room.setDiscProperties(0, {
        cGroup: originalBallProps.cGroup,
        cMask: originalBallProps.cMask,
        color: colors.ball,
      } as IDiscPropertiesObject);
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
}
