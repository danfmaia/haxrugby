import { IRoom } from 'inversihax';
import { CustomPlayer } from '../models/CustomPlayer';
import { IMatchConfig } from '../models/match/MatchConfig';

export interface ISmallHaxRURoom extends IRoom<CustomPlayer> {
  matchConfig: IMatchConfig;

  tickCount: number;
  remainingTime: number;
  redScore: number;
  blueScore: number;

  isMatchInProgress: boolean;
  isTimeRunning: boolean;

  cancelMatch(player: CustomPlayer, callback: () => void): void;
}
