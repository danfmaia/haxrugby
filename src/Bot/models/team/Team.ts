import { TeamID } from 'inversihax';

import { BLUE_TEAM_NAME, RED_TEAM_NAME } from '../../constants/team/team';
import PositionEnum from '../../enums/PositionEnum';
import TeamEnum from '../../enums/TeamEnum';
import { IChatService } from '../../services/room/ChatService';
import { CustomPlayer } from '../player/CustomPlayer';
import TeamPositions, { ITeamPositions } from '../player/TeamPositions';

export type TTeam = {
  name: string;
  teamID: TeamID;
  positions: ITeamPositions;
};

export interface ITeams {
  red: TTeam;
  blue: TTeam;

  getTeam(team: TeamEnum): TTeam;

  fillAllPositions(players: CustomPlayer[]): void;
  clearPositionsOnPlayerTeamChange(player: CustomPlayer): void;
  getPlayerByTeamAndPosition(team: TeamEnum, position: PositionEnum): number | null;
}

class Teams implements ITeams {
  public red: TTeam;
  public blue: TTeam;

  constructor(chatService: IChatService, redTeamName?: string, blueTeamName?: string) {
    this.red = {
      name: !redTeamName ? RED_TEAM_NAME : redTeamName,
      teamID: TeamID.RedTeam,
      positions: new TeamPositions(chatService),
    };

    this.blue = {
      name: !blueTeamName ? BLUE_TEAM_NAME : blueTeamName,
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

  public fillAllPositions(players: CustomPlayer[]): void {
    console.log('players: ', JSON.stringify(players));

    const redFirstPlayer = players.find((player) => player.team === TeamID.RedTeam);
    this.red.positions.fillAll(redFirstPlayer, this.red.name);

    const blueFirstPlayer = players.find((player) => player.team === TeamID.BlueTeam);
    this.blue.positions.fillAll(blueFirstPlayer, this.blue.name);
  }

  public clearPositionsOnPlayerTeamChange(player: CustomPlayer): void {
    this.red.positions.clearPositionsOnPlayerTeamChange(player, this.red);
    this.blue.positions.clearPositionsOnPlayerTeamChange(player, this.blue);
  }

  public getPlayerByTeamAndPosition(team: TeamEnum, position: PositionEnum): number | null {
    switch (team) {
      case TeamEnum.RED:
        switch (position) {
          case PositionEnum.KICKER:
            return this.red.positions.kickerId;
          case PositionEnum.GOALKEEPER:
            return this.red.positions.kickerId;
          default:
        }
        break;
      case TeamEnum.BLUE:
        switch (position) {
          case PositionEnum.KICKER:
            return this.blue.positions.kickerId;
          case PositionEnum.GOALKEEPER:
            return this.blue.positions.kickerId;
          default:
        }
        break;
      default:
    }
    return null;
  }
}

export default Teams;
