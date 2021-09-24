import { IPlayerObject } from 'inversihax';

import { CustomPlayer } from '../../models/CustomPlayer';
import MatchConfig from '../../models/match/MatchConfig';
import { IScore } from '../../models/match/Score';

export interface IGameService {
  matchConfig: MatchConfig;

  remainingTime: number;
  score: IScore;

  isMatchInProgress: boolean;
  isOvertime: boolean;

  /**
   *  ROOM EVENT HANDLERS
   */

  // game event handlers
  handleGameTick(): void;
  handleGameStart(byPlayer: CustomPlayer): void;
  handleGameStop(byPlayer: CustomPlayer): void;
  handleGamePause(byPlayer: CustomPlayer): void;
  handleGameUnpause(byPlayer: CustomPlayer): void;

  // player event handlers
  handlePlayerJoin(player: IPlayerObject): void;
  handlePlayerLeave(player: CustomPlayer): void;
  handlePlayerBallKick(player: CustomPlayer): void;
  handlePlayerTeamChange(player: CustomPlayer): void;

  /**
   *  OWN METHODS
   */

  initializeMatch(player?: CustomPlayer): void;
  cancelMatch(player: CustomPlayer, callback: () => void): void;

  checkForTimeEvents(): void;
  checkForGameEvents(): void;
  registerKickAsTouch(playerId: number): void;
}
