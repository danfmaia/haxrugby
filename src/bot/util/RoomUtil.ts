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
    const updatedBallProps = {} as IDiscPropertiesObject;
    const updatedAirBallProps = {} as IDiscPropertiesObject;

    if (toggle) {
      const currentBallProps = this.room.getDiscProperties(0);
      // const ballPosition = this.room.getBallPosition();
      updatedAirBallProps.x = currentBallProps.x - 2;
      updatedAirBallProps.y = currentBallProps.y - 2;
      updatedAirBallProps.xspeed = currentBallProps.xspeed;
      updatedAirBallProps.yspeed = currentBallProps.yspeed;

      this.room.setDiscProperties(1, updatedAirBallProps);
      updatedBallProps.cGroup = CollisionFlag.ball;
      updatedBallProps.cMask = CollisionFlag.wall;
      updatedBallProps.color = colors.airBall;
      this.room.setDiscProperties(0, updatedBallProps);
    } else {
      const originalAirBallProps = RoomUtil.getOriginalAirBallProps(this.room);
      updatedAirBallProps.x = originalAirBallProps.x;
      updatedAirBallProps.y = originalAirBallProps.y;
      updatedAirBallProps.xspeed = originalAirBallProps.xspeed;
      updatedAirBallProps.yspeed = originalAirBallProps.yspeed;
      this.room.setDiscProperties(1, updatedAirBallProps);

      const originalBallProps = RoomUtil.getOriginalBallProps(this.room);
      updatedBallProps.cGroup = originalBallProps.cGroup;
      updatedBallProps.cMask = originalBallProps.cMask;
      updatedBallProps.color = colors.ball;
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
}
