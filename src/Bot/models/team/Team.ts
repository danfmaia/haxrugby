import { TeamID } from 'inversihax';

import { BLUE_TEAM_NAME, RED_TEAM_NAME } from '../../constants/team/team';
import TeamEnum from '../../enums/TeamEnum';
import { IChatService } from '../../services/room/ChatService';
import { CustomPlayer } from '../player/CustomPlayer';
import TeamPositions, { ITeamPositions } from '../player/Positions';

export type TTeam = {
  name: string;
  positions: ITeamPositions;
};

export interface ITeams {
  red: TTeam;
  blue: TTeam;

  fillPositions(players: CustomPlayer[]): void;
  getKickerByTeam(team: TeamEnum): number | null;
}

class Teams implements ITeams {
  private chatService: IChatService;

  public red: TTeam;
  public blue: TTeam;

  constructor(chatService: IChatService, redTeamName?: string, blueTeamName?: string) {
    this.chatService = chatService;

    this.red = {
      name: !redTeamName ? RED_TEAM_NAME : redTeamName,
      positions: new TeamPositions(),
    };

    this.blue = {
      name: !blueTeamName ? BLUE_TEAM_NAME : blueTeamName,
      positions: new TeamPositions(),
    };
  }

  public fillPositions(players: CustomPlayer[]): void {
    const redFirstPlayer = players.find((player) => player.team === TeamID.RedTeam);
    this.red.positions.fillAll(redFirstPlayer, this.chatService, this.red.name);

    const blueFirstPlayer = players.find((player) => player.team === TeamID.BlueTeam);
    this.blue.positions.fillAll(blueFirstPlayer, this.chatService, this.red.name);
  }

  public getKickerByTeam(team: TeamEnum): number | null {
    switch (team) {
      case TeamEnum.RED:
        return this.red.positions.kicker;
      case TeamEnum.BLUE:
        return this.blue.positions.kicker;
      default:
        return null;
    }
  }
}

export default Teams;
