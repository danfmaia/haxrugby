import { IPlayerObject, IPosition } from 'inversihax';

import {
  MINUTE_IN_MS,
  DRIVE_MIN_TICKS,
  BALL_RADIUS,
  AFTER_TRY_MAX_TICKS,
} from '../../constants/constants';
import TeamEnum from '../../enums/TeamEnum';
import { CustomPlayer } from '../../models/player/CustomPlayer';
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
import IPlayerCountByTeam from '../../models/team/IPlayerCountByTeam';
import { IBallEnterOrLeaveIngoal } from '../../models/stadium/AHaxRugbyStadium';
import getDefaultConfig from '../../singletons/getDefaultConfig';

export default class GameService implements IGameService {
  private room: IHaxRugbyRoom;
  private adminService: IAdminService;
  public chatService: IChatService;
  private roomUtil: RoomUtil;

  public stadium: HaxRugbyStadium = smallStadium;
  public matchConfig: MatchConfig;

  private tickCount: number = 0;
  public remainingTime: number;
  public score: IScore = { red: 0, blue: 0 };
  private lastScores: IScore[] = [];

  public isMatchInProgress: boolean = false;
  private isBeforeKickoff: boolean = true;
  private isTimeRunning: boolean = false;
  public isOvertime: boolean = false;
  private isFinishing: boolean = false;

  private lastTouchInfo: ITouchInfo | null = null;
  private touchInfoList: (ITouchInfo | null)[] = [];
  private driverIds: number[] = [];
  private toucherCountByTeam: IPlayerCountByTeam = { red: 0, blue: 0 };
  private driverCountByTeam: IPlayerCountByTeam = { red: 0, blue: 0 };

  private lastBallPosition: IPosition = { x: 0, y: 0 };
  private isDefRec: boolean = false;

  private isTry: false | TeamEnum = false;
  private tryY: number | null = null;
  private afterTryTickCount: number = 0;

  private isConversionAttempt: false | TeamEnum = false;

  constructor(room: IHaxRugbyRoom) {
    this.room = room;
    this.adminService = new AdminService(room);
    this.chatService = new ChatService(room, this);
    this.roomUtil = new RoomUtil(room, this);

    this.matchConfig = getDefaultConfig(this.chatService);
    this.remainingTime = this.matchConfig.getTimeLimitInMs();
  }

  /**
   *  ROOM EVENT HANDLERS
   */

  public handleGameTick(): void {
    if (this.isMatchInProgress === false || this.isTimeRunning === false) {
      return;
    }

    if (this.isConversionAttempt === false) {
      const ballPosition = this.room.getBallPosition();

      this.tickCount = this.tickCount + 1;
      if (this.tickCount % 6 === 0) {
        this.checkForTimeEvents(ballPosition);
      }

      this.checkForGameEvents(ballPosition);

      this.lastBallPosition = ballPosition;
    }

    // this.handleConversionAttempt();
  }

  public handleGameStart(byPlayer: CustomPlayer): void {
    this.isBeforeKickoff = true;
    this.isTimeRunning = false;
    this.isFinishing = false;
    this.lastBallPosition = { x: 0, y: 0 };

    if (!this.isMatchInProgress) {
      this.initializeMatch(byPlayer);
    }

    if (this.isConversionAttempt && this.tryY) {
      this.initializeConversion(this.isConversionAttempt, this.tryY);
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
    this.matchConfig.teams.fillPositions(this.room.getPlayerList());
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
    this.tryY = null;
    this.isTry = false;
    this.isConversionAttempt = false;
    this.matchConfig.teams.fillPositions(this.room.getPlayerList());

    this.room.startGame();

    if (player) {
      this.chatService.sendBoldAnnouncement(`${player.name} iniciou uma nova partida!`, 2);
    } else {
      this.chatService.sendBoldAnnouncement('Iniciando nova partida!', 2);
    }
    this.chatService.sendNormalAnnouncement(Util.getDurationString(this.matchConfig.timeLimit));
    this.chatService.sendNormalAnnouncement(`Limite de pontos:  ${this.matchConfig.scoreLimit}`);
  }

  private finishMatch() {
    this.isMatchInProgress = false;
    this.isTimeRunning = false;
    this.isFinishing = true;
    this.room.pauseGame(true);
    this.lastScores.unshift(this.score);

    const lastWinner = this.getLastWinner();
    if (!lastWinner) {
      Util.timeout(5000, () => {
        if (this.isFinishing) {
          this.room.stopGame();
        }
      });
      return;
    }

    const winnerTeam = this.matchConfig.getTeamBySide(lastWinner);

    Util.timeout(5000, () => {
      if (this.isFinishing) {
        this.room.stopGame();
        if (lastWinner === TeamEnum.RED) {
          this.room.setCustomStadium(this.stadium.redMaps.kickoff);
        } else if (lastWinner === TeamEnum.BLUE) {
          this.room.setCustomStadium(this.stadium.blueMaps.kickoff);
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

  private initializeConversion(kickingTeam: TeamEnum, tryY: number) {
    const teams = this.matchConfig.teams;

    // place ball on tryY
    const updatedBallProps = this.room.getDiscProperties(0);
    updatedBallProps.y = tryY;
    this.room.setDiscProperties(0, updatedBallProps);

    // place kicker on tryY
    const kickerId = teams.getKickerByTeam(kickingTeam);

    if (kickerId !== null) {
      console.log('kickerName: ', this.room.getPlayer(kickerId).name);
      const updatedKickerProps = this.room.getPlayerDiscProperties(kickerId);
      updatedKickerProps.y = updatedKickerProps.y + tryY;
      this.room.setPlayerDiscProperties(kickerId, updatedKickerProps);
    }
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
        this.chatService.sendMainPromoLinksForSpectators();
      }

      if ([5000, 4000, 3000, 2000, 1000].includes(this.remainingTime)) {
        this.chatService.sendNormalAnnouncement(`${this.remainingTime / 1000}...`, 2);
      }
    }

    if (this.remainingTime <= 0) {
      if (this.score.red !== this.score.blue) {
        const canLosingTeamTieOrTurn = this.roomUtil.getCanLosingTeamTieOrTurn(ballPosition);

        if (canLosingTeamTieOrTurn === false) {
          this.finishMatch();
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

    if (this.lastTouchInfo && this.tryY === null) {
      if (this.checkForFieldGoal(ballPosition, this.lastTouchInfo)) {
        return;
      }
    }

    // check for ball drives
    this.driverIds = Physics.getDriverIds(this.touchInfoList);

    // count current ball drivers
    this.driverCountByTeam = this.roomUtil.countPlayersByTeam(this.driverIds);

    // in case of try, let the scorer attempt to take the ball more to the middle
    if (this.isTry) {
      this.handleAfterTry(ballPosition, this.driverCountByTeam);
      return;
    }

    const didBallEnterOrLeaveIngoal = this.stadium.getDidBallEnterOrLeaveIngoal(
      ballPosition,
      this.lastBallPosition,
    );
    this.checkForDefRec(ballPosition, didBallEnterOrLeaveIngoal);

    // count current ball touchers
    const lastNullableTouchInfo = this.touchInfoList[0];
    if (lastNullableTouchInfo) {
      this.toucherCountByTeam = this.roomUtil.countPlayersByTeam(lastNullableTouchInfo.toucherIds);
    } else {
      this.toucherCountByTeam = { red: 0, blue: 0 };
    }

    if (this.isDefRec === false) {
      const isTryOnGoalLine = this.stadium.getIsTryOnGoalLine(
        didBallEnterOrLeaveIngoal,
        ballPosition,
        this.driverCountByTeam,
      );
      if (isTryOnGoalLine === false) {
        if (this.checkForSafety(ballPosition)) {
          return;
        }
      }
    }

    if (this.checkForTry(ballPosition)) {
      return;
    }

    this.chatService.announceDefRec(didBallEnterOrLeaveIngoal, this.isDefRec);
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

  private checkForFieldGoal(ballPosition: IPosition, lastTouchInfo: ITouchInfo): boolean {
    const isGoal = this.stadium.getIsFieldGoal(
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
        teamName = this.matchConfig.teams.red.name;
        map = this.stadium.blueMaps.kickoff;
      } else {
        this.score.blue = this.score.blue + 3;
        teamName = this.matchConfig.teams.blue.name;
        map = this.stadium.redMaps.kickoff;
      }

      // announce goal
      this.chatService.sendBoldAnnouncement(`Field Goal do ${teamName}!`, 2);

      this.handleRestartOrFinishing(map);
      return true;
    }
    return false;
  }

  private checkForDefRec(
    ballPosition: IPosition,
    didBallEnterOrLeaveIngoal: IBallEnterOrLeaveIngoal,
  ) {
    if (didBallEnterOrLeaveIngoal === 'enter') {
      this.isDefRec = this.getIsDefRec(ballPosition);
    } else if (didBallEnterOrLeaveIngoal === 'leave') {
      this.isDefRec = false;
    }
  }

  private getIsDefRec(ballPosition: IPosition) {
    const lastTeamThatTouchedBall = this.roomUtil.getTeamThatTouchedBall(this.lastTouchInfo);
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
        teamName = this.matchConfig.teams.red.name;
        map = this.stadium.redMaps.kickoff;
      } else {
        teamName = this.matchConfig.teams.blue.name;
        map = this.stadium.blueMaps.kickoff;
      }

      // announce safety
      this.chatService.sendBoldAnnouncement(`Safety do ${teamName}!`, 2);

      this.handleRestartOrFinishing(map);
      return true;
    }
    return false;
  }

  private checkForTry(ballPosition: IPosition): boolean {
    let isTry: false | TeamEnum = false;

    // check for try on in-goal
    isTry = this.stadium.getIsTry(ballPosition, this.driverCountByTeam);

    // check for try on goal post
    if (isTry === false) {
      isTry = this.stadium.getIsTryOnGoalPost(ballPosition, this.toucherCountByTeam);
    }

    if (isTry) {
      this.isTry = isTry;
      this.tryY = ballPosition.y;
      let teamName: string;

      if (isTry === TeamEnum.RED) {
        this.score.red = this.score.red + 7;
        teamName = this.matchConfig.teams.red.name;
      } else {
        this.score.blue = this.score.blue + 7;
        teamName = this.matchConfig.teams.blue.name;
      }

      // announce try
      this.chatService.sendBoldAnnouncement(`Try do ${teamName}!`, 2);
      this.chatService.sendNormalAnnouncement(
        `O ${teamName} pode tentar levar a bola mais para o meio do campo.`,
      );

      return true;
    }
    return false;
  }

  private handleAfterTry(ballPosition: IPosition, driverCountByTeam: IPlayerCountByTeam) {
    if (this.isTry === false || this.tryY === null) {
      return;
    }

    let isStillAttempting: boolean = true;

    if (Math.abs(ballPosition.x) < this.stadium.tryLine) {
      // finish attempt when ball is moved out of the in-goal
      isStillAttempting = false;
    }

    const teamTouchingBall = this.roomUtil.getTeamThatTouchedBall(this.touchInfoList[0]);

    if (
      (ballPosition.x > 0 && teamTouchingBall === TeamEnum.BLUE) ||
      (ballPosition.x < 0 && teamTouchingBall === TeamEnum.RED)
    ) {
      // finish attempt when defense touches the ball
      isStillAttempting = false;
    }

    if (isStillAttempting) {
      if (
        (ballPosition.x > 0 && teamTouchingBall !== TeamEnum.RED) ||
        (ballPosition.x < 0 && teamTouchingBall !== TeamEnum.BLUE)
      ) {
        // increase tick count when offense is not touching the ball
        this.afterTryTickCount = this.afterTryTickCount + 1;
      }

      if (
        (ballPosition.x > 0 && driverCountByTeam.red > 0) ||
        (ballPosition.x < 0 && driverCountByTeam.blue > 0)
      ) {
        // 3 possibilities when ball is being driven by the offense
        if (Math.abs(ballPosition.y) < BALL_RADIUS / 2) {
          // 1: finish attempt when ball was driven close to center
          this.tryY = 0;
          isStillAttempting = false;
        } else if (Math.abs(ballPosition.y) < Math.abs(this.tryY)) {
          // 2: Continue attempt when ball is being driven towards the center, without increasing the tick count.
          //    In this case, update tryY.
          this.tryY = ballPosition.y;
        } else {
          // 3: Continue attempt when ball is being driven away from the center, but increase the tick count.
          //    In this case, do not update tryY.
          this.afterTryTickCount = this.afterTryTickCount + 1;
        }
      }
    }

    if (isStillAttempting === false || this.afterTryTickCount >= AFTER_TRY_MAX_TICKS) {
      this.isTimeRunning = false;
      this.afterTryTickCount = 0;
      this.room.pauseGame(true);

      let map: string;
      if (this.isTry === TeamEnum.RED) {
        this.score.red = this.score.red + 5;
        map = this.stadium.redMaps.getConversion(this.tryY);
      } else {
        this.score.blue = this.score.blue + 5;
        map = this.stadium.blueMaps.getConversion(this.tryY);
      }
      this.isConversionAttempt = this.isTry;
      this.isTry = false;

      this.handleRestartOrFinishing(map);
    }
  }

  // private handleConversionAttempt() {}

  private handleRestartOrFinishing(map: string) {
    if (this.roomUtil.getIsMatchFinished(this.score.red, this.score.blue, this.isTry) === false) {
      this.restartGame(map);
    } else {
      this.finishMatch();
    }
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

    // let updatedToucherIds = this.currentTouchInfo ? this.currentTouchInfo.toucherIds : [];
    // updatedToucherIds.push(playerId);

    this.lastTouchInfo = {
      toucherIds: [playerId],
      ballPosition: ballPosition,
      hasKick: true,
    };
  }

  private unregisterPlayerFromMatchData(playerId: number) {
    // unregister player from currentTouchInfo
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
