import { MINUTE_IN_MS } from '../../constants/general';

export interface IMatchConfig {
  timeLimit: number;
  timeLimitInMs: number;
  scoreLimit: number;
}

export class MatchConfig implements IMatchConfig {
  public timeLimit: number;
  public timeLimitInMs: number;
  public scoreLimit: number;

  constructor(timeLimit: number, scoreLimit: number) {
    this.timeLimit = timeLimit;
    this.timeLimitInMs = this.getTimeLimitInMs();
    this.scoreLimit = scoreLimit;
  }

  private getTimeLimitInMs(): number {
    return this.timeLimit * MINUTE_IN_MS;
  }
}
