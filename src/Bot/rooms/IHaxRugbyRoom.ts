import { IRoom } from 'inversihax';

import { CustomPlayer } from '../models/CustomPlayer';
import { IMatchConfig } from '../models/match/MatchConfig';
import TouchInfo from '../models/physics/TouchInfo';
import SmallStadium from '../models/stadium/SmallStadium';

export interface IHaxRugbyRoom extends IRoom<CustomPlayer> {
  stadium: SmallStadium;
  matchConfig: IMatchConfig;

  remainingTime: number;
  scoreA: number;
  scoreB: number;

  isMatchInProgress: boolean;
  isTimeRunning: boolean;
  isOvertime: boolean;

  lastTouchInfo: TouchInfo | null;

  initializeMatch(player?: CustomPlayer): void;
  cancelMatch(player: CustomPlayer, callback: () => void): void;
}
