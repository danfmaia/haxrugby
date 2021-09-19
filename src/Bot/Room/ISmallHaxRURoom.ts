import { IRoom } from 'inversihax';
import { CustomPlayer } from '../models/CustomPlayer';

export interface ISmallHaxRURoom extends IRoom<CustomPlayer> {
  tickCount: number
  remainingTime: number;

  isMatchInProgress: boolean;
  // isAfterKickoff: boolean;
  isTimeRunning: boolean;

  redScore: number;
  blueScore: number;
}
