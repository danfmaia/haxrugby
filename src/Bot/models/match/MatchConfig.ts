import { MINUTE_IN_MS } from '../../constants/constants';
import TeamEnum from '../../enums/TeamEnum';

import { ITeams, TTeam } from '../team/Team';

export interface IMatchConfig {
  getTimeLimitInMs(): number;
}

class MatchConfig implements IMatchConfig {
  public teams: ITeams;
  public timeLimit: number;
  public scoreLimit: number;

  constructor(teams: ITeams, timeLimit: number, scoreLimit: number) {
    this.teams = teams;
    this.timeLimit = timeLimit;
    this.scoreLimit = scoreLimit;
  }

  public getTimeLimitInMs(): number {
    return this.timeLimit * MINUTE_IN_MS;
  }

  public getTeamBySide(team: TeamEnum): TTeam {
    if (team === TeamEnum.RED) {
      return this.teams.red;
    }
    return this.teams.blue;
  }
}

export default MatchConfig;
