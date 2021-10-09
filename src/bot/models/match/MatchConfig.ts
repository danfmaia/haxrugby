import { MINUTE_IN_MS } from '../../constants/constants';
import MapEnum from '../../enums/stadium/MapEnum';

export interface IMatchConfig {
  getTimeLimitInMs(): number;
}

class MatchConfig implements IMatchConfig {
  public timeLimit: number;
  public scoreLimit: number;
  public stadium: MapEnum;

  constructor(timeLimit: number, scoreLimit: number, stadium: MapEnum) {
    this.timeLimit = timeLimit;
    this.scoreLimit = scoreLimit;
    this.stadium = stadium;
  }

  public getTimeLimitInMs(): number {
    return this.timeLimit * MINUTE_IN_MS;
  }
}

export default MatchConfig;
