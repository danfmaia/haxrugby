import { IDiscPropertiesObject, TeamID } from 'inversihax';
import TeamEnum from '../enums/TeamEnum';
import TTouchInfo from '../models/physics/TTouchInfo';
import { TPlayerPropMap as TPlayerPropsMap } from '../models/player/PlayerPropMap';
import TPlayerCountByTeam from '../models/team/TPlayerCountByTeam';
import { IHaxRugbyRoom } from '../rooms/HaxRugbyRoom';

export class RoomUtil {
  constructor(public room: IHaxRugbyRoom) {}

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

  public setBallColor(color: number): void {
    const ballProps = { color } as IDiscPropertiesObject;
    this.room.setDiscProperties(0, ballProps);
  }
}
