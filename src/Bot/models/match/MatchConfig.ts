import { MINUTE_IN_MS } from '../../constants/constants';

export interface IMatchConfig {
  getTimeLimitInMs(): number;
}

class MatchConfig implements IMatchConfig {
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

export default MatchConfig;
