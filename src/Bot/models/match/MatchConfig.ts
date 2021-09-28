import { MINUTE_IN_MS } from '../../constants/constants';
import TeamEnum from '../../enums/TeamEnum';

import Team from '../team/Team';

export interface IMatchConfig {
  // redTeam: Team;
  // blueTeam: Team;
  // timeLimit: number;
  // scoreLimit: number;

  getTimeLimitInMs(): number;
}

class MatchConfig implements IMatchConfig {
  public redTeam: Team;
  public blueTeam: Team;
  public timeLimit: number;
  public scoreLimit: number;

  constructor(redTeam: Team, blueTeam: Team, timeLimit: number, scoreLimit: number) {
    this.redTeam = redTeam;
    this.blueTeam = blueTeam;
    this.timeLimit = timeLimit;
    this.scoreLimit = scoreLimit;
  }

  public getTimeLimitInMs(): number {
    return this.timeLimit * MINUTE_IN_MS;
  }

  public getTeamBySide(team: TeamEnum): Team {
    if (team === TeamEnum.RED) {
      return this.redTeam;
    }
    return this.blueTeam;
  }
}

export default MatchConfig;
