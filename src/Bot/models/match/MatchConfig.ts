import { MINUTE_IN_MS } from '../../constants/general';

export interface IMatchConfig {
  timeLimit: number;
  scoreLimit: number;

  getTimeLimitInMs(): number;
}

export class MatchConfig implements IMatchConfig {
  public timeLimit: number;
  public scoreLimit: number;

  constructor(timeLimit: number, scoreLimit: number) {
    this.timeLimit = timeLimit;
    this.scoreLimit = scoreLimit;
  }

  public getTimeLimitInMs(): number {
    return this.timeLimit * MINUTE_IN_MS;
  }
}
