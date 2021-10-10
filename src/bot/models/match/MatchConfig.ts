import { MINUTE_IN_MS } from '../../constants/constants';
import MapSizeEnum from '../../enums/stadium/MapSizeEnum';

export interface IMatchConfig {
  getTimeLimitInMs(): number;
}

class MatchConfig implements IMatchConfig {
  public timeLimit: number;
  public scoreLimit: number;
  public stadium: MapSizeEnum;

  constructor(timeLimit: number, scoreLimit: number, stadium: MapSizeEnum) {
    this.timeLimit = timeLimit;
    this.scoreLimit = scoreLimit;
    this.stadium = stadium;
  }

  public getTimeLimitInMs(): number {
    return this.timeLimit * MINUTE_IN_MS;
  }
}

export default MatchConfig;
