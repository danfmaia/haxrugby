import { IPlayerObject, IPosition, TeamID } from 'inversihax';

import { HaxRugbyPlayer } from '../../models/player/HaxRugbyPlayer';
import MatchConfig from '../../models/match/MatchConfig';
import { IScore } from '../../models/match/Score';
import HaxRugbyMap from '../../models/map/HaxRugbyMaps';
import { IChatService } from './ChatService';
import { ITeams } from '../../models/team/Teams';
import { RoomUtil } from '../../util/RoomUtil';
import TeamEnum from '../../enums/TeamEnum';

export interface IGameService {
  chatService: IChatService;
  roomUtil: RoomUtil;

  stadium: HaxRugbyMap;
  matchConfig: MatchConfig;
  teams: ITeams;

  remainingTime: number;
  score: IScore;

  isGameStopped: boolean;
  isMatchInProgress: boolean;
  isOvertime: boolean;

  lastBallPosition: IPosition;

  tryY: number | null;

  isConversionAttempt: false | TeamEnum;
  isReplacingBall: boolean;
  isConversionShot: boolean;

  /**
   *  ROOM EVENT HANDLERS
   */

  // game event handlers
  handleGameTick(): void;
  handleGameStart(byPlayer: HaxRugbyPlayer): void;
  handleGameStop(byPlayer: HaxRugbyPlayer): void;
  handleGamePause(byPlayer: HaxRugbyPlayer): void;
  handleGameUnpause(byPlayer: HaxRugbyPlayer): void;

  // player event handlers
  handlePlayerJoin(player: IPlayerObject): void;
  handlePlayerLeave(player: HaxRugbyPlayer): void;
  handlePlayerTeamChange(player: HaxRugbyPlayer): void;
  handlePlayerBallKick(player: HaxRugbyPlayer): void;

  handleTeamGoal(team: TeamID): void;

  /**
   *  OWN METHODS
   */

  initializeMatch(player?: HaxRugbyPlayer): void;
  cancelMatch(player: HaxRugbyPlayer, restartMatch?: () => void): void;

  getLastWinner(): TeamEnum | null | 0;
}
