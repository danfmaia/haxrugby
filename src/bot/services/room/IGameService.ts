import { IPlayerObject, IPosition, TeamID } from 'inversihax';

import { HaxRugbyPlayer } from '../../models/player/HaxRugbyPlayer';
import MatchConfig from '../../models/match/MatchConfig';
import { IScore } from '../../models/match/Score';
import HaxRugbyMap from '../../models/map/HaxRugbyMaps';
import { IChatService } from './ChatService';
import { ITeams } from '../../models/team/Teams';
import TeamEnum from '../../enums/TeamEnum';
import GameUtil from '../../util/GameUtil';
import TAheadPlayers from '../../models/game/TAheadPlayers';

export interface IGameService {
  chatService: IChatService;
  util: GameUtil;

  map: HaxRugbyMap;
  matchConfig: MatchConfig;
  teams: ITeams;

  remainingTime: number;
  score: IScore;

  isGameStopped: boolean;
  isMatchInProgress: boolean;
  isOvertime: boolean;

  lastBallPosition: IPosition;

  tryY: number | null;

  safetyTime: number;
  isConversionAttempt: false | TeamEnum;
  isReplacingBall: boolean;
  isConversionShot: boolean;

  aheadPlayers: TAheadPlayers;
  remainingTimeAtPenalty: number | null;
  isPenalty: TeamEnum | false;
  penaltyPosition: IPosition | null;

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

  handleStadiumChange(newStadiumName: string, byPlayer: HaxRugbyPlayer): void;

  /**
   *  OWN METHODS
   */

  initializeMatch(player?: HaxRugbyPlayer): void;
  cancelMatch(player: HaxRugbyPlayer, restartMatch?: () => void): void;

  handlePenalty(offendedTeam: TeamEnum): void;
  getLastWinner(): TeamEnum | null | 0;
}
