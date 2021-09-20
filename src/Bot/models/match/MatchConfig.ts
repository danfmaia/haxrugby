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
  private _teamA: Team;
  private _teamB: Team;

  private _timeLimit: number;
  private _scoreLimit: number;

  public get teamA(): Team {
    return this._teamA;
  }
  public set teamA(val: Team) {
    this._teamA = val;
  }

  public get teamB(): Team {
    return this._teamB;
  }
  public set teamB(val: Team) {
    this._teamB = val;
  }

  public get timeLimit(): number {
    return this._timeLimit;
  }
  public set timeLimit(val: number) {
    this._timeLimit = val;
  }

  public get scoreLimit(): number {
    return this._scoreLimit;
  }
  public set scoreLimit(val: number) {
    this._scoreLimit = val;
  }

  constructor(teamA: Team, teamB: Team, timeLimit: number, scoreLimit: number) {
    this._teamA = teamA;
    this._teamB = teamB;
    this._timeLimit = timeLimit;
    this._scoreLimit = scoreLimit;
  }

  public getTimeLimitInMs(): number {
    return this._timeLimit * MINUTE_IN_MS;
  }
}

export default MatchConfig;
