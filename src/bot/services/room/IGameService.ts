import { IPlayerObject, IPosition, TeamID } from 'inversihax';

import { CustomPlayer } from '../../models/player/CustomPlayer';
import MatchConfig from '../../models/match/MatchConfig';
import { IScore } from '../../models/match/Score';
import HaxRugbyStadium from '../../models/stadium/HaxRugbyStadium';
import { IChatService } from './ChatService';
import { ITeams } from '../../models/team/Teams';
import { RoomUtil } from '../../util/RoomUtil';
import TeamEnum from '../../enums/TeamEnum';

export interface IGameService {
  chatService: IChatService;
  roomUtil: RoomUtil;

  stadium: HaxRugbyStadium;
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
  handleGameStart(byPlayer: CustomPlayer): void;
  handleGameStop(byPlayer: CustomPlayer): void;
  handleGamePause(byPlayer: CustomPlayer): void;
  handleGameUnpause(byPlayer: CustomPlayer): void;

  // player event handlers
  handlePlayerJoin(player: IPlayerObject): void;
  handlePlayerLeave(player: CustomPlayer): void;
  handlePlayerTeamChange(player: CustomPlayer): void;
  handlePlayerBallKick(player: CustomPlayer): void;

  handleTeamGoal(team: TeamID): void;

  /**
   *  OWN METHODS
   */

  initializeMatch(player?: CustomPlayer): void;
  cancelMatch(player: CustomPlayer, callback: () => void): void;

  getLastWinner(): TeamEnum | null | 0;
}
