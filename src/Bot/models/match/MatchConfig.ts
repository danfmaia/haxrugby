import { MINUTE_IN_MS } from '../../constants/general';

import Team from '../team/Team';

export interface IMatchConfig {
  teamA: Team;
  teamB: Team;
  timeLimit: number;
  scoreLimit: number;

  getTimeLimitInMs(): number;
}

class MatchConfig implements IMatchConfig {
  public teamA: Team;
  public teamB: Team;
  public timeLimit: number;
  public scoreLimit: number;

  constructor(teamA: Team, teamB: Team, timeLimit: number, scoreLimit: number) {
    this.teamA = teamA;
    this.teamB = teamB;
    this.timeLimit = timeLimit;
    this.scoreLimit = scoreLimit;
  }

  public getTimeLimitInMs(): number {
    return this.timeLimit * MINUTE_IN_MS;
  }
}

export default MatchConfig;
