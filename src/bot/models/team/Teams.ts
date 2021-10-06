import { TeamID } from 'inversihax';

import { BLUE_TEAM_NAME, RED_TEAM_NAME } from '../../constants/team/team';
import PositionEnum from '../../enums/PositionEnum';
import TeamEnum from '../../enums/TeamEnum';
import { IChatService } from '../../services/room/ChatService';
import { HaxRugbyPlayer } from '../player/HaxRugbyPlayer';
import TeamPositions, { ITeamPositions } from '../player/TeamPositions';

export type TTeam = {
  name: string;
  teamEnum: TeamEnum;
  teamID: TeamID;
  positions: ITeamPositions;
};

export interface ITeams {
  red: TTeam;
  blue: TTeam;

  getTeam(team: TeamEnum): TTeam;
  getTeamByTeamID(teamID: TeamID): TTeam | null;

  fillAllPositions(players: HaxRugbyPlayer[]): void;
  emptyPositionsOnPlayerTeamChange(player: HaxRugbyPlayer): void;
  removePlayerFromPositions(player: HaxRugbyPlayer): void;
  getPlayerByTeamAndPosition(team: TeamEnum, position: PositionEnum): number | null;
}

class Teams implements ITeams {
  public red: TTeam;
  public blue: TTeam;

  constructor(chatService: IChatService, redTeamName?: string, blueTeamName?: string) {
    this.red = {
      name: !redTeamName ? RED_TEAM_NAME : redTeamName,
      teamEnum: TeamEnum.RED,
      teamID: TeamID.RedTeam,
      positions: new TeamPositions(chatService),
    };

    this.blue = {
      name: !blueTeamName ? BLUE_TEAM_NAME : blueTeamName,
      teamEnum: TeamEnum.BLUE,
      teamID: TeamID.BlueTeam,
      positions: new TeamPositions(chatService),
    };
  }

  public getTeam(team: TeamEnum): TTeam {
    if (team === TeamEnum.RED) {
      return this.red;
    }
    return this.blue;
  }

  public getTeamByTeamID(teamID: TeamID): TTeam | null {
    if (teamID === TeamID.RedTeam) {
      return this.red;
    } else if (teamID === TeamID.BlueTeam) {
      return this.blue;
    } else {
      return null;
    }
  }

  public fillAllPositions(players: HaxRugbyPlayer[]): void {
    const redFirstPlayer = players.find((player) => player.team === TeamID.RedTeam);
    this.red.positions.fillAll(redFirstPlayer, this.red.name);

    const blueFirstPlayer = players.find((player) => player.team === TeamID.BlueTeam);
    this.blue.positions.fillAll(blueFirstPlayer, this.blue.name);
  }

  public emptyPositionsOnPlayerTeamChange(player: HaxRugbyPlayer): void {
    this.red.positions.emptyPositionsOnPlayerTeamChange(player, this.red);
    this.blue.positions.emptyPositionsOnPlayerTeamChange(player, this.blue);
  }

  public removePlayerFromPositions(player: HaxRugbyPlayer): void {
    this.red.positions.removePlayerFromPositions(player, this.red);
    this.blue.positions.removePlayerFromPositions(player, this.blue);
  }

  public getPlayerByTeamAndPosition(team: TeamEnum, position: PositionEnum): number | null {
    switch (team) {
      case TeamEnum.RED:
        switch (position) {
          case PositionEnum.KICKER:
            return this.red.positions.kicker ? this.red.positions.kicker.id : null;
          case PositionEnum.GOALKEEPER:
            return this.red.positions.goalkeeper ? this.red.positions.goalkeeper.id : null;
          default:
        }
        break;
      case TeamEnum.BLUE:
        switch (position) {
          case PositionEnum.KICKER:
            return this.blue.positions.kicker ? this.blue.positions.kicker.id : null;
          case PositionEnum.GOALKEEPER:
            return this.blue.positions.goalkeeper ? this.blue.positions.goalkeeper.id : null;
          default:
        }
        break;
      default:
    }
    return null;
  }
}

export default Teams;
