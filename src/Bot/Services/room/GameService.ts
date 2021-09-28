import { IPlayerObject, IPosition } from 'inversihax';

import defaultConfig from '../../singletons/defaultConfig';
import { MINUTE_IN_MS, DRIVE_MIN_TICKS } from '../../constants/constants';
import TeamEnum from '../../enums/TeamEnum';
import { CustomPlayer } from '../../models/CustomPlayer';
import MatchConfig from '../../models/match/MatchConfig';
import { IScore } from '../../models/match/Score';
import ITouchInfo from '../../models/physics/ITouchInfo';
import { IHaxRugbyRoom } from '../../rooms/HaxRugbyRoom';
import smallStadium from '../../singletons/smallStadium';
import Physics from '../../util/Physics';
import Util from '../../util/Util';
import { IGameService } from './IGameService';
import AdminService, { IAdminService } from './AdminService';
import ChatService, { IChatService } from './ChatService';
import { RoomUtil } from '../../util/RoomUtil';
import HaxRugbyStadium from '../../models/stadium/HaxRugbyStadium';
import {
  MSG_BALL_LEAVE_INGOAL,
  MSG_DEF_REC,
  MSG_SAFETY_ALLOWED,
} from '../../constants/dictionary/dictionary';
import IPlayerCountByTeam from '../../models/team/IPlayerCountByTeam';

export default class GameService implements IGameService {
  private room: IHaxRugbyRoom;
  private adminService: IAdminService;
  public chatService: IChatService;
  private roomUtil: RoomUtil;

  public stadium: HaxRugbyStadium = smallStadium;
  public matchConfig: MatchConfig = defaultConfig;

  private tickCount: number = 0;
  public remainingTime: number = this.matchConfig.getTimeLimitInMs();
  public score: IScore = { red: 0, blue: 0 };
  private lastScores: IScore[] = [];

  public isMatchInProgress: boolean = false;
  private isBeforeKickoff: boolean = true;
  private isTimeRunning: boolean = false;
  public isOvertime: boolean = false;
  private isCompleting: boolean = false;

  private lastTouchInfo: ITouchInfo | null = null;
  private touchInfoList: (ITouchInfo | null)[] = [];
  private driverIds: number[] = [];
  private toucherCountByTeam: IPlayerCountByTeam = { red: 0, blue: 0 };
  private driverCountByTeam: IPlayerCountByTeam = { red: 0, blue: 0 };

  private lastBallPosition: IPosition = { x: 0, y: 0 };
  private isDefRec: boolean = false;

  constructor(room: IHaxRugbyRoom) {
    this.room = room;
    this.adminService = new AdminService(room);
    this.chatService = new ChatService(room, this);
    this.roomUtil = new RoomUtil(room, this);
  }

  /**
   *  ROOM EVENT HANDLERS
   */

  public handleGameTick(): void {
    if (this.isMatchInProgress === false || this.isTimeRunning === false) {
      return;
    }

    const ballPosition = this.room.getBallPosition();

    this.tickCount = this.tickCount + 1;
    if (this.tickCount % 6 === 0) {
      this.checkForTimeEvents(ballPosition);
    }

    this.checkForGameEvents(ballPosition);

    this.lastBallPosition = ballPosition;
  }

  public handleGameStart(byPlayer: CustomPlayer): void {
    this.isBeforeKickoff = true;
    this.isTimeRunning = false;
    this.isCompleting = false;
    this.lastBallPosition = { x: 0, y: 0 };

    if (!this.isMatchInProgress) {
      this.initializeMatch(byPlayer);
    }
  }

  public handleGameStop(byPlayer: CustomPlayer): void {
    if (this.isTimeRunning) {
      this.isTimeRunning = false;
      this.chatService.sendMatchStatus(2);
    }
  }

  public handleGamePause(byPlayer: CustomPlayer): void {
    if (this.isMatchInProgress && this.isTimeRunning) {
      this.isTimeRunning = false;
      this.chatService.sendMatchStatus();
    }
  }

  public handleGameUnpause(byPlayer: CustomPlayer): void {
    if (this.isMatchInProgress && this.isTimeRunning === false && this.isBeforeKickoff === false) {
      this.isTimeRunning = true;
      this.chatService.sendMatchStatus();
    }
  }

  public handlePlayerJoin(player: IPlayerObject): void {
    this.adminService.setFirstPlayerAsAdmin(player.id);
    this.chatService.sendGreetingsToIncomingPlayer(player.id);
  }

  public handlePlayerLeave(player: CustomPlayer): void {
    this.unregisterPlayerFromMatchData(player.id);
    this.adminService.setEarliestPlayerAsAdmin();
  }

  public handlePlayerBallKick(player: CustomPlayer): void {
    // run time after kickoff
    if (this.isBeforeKickoff) {
      this.isBeforeKickoff = false;
      this.isTimeRunning = true;
      this.chatService.sendMatchStatus();
    }

    this.registerKickAsTouch(player.id);
  }

  public handlePlayerTeamChange(player: CustomPlayer): void {
    // pin host at top of spectators list
    if (player.id === 0) {
      this.room.setPlayerTeam(0, 0);
      this.room.reorderPlayers([0], true);
    }
  }

  /**
   *  OWN METHODS
   */

  public initializeMatch(player?: CustomPlayer): void {
    this.remainingTime = this.matchConfig.getTimeLimitInMs();
    this.isMatchInProgress = true;
    this.isOvertime = false;
    this.score = { red: 0, blue: 0 };

    this.lastTouchInfo = null;
    this.touchInfoList = [];
    this.driverIds = [];

    this.room.startGame();

    if (player) {
      this.chatService.sendBoldAnnouncement(`${player.name} iniciou uma nova partida!`, 2);
    } else {
      this.chatService.sendBoldAnnouncement('Iniciando nova partida!', 2);
    }
    this.chatService.sendNormalAnnouncement(Util.getDurationString(this.matchConfig.timeLimit));
    this.chatService.sendNormalAnnouncement(`Limite de pontos:  ${this.matchConfig.scoreLimit}`);
  }

  private completeMatch() {
    this.isMatchInProgress = false;
    this.isTimeRunning = false;
    this.isCompleting = true;
    this.room.pauseGame(true);
    this.lastScores.unshift(this.score);

    const lastWinner = this.getLastWinner();
    if (!lastWinner) {
      Util.timeout(5000, () => {
        if (this.isCompleting) {
          this.room.stopGame();
        }
      });
      return;
    }

    const winnerTeam = this.matchConfig.getTeamBySide(lastWinner);

    Util.timeout(5000, () => {
      if (this.isCompleting) {
        this.room.stopGame();
        if (lastWinner === TeamEnum.RED) {
          this.room.setCustomStadium(this.stadium.map_red);
        } else if (lastWinner === TeamEnum.BLUE) {
          this.room.setCustomStadium(this.stadium.map_blue);
        }
      }
    });

    this.chatService.sendBoldAnnouncement(`Fim da partida. Vitória do ${winnerTeam.name}!`, 2);
    this.chatService.sendNormalAnnouncement(`Placar final: ${this.score.red}-${this.score.blue}`);
  }

  public cancelMatch(player: CustomPlayer, callback: () => void): void {
    this.isMatchInProgress = false;
    this.isTimeRunning = false;
    this.room.pauseGame(true);
    Util.timeout(3500, () => {
      this.room.stopGame();
      callback();
    });

    this.chatService.sendBoldAnnouncement(`Partida cancelada por ${player.name}!`, 2);
    this.chatService.sendNormalAnnouncement(
      `Tempo restante:  ${Util.getRemainingTimeString(this.remainingTime)}`,
    );
    this.chatService.sendNormalAnnouncement(
      `Placar parcial:  ${this.score.red}-${this.score.blue}`,
    );
    this.chatService.sendNormalAnnouncement('');
    this.chatService.sendNormalAnnouncement('Iniciando nova partida em 5 segundos...');
  }

  private checkForTimeEvents(ballPosition: IPosition) {
    this.remainingTime = this.remainingTime - 1000 / 10;

    if (this.isOvertime === false) {
      if (
        (this.remainingTime < this.matchConfig.getTimeLimitInMs() &&
          this.remainingTime > 0 &&
          this.remainingTime % MINUTE_IN_MS === 0) ||
        this.remainingTime === MINUTE_IN_MS / 2 ||
        this.remainingTime === MINUTE_IN_MS / 4
      ) {
        this.chatService.sendMatchStatus(2);
      }

      if (this.remainingTime === this.matchConfig.getTimeLimitInMs() - 5000) {
        this.chatService.sendMainPromotionLinks();
      }

      if ([5000, 4000, 3000, 2000, 1000].includes(this.remainingTime)) {
        this.chatService.sendNormalAnnouncement(`${this.remainingTime / 1000}...`, 2);
      }
    }

    if (this.remainingTime <= 0) {
      if (this.score.red !== this.score.blue) {
        const canLosingTeamTieOrTurn = this.roomUtil.getCanLosingTeamTieOrTurn(ballPosition);

        if (canLosingTeamTieOrTurn === false) {
          this.completeMatch();
        } else if (this.isOvertime === false) {
          this.isOvertime = true;
          this.chatService.announceBallPositionOvertime();
        }
      } else if (this.isOvertime === false) {
        this.isOvertime = true;
        this.chatService.announceRegularOvertime();
      }
    }
  }

  private checkForGameEvents(ballPosition: IPosition) {
    const players = this.room.getPlayerList();

    this.checkForTouches(players, ballPosition);

    if (this.lastTouchInfo) {
      this.checkForGoal(ballPosition, this.lastTouchInfo);
    }

    // check for ball drives
    this.driverIds = Physics.getDriverIds(this.touchInfoList);

    this.checkForDefRec(ballPosition, this.lastBallPosition);

    // count current ball drivers
    this.driverCountByTeam = this.roomUtil.countPlayersByTeam(this.driverIds);

    // count current ball touchers
    const lastNullableTouchInfo = this.touchInfoList[0];
    if (lastNullableTouchInfo) {
      this.toucherCountByTeam = this.roomUtil.countPlayersByTeam(lastNullableTouchInfo.toucherIds);
    } else {
      this.toucherCountByTeam = { red: 0, blue: 0 };
    }

    if (this.isDefRec === false) {
      if (this.checkForSafety(ballPosition)) {
        return;
      }
    }

    this.checkForTry(ballPosition);
  }

  private checkForTouches(players: CustomPlayer[], ballPosition: IPosition) {
    const newTouchInfo = Physics.getTouchInfoList(players, ballPosition);
    if (newTouchInfo) {
      this.lastTouchInfo = newTouchInfo;
    }

    this.touchInfoList.unshift(newTouchInfo);
    if (this.touchInfoList.length > DRIVE_MIN_TICKS) {
      this.touchInfoList.pop();
    }
  }

  private checkForGoal(ballPosition: IPosition, lastTouchInfo: ITouchInfo) {
    const isGoal = this.stadium.getIsGoal(
      ballPosition,
      this.room.getDiscProperties(0).xspeed,
      lastTouchInfo.ballPosition,
    );

    if (isGoal) {
      this.isTimeRunning = false;
      this.room.pauseGame(true);
      let teamName: string;
      let map: string;

      if (isGoal === TeamEnum.RED) {
        this.score.red = this.score.red + 3;
        teamName = this.matchConfig.redTeam.name;
        map = this.stadium.map_blue;
      } else {
        this.score.blue = this.score.blue + 3;
        teamName = this.matchConfig.blueTeam.name;
        map = this.stadium.map_red;
      }

      // announce goal
      this.chatService.sendBoldAnnouncement(`Field Goal do ${teamName}!`, 2);

      this.handleRestartOrCompletion(map);
    }
  }

  private checkForDefRec(ballPosition: IPosition, lastBallPosition: IPosition) {
    const didBallEnterOrLeaveIngoal = this.stadium.getDidBallEnterOrLeaveIngoal(
      ballPosition,
      lastBallPosition,
    );
    if (didBallEnterOrLeaveIngoal === 'enter') {
      this.isDefRec = this.getIsDefRec(ballPosition);
      if (this.isDefRec) {
        this.chatService.sendBoldAnnouncement(MSG_DEF_REC[0], 2);
        this.chatService.sendNormalAnnouncement(MSG_DEF_REC[1]);
      } else {
        this.chatService.sendBoldAnnouncement(MSG_SAFETY_ALLOWED, 0);
      }
    } else if (didBallEnterOrLeaveIngoal === 'leave') {
      this.isDefRec = false;
      this.chatService.sendNormalAnnouncement(MSG_BALL_LEAVE_INGOAL);
    }
  }

  private getIsDefRec(ballPosition: IPosition) {
    const lastTeamThatTouchedBall = this.roomUtil.getLastTeamThatTouchedBall(this.lastTouchInfo);
    if (typeof lastTeamThatTouchedBall === 'boolean') {
      return false;
    }

    if (
      (ballPosition.x < 0 && lastTeamThatTouchedBall === TeamEnum.RED) ||
      (ballPosition.x > 0 && lastTeamThatTouchedBall === TeamEnum.BLUE)
    ) {
      return true;
    }
    return false;
  }

  private checkForSafety(ballPosition: IPosition): boolean {
    let isSafety: false | TeamEnum = false;

    // check for safety on in-goal
    isSafety = this.stadium.getIsSafety(ballPosition, this.driverCountByTeam);

    // check for safety on goal post
    if (isSafety === false) {
      isSafety = this.stadium.getIsSafetyOnGoalPost(ballPosition, this.toucherCountByTeam);
    }

    if (isSafety) {
      this.isTimeRunning = false;
      this.room.pauseGame(true);
      let teamName: string;
      let map: string;

      if (isSafety === TeamEnum.RED) {
        teamName = this.matchConfig.redTeam.name;
        map = this.stadium.map_red;
      } else {
        teamName = this.matchConfig.blueTeam.name;
        map = this.stadium.map_blue;
      }

      // announce safety
      this.chatService.sendBoldAnnouncement(`Safety do ${teamName}!`, 2);

      this.handleRestartOrCompletion(map);
      return true;
    }
    return false;
  }

  private checkForTry(ballPosition: IPosition) {
    let isTry: false | TeamEnum = false;

    // check for try on in-goal
    isTry = this.stadium.getIsTry(ballPosition, this.driverCountByTeam);

    // check for try on goal post
    if (isTry === false) {
      isTry = this.stadium.getIsTryOnGoalPost(ballPosition, this.toucherCountByTeam);
    }

    if (isTry) {
      this.isTimeRunning = false;
      this.room.pauseGame(true);
      let teamName: string;
      let map: string;

      if (isTry === TeamEnum.RED) {
        this.score.red = this.score.red + 7;
        teamName = this.matchConfig.redTeam.name;
        map = this.stadium.map_blue;
      } else {
        this.score.blue = this.score.blue + 7;
        teamName = this.matchConfig.blueTeam.name;
        map = this.stadium.map_red;
      }

      // announce try
      this.chatService.sendBoldAnnouncement(`Try do ${teamName}!`, 2);

      this.handleRestartOrCompletion(map);
    }
  }

  private handleRestartOrCompletion(map: string) {
    if (this.getIsMatchCompleted() === false) {
      this.restartGame(map);
    } else {
      this.completeMatch();
    }
  }

  private getIsMatchCompleted(): boolean {
    if (this.isOvertime === false) {
      if (
        this.score.red >= this.matchConfig.scoreLimit ||
        this.score.blue >= this.matchConfig.scoreLimit
      ) {
        return true;
      }
      return false;
    }

    if (this.score.red !== this.score.blue) {
      return true;
    }
    return false;
  }

  private restartGame(map: string) {
    this.chatService.sendMatchStatus();
    Util.timeout(3000, () => {
      this.room.stopGame();
      this.room.setCustomStadium(map);
      this.room.startGame();
    });
  }

  private getLastWinner(): TeamEnum | null | 0 {
    const lastScore = this.lastScores[0];
    if (!lastScore) {
      return null;
    }
    if (lastScore.red > lastScore.blue) {
      return TeamEnum.RED;
    } else if (lastScore.red < lastScore.blue) {
      return TeamEnum.BLUE;
    }
    return 0;
  }

  // TODO: Consider concurrence, that is, 2 or more players kicking the ball simultaneously.
  private registerKickAsTouch(playerId: number) {
    const ballPosition = this.room.getBallPosition();

    // let updatedToucherIds = this.lastTouchInfo ? this.lastTouchInfo.toucherIds : [];
    // updatedToucherIds.push(playerId);

    this.lastTouchInfo = {
      toucherIds: [playerId],
      ballPosition: ballPosition,
      hasKick: true,
    };
  }

  private unregisterPlayerFromMatchData(playerId: number) {
    // unregister player from lastTouchInfo
    if (this.lastTouchInfo) {
      this.lastTouchInfo.toucherIds = this.lastTouchInfo.toucherIds.filter(
        (toucherId) => toucherId !== playerId,
      );
    }

    // unregister player from touchInfoList
    this.touchInfoList.map((touchInfo) => {
      if (touchInfo) {
        return {
          ...touchInfo,
          toucherIds: touchInfo.toucherIds.filter((toucherId) => toucherId !== playerId),
        };
      }
    });

    // unregister player from driverIds
    this.driverIds = this.driverIds.filter((driverId) => driverId !== playerId);
  }
}
