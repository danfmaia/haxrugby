import { IRoom } from 'inversihax';
import { CustomPlayer } from '../models/CustomPlayer';
import { IMatchConfig } from '../models/match/MatchConfig';

export interface IHaxRugbyRoom extends IRoom<CustomPlayer> {
  matchConfig: IMatchConfig;
  isMatchInProgress: boolean;

  initializeMatch(player?: CustomPlayer): void;

  cancelMatch(player: CustomPlayer, callback: () => void): void;
}
