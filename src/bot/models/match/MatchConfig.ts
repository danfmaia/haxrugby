import { MINUTE_IN_MS } from '../../constants/constants';
import MapSizeEnum from '../../enums/stadium/MapSizeEnum';

export interface IMatchConfig {
  getTimeLimitInMs(): number;
}

class MatchConfig implements IMatchConfig {
  public timeLimit: number;
  public scoreLimit: number;
  public scoreDifference: number;
  public mapSize: MapSizeEnum;

  constructor(
    timeLimit: number,
    scoreLimit: number,
    scoreDifference: number,
    mapSize: MapSizeEnum,
  ) {
    this.timeLimit = timeLimit;
    this.scoreLimit = scoreLimit;
    this.scoreDifference = scoreDifference;
    this.mapSize = mapSize;
  }

  public getTimeLimitInMs(): number {
    return this.timeLimit * MINUTE_IN_MS;
  }
}

export default MatchConfig;
