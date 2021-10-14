import { IDiscPropertiesObject, IPlayerObject, IPosition, TeamID } from 'inversihax';

import {
  MINUTE_IN_MS,
  DRIVE_MIN_TICKS,
  BALL_RADIUS,
  AFTER_TRY_MAX_TICKS,
  AIR_KICK_TICKS,
  AIR_KICK_BLOCK_TICKS,
  NORMAL_AIR_KICK_BOOST,
  SMALL_AIR_KICK_BOOST,
  BALL_TEAM_COLOR_TICKS,
  SAFETY_MAX_TIME,
} from '../../constants/constants';
import TeamEnum from '../../enums/TeamEnum';
import { HaxRugbyPlayer } from '../../models/player/HaxRugbyPlayer';
import MatchConfig from '../../models/match/MatchConfig';
import { IScore } from '../../models/match/Score';
import TTouchInfo from '../../models/game/TTouchInfo';
import { IHaxRugbyRoom } from '../../rooms/HaxRugbyRoom';
import smallMap from '../../singletons/smallMap';
import Physics from '../../util/Physics';
import Util from '../../util/Util';
import { IGameService } from './IGameService';
import AdminService, { IAdminService } from './AdminService';
import ChatService, { IChatService } from './ChatService';
import HaxRugbyMap from '../../models/map/HaxRugbyMaps';
import TPlayerCountByTeam from '../../models/team/TPlayerCountByTeam';
import { IBallEnterOrLeaveIngoal } from '../../models/map/AHaxRugbyMap';
import getMatchConfig from '../../singletons/getMatchConfig';
import PositionEnum from '../../enums/PositionEnum';
import TeamUtil from '../../util/TeamUtil';
import Teams, { ITeams } from '../../models/team/Teams';
import colors from '../../constants/style/colors';
import TLastDriveInfo from '../../models/game/TLastDriveInfo';
import GameUtil from '../../util/GameUtil';
import { HaxRugbyPlayerConfig } from '../../models/player/HaxRugbyPlayerConfig';
import MapSizeEnum from '../../enums/stadium/MapSizeEnum';
import { RoomUtil } from '../../util/RoomUtil';

export default class GameService implements IGameService {
  private room: IHaxRugbyRoom;
  private adminService: IAdminService;
  public chatService: IChatService;
  public util: GameUtil;

  public map: HaxRugbyMap = smallMap;
  public matchConfig: MatchConfig;
  public teams: ITeams;

  private tickCount: number = 0;
  public remainingTime: number;
  public score: IScore = { red: 0, blue: 0 };
  private lastScores: IScore[] = [];

  public isGameStopped: boolean = true;
  public isMatchInProgress: boolean = false;
  private isBeforeKickoff: boolean = true;
  private isTimeRunning: boolean = false;
  public isOvertime: boolean = false;
  private isFinishing: boolean = false;

  private lastTouchInfo: TTouchInfo | null = null;
  private touchInfoList: (TTouchInfo | null)[] = [];
  private driverIds: number[] = [];
  private toucherCountByTeam: TPlayerCountByTeam = { red: 0, blue: 0 };
  private driverCountByTeam: TPlayerCountByTeam = { red: 0, blue: 0 };
  private lastDriveInfo: null | TLastDriveInfo = null;

  private kickoffX: number | null = null;

  public lastBallPosition: IPosition = { x: 0, y: 0 };
  private isDefRec: boolean = false;

  private isTry: false | TeamEnum = false;
  public tryY: number | null = null;
  private afterTryTickCount: number = 0;

  public safetyTime: number = 0;
  public isConversionAttempt: false | TeamEnum = false;
  public isReplacingBall: boolean = false;
  public isConversionShot: boolean = false;

  private airKickerId: number | null = null;
  private ballTransitionCount: number = 0;

  constructor(room: IHaxRugbyRoom) {
    this.room = room;
    this.adminService = new AdminService(room);
    this.chatService = new ChatService(room, this);
    this.util = new GameUtil(room, this);

    this.matchConfig = getMatchConfig('x2');
    this.teams = new Teams(this.chatService);
    this.remainingTime = this.matchConfig.getTimeLimitInMs();
  }

  private sendGameInfoPeriodically(playerId: number) {
    Util.interval(MINUTE_IN_MS, () => {
      if (this.isMatchInProgress === false) {
        this.chatService.sendGameInfo(playerId);
      }
    });
  }

  private sendNewMatchHelpPeriodically(playerId: number) {
    Util.timeout(0.5 * MINUTE_IN_MS, () => {
      this.chatService.sendNewMatchHelp(false, playerId);
      Util.interval(MINUTE_IN_MS, () => {
        if (this.isMatchInProgress === false) {
          this.chatService.sendNewMatchHelp(true, playerId);
        }
      });
    });
  }

  /**
   *  ROOM EVENT HANDLERS
   */

  public handleGameTick(): void {
    if (
      this.isMatchInProgress === false ||
      (this.isTimeRunning === false && this.isConversionAttempt === false)
    ) {
      return;
    }

    const ballPosition = this.room.getBallPosition();

    if (this.isConversionAttempt === false) {
      this.tickCount = this.tickCount + 1;
      if (this.tickCount % 6 === 0) {
        this.handleTime(ballPosition);
      }
      this.handleGame(ballPosition);
    }

    if (this.isConversionAttempt) {
      this.tickCount = this.tickCount + 1;
      if (this.tickCount % 6 === 0) {
        this.handleConversionTime(this.isConversionAttempt);
      }
      this.handleConversion(ballPosition);
    }

    this.lastBallPosition = ballPosition;
  }

  public handleGameStart(byPlayer: HaxRugbyPlayer): void {
    this.isGameStopped = false;

    this.isBeforeKickoff = true;
    this.isTimeRunning = false;
    this.isFinishing = false;
    if (this.isReplacingBall === false) {
      this.lastBallPosition = { x: 0, y: 0 };
    }

    if (!this.isMatchInProgress) {
      this.initializeMatch(byPlayer);
    }

    if (this.isConversionAttempt === false && this.kickoffX) {
      this.initializeKickoff(this.kickoffX);
    }

    if (this.isConversionAttempt && this.tryY !== null && this.isReplacingBall === false) {
      this.initializeConversion(this.isConversionAttempt, this.tryY);
    }
  }

  public handleGameStop(byPlayer: HaxRugbyPlayer): void {
    this.isGameStopped = true;

    if (this.isTimeRunning) {
      this.isTimeRunning = false;
      this.chatService.sendMatchStatus();
    }
  }

  public handleGamePause(byPlayer: HaxRugbyPlayer): void {
    if (this.isMatchInProgress && this.isTimeRunning) {
      this.isTimeRunning = false;
      this.chatService.sendMatchStatus();
    }
  }

  public handleGameUnpause(byPlayer: HaxRugbyPlayer): void {
    if (this.isMatchInProgress && this.isTimeRunning === false && this.isBeforeKickoff === false) {
      this.isTimeRunning = true;
      this.chatService.sendMatchStatus();
    }
  }

  public handlePlayerJoin(player: IPlayerObject): void {
    this.adminService.setFirstPlayerAsAdmin(player.id);
    this.chatService.sendGreetingsToIncomingPlayer(player.id);
    this.sendGameInfoPeriodically(player.id);
    this.sendNewMatchHelpPeriodically(player.id);
  }

  public handlePlayerLeave(player: HaxRugbyPlayer): void {
    this.adminService.setEarliestPlayerAsAdmin();
    this.unregisterPlayerFromMatchData(player.id);
    this.teams.removePlayerFromPositions(player);
    this.teams.fillAllPositions(this.room.getPlayerList());
  }

  public handlePlayerTeamChange(player: HaxRugbyPlayer): void {
    this.teams.emptyPositionsOnPlayerTeamChange(player);

    if (this.isMatchInProgress) {
      this.teams.fillAllPositions(this.room.getPlayerList());
    }

    if (this.isConversionAttempt && this.isGameStopped === false) {
      this.room.setPlayerTeam(player.id, TeamID.Spectators);
    }
  }

  public handlePlayerBallKick(player: HaxRugbyPlayer): void {
    // actions after kickoff
    if (this.isBeforeKickoff && this.isConversionAttempt === false) {
      this.isBeforeKickoff = false;
      this.isTimeRunning = true;
      this.kickoffX = null;
      this.chatService.sendMatchStatus();
    }

    this.registerKickAsTouch(player.id);

    // do not trigger air kick if is try
    if (this.isTry) {
      return;
    }

    // set air kick
    if (
      HaxRugbyPlayerConfig.getConfig(player.id).isAirKickEnabled &&
      this.driverIds.length > 0 &&
      this.driverIds.includes(player.id)
    ) {
      this.airKickerId = player.id;
      this.ballTransitionCount = AIR_KICK_TICKS;

      // boost kick
      const isSmallMap = this.matchConfig.mapSize === MapSizeEnum.SMALL;
      const boost = isSmallMap ? SMALL_AIR_KICK_BOOST : NORMAL_AIR_KICK_BOOST;
      const ballProps = this.room.getDiscProperties(0);
      const updatedBallProps = {} as IDiscPropertiesObject;
      updatedBallProps.xspeed = boost * ballProps.xspeed;
      updatedBallProps.yspeed = boost * ballProps.yspeed;
      this.room.setDiscProperties(0, updatedBallProps);
    } else {
      this.airKickerId = null;
    }

    // inform player that their air kick is disabled
    if (
      HaxRugbyPlayerConfig.getConfig(player.id).isAirKickEnabled === false &&
      this.driverIds.length > 0 &&
      this.driverIds.includes(player.id)
    ) {
      this.chatService.sendNormalAnnouncement(
        'Seu Chute Aéreo está desativado. Use o comando `a` para ativá-lo ou desativá-lo.',
      );
    }
  }

  public handleTeamGoal(team: TeamID): void {
    // handle successful conversion
    if (this.isConversionAttempt) {
      if (team === TeamID.Spectators) {
        return;
      }

      this.isConversionAttempt = false;
      this.isConversionShot = false;
      this.tryY = null;

      Util.timeout(200, () => {
        this.room.pauseGame(true);

        let teamName: string;
        let stadium: string;
        if (team === TeamID.RedTeam) {
          this.score.red = this.score.red + 2;
          teamName = this.teams.red.name;
          stadium = this.map.blueStadiums.getKickoff();
        } else {
          this.score.blue = this.score.blue + 2;
          teamName = this.teams.blue.name;
          stadium = this.map.redStadiums.getKickoff();
        }

        // announce successful conversion
        this.chatService.sendBoldAnnouncement(`Conversão do ${teamName}!`, 2);

        this.handleRestartOrFinishing(stadium);
      });
    }
  }

  public handleStadiumChange(newStadiumName: string, byPlayer: HaxRugbyPlayer): void {
    if (newStadiumName.includes('HaxRugby') === false) {
      const lastWinner = this.getLastWinner();
      if (lastWinner === TeamEnum.BLUE) {
        this.room.setCustomStadium(this.map.blueStadiums.getKickoff());
      } else {
        this.room.setCustomStadium(this.map.redStadiums.getKickoff());
      }
    }
  }

  /**
   *  OWN METHODS
   */

  public initializeMatch(player?: HaxRugbyPlayer): void {
    this.remainingTime = this.matchConfig.getTimeLimitInMs();
    this.isMatchInProgress = true;
    this.isOvertime = false;
    this.score = { red: 0, blue: 0 };

    this.lastTouchInfo = null;
    this.touchInfoList = [];
    this.driverIds = [];
    this.driverCountByTeam = { red: 0, blue: 0 };
    this.lastDriveInfo = null;
    this.isDefRec = false;
    this.kickoffX = null;
    this.tryY = null;
    this.isTry = false;
    this.isConversionAttempt = false;
    this.ballTransitionCount = 0;
    this.airKickerId = null;
    this.room.util.toggleAerialBall(false);
    this.room.util.setBallColor(colors.ball);
    this.teams.fillAllPositions(this.room.getPlayerList());

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
    this.lastScores.unshift(this.score);

    this.room.pauseGame(true);

    const lastWinner = this.getLastWinner();
    if (!lastWinner) {
      Util.timeout(3500, () => {
        if (this.isFinishing) {
          this.room.stopGame();
        }
        this.chatService.sendNewMatchHelp();
      });
      return;
    }

    const winnerTeam = this.teams.getTeam(lastWinner);

    Util.timeout(3500, () => {
      if (this.isFinishing) {
        this.room.stopGame();
        if (lastWinner === TeamEnum.RED) {
          this.room.setCustomStadium(this.map.redStadiums.getKickoff());
        } else if (lastWinner === TeamEnum.BLUE) {
          this.room.setCustomStadium(this.map.blueStadiums.getKickoff());
        }
      }
      this.chatService.sendNewMatchHelp();
    });

    const remainingTimeString = Util.getRemainingTimeString(this.remainingTime);

    this.chatService.sendBoldAnnouncement(`Fim da partida. Vitória do ${winnerTeam.name}!`, 2);
    this.chatService.sendNormalAnnouncement(`Placar final: ${this.score.red}-${this.score.blue}`);
    if (remainingTimeString !== '00:00') {
      if (this.remainingTime > 0) {
        this.chatService.sendNormalAnnouncement(`Tempo: ${remainingTimeString} restante`);
      } else {
        this.chatService.sendNormalAnnouncement(`Tempo: ${remainingTimeString} do overtime`);
      }
    }
  }

  public cancelMatch(player: HaxRugbyPlayer, restartMatch?: () => void): void {
    this.isMatchInProgress = false;
    this.isTimeRunning = false;
    this.room.pauseGame(true);
    Util.timeout(3500, () => {
      this.room.stopGame();
      if (restartMatch) restartMatch();
    });

    this.chatService.sendBoldAnnouncement(`Partida cancelada por ${player.name}!`, 2);
    this.chatService.sendNormalAnnouncement(
      `Placar parcial:  ${this.score.red}-${this.score.blue}`,
    );
    this.chatService.sendNormalAnnouncement(
      `Tempo restante:  ${Util.getRemainingTimeString(this.remainingTime)}`,
    );
    this.chatService.sendBlankLine();
    if (restartMatch) {
      this.chatService.sendNormalAnnouncement('Iniciando nova partida em 5 segundos...');
    }
  }

  private initializeKickoff(kickoffX: number) {
    // move ball to the correct place
    const ballProps = RoomUtil.getOriginalBallProps(this.room);
    ballProps.x = kickoffX;
    this.room.setDiscProperties(0, ballProps);

    // move players to correct place
    const players = this.room.getPlayerList().filter((player) => player.team !== TeamID.Spectators);
    players.forEach((player) => {
      const updatedPlayerProps = this.room.getPlayerDiscProperties(player.id);
      if (updatedPlayerProps) {
        updatedPlayerProps.x = updatedPlayerProps.x + kickoffX;
        this.room.setPlayerDiscProperties(player.id, updatedPlayerProps);
      }
    });
  }

  private initializeConversion(kickingTeam: TeamEnum, tryY: number) {
    this.safetyTime = 0;

    // move ball to the correct place
    const updatedBallProps = this.room.getDiscProperties(0);
    updatedBallProps.x = this.map.moveDiscInXAxis(
      updatedBallProps,
      kickingTeam,
      this.map.areaLineX,
    );
    updatedBallProps.y = tryY;
    this.lastBallPosition = {
      x: updatedBallProps.x,
      y: updatedBallProps.y,
    };
    this.room.setDiscProperties(0, updatedBallProps);

    // move kicker to the correct place
    const kickerId = this.teams.getPlayerByTeamAndPosition(kickingTeam, PositionEnum.KICKER);
    if (kickerId !== null) {
      const updatedKickerProps = this.room.getPlayerDiscProperties(kickerId);
      if (updatedKickerProps) {
        updatedKickerProps.x = this.map.moveDiscInXAxis(
          updatedKickerProps,
          kickingTeam,
          this.map.areaLineX,
        );
        updatedKickerProps.y = updatedKickerProps.y + tryY;
        this.room.setPlayerDiscProperties(kickerId, updatedKickerProps);
      }
    }

    const kickingTeamID = TeamUtil.getTeamID(kickingTeam);
    const defendingTeam = TeamUtil.getOpposingTeam(kickingTeam);
    const defendingTeamID = TeamUtil.getOpposingTeamID(kickingTeam);

    // move kicking team's players to correct place
    const kickingTeamPlayers = this.room
      .getPlayerList()
      .filter((player) => player.team === kickingTeamID && player.id !== kickerId);

    kickingTeamPlayers.forEach((player) => {
      const updatedPlayerProps = this.room.getPlayerDiscProperties(player.id);
      if (updatedPlayerProps) {
        updatedPlayerProps.x = this.map.moveDiscInXAxis(
          updatedPlayerProps,
          defendingTeam,
          this.map.miniAreaX,
        );
        this.room.setPlayerDiscProperties(player.id, updatedPlayerProps);
      }
    });

    // move GK to the correct place
    const goalkeeperId = this.teams.getPlayerByTeamAndPosition(
      defendingTeam,
      PositionEnum.GOALKEEPER,
    );
    if (goalkeeperId !== null) {
      const updatedGoalkeeperProps = this.room.getPlayerDiscProperties(goalkeeperId);
      if (updatedGoalkeeperProps) {
        updatedGoalkeeperProps.x = this.map.moveDiscInXAxis(
          updatedGoalkeeperProps,
          kickingTeam,
          this.map.areaLineX,
        );
        updatedGoalkeeperProps.y = 0;
        this.room.setPlayerDiscProperties(goalkeeperId, updatedGoalkeeperProps);
      }
    }

    // move defending team's players to correct place
    const defenseBenchPlayers = this.room
      .getPlayerList()
      .filter((player) => player.team === defendingTeamID && player.id !== goalkeeperId);
    defenseBenchPlayers.forEach((player) => {
      const updatedPlayerProps = this.room.getPlayerDiscProperties(player.id);
      if (updatedPlayerProps) {
        updatedPlayerProps.x = this.map.moveDiscInXAxis(
          updatedPlayerProps,
          kickingTeam,
          this.map.areaLineX + this.map.kickoffLineX,
        );
        this.room.setPlayerDiscProperties(player.id, updatedPlayerProps);
      }
    });

    this.chatService.sendConversionHelp();
  }

  private handleTime(ballPosition: IPosition) {
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
        const canLosingTeamTieOrTurn = this.util.getCanLosingTeamTieOrTurn(ballPosition);

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

  private handleConversionTime(team: TeamEnum) {
    if (this.safetyTime === 0) {
      const teamName = this.teams.getTeamName(team);
      this.chatService.sendYellowBoldAnnouncement(
        `O ${teamName} tem ${SAFETY_MAX_TIME / 1000} segundos para cobrar.`,
        2,
      );
    }

    this.safetyTime = this.safetyTime + 1000 / 10;
    const remainingTime = SAFETY_MAX_TIME - this.safetyTime;

    if (remainingTime === 10000) {
      this.chatService.sendNormalAnnouncement('10 segundos para a cobrança!', 2);
    }
    if ([5000, 4000, 3000, 2000, 1000].includes(remainingTime)) {
      this.chatService.sendNormalAnnouncement(`${remainingTime / 1000}...`);
    }
    if (remainingTime === 0) {
      this.handleMissedConversion(true);
    }
  }

  private handleGame(ballPosition: IPosition) {
    const players = this.room.getPlayerList();

    this.checkForTouches(players, ballPosition);

    const toucherIds = Physics.getToucherIds(this.touchInfoList);
    this.handleAirKick(toucherIds);

    // register ball drivers if any
    this.driverIds = Physics.getDriverIds(this.touchInfoList);

    // count current ball drivers
    this.driverCountByTeam = this.room.util.countPlayersByTeam(this.driverIds);

    const didBallEnterOrLeaveIngoal = this.map.getDidBallEnterOrLeaveIngoal(
      ballPosition,
      this.lastBallPosition,
    );
    this.checkForDefRec(ballPosition, didBallEnterOrLeaveIngoal);

    if (this.airKickerId === null) {
      this.handleBall(ballPosition, this.isDefRec);
    }

    if (this.lastDriveInfo) {
      if (this.checkForFieldGoal(ballPosition, this.lastDriveInfo)) {
        return;
      }
    }

    // in case of try, let the scorer attempt to take the ball more to the middle
    if (this.isTry) {
      this.handleAfterTry(ballPosition, this.driverCountByTeam);
      return;
    }

    // count current ball touchers
    const lastNullableTouchInfo = this.touchInfoList[0];
    if (lastNullableTouchInfo) {
      this.toucherCountByTeam = this.room.util.countPlayersByTeam(lastNullableTouchInfo.toucherIds);
    } else {
      this.toucherCountByTeam = { red: 0, blue: 0 };
    }

    if (this.isDefRec === false) {
      const isTryOnGoalLine = this.map.getIsTryOnGoalLine(
        didBallEnterOrLeaveIngoal,
        ballPosition,
        this.driverCountByTeam,
      );
      if (isTryOnGoalLine === false) {
        if (this.checkForSafety(ballPosition)) {
          if (ballPosition.x < 0) {
            this.room.util.setBallColor(colors.ballRed);
          } else {
            this.room.util.setBallColor(colors.ballBlue);
          }
          return;
        }
      }
    }

    if (this.checkForTry(ballPosition)) {
      return;
    }

    this.chatService.announceDefRec(
      didBallEnterOrLeaveIngoal,
      this.isDefRec,
      this.airKickerId !== null,
    );

    //
    // hard fix ball if broken by air kick
    //
    // TODO: find the root cause and fix it
    //
    // const isBallAerial = this.room.util.getIsAerialBall();
    // if (isBallAerial && this.airKickerId === null) {
    //   this.room.util.toggleAerialBall(false);
    // }
  }

  private checkForTouches(players: HaxRugbyPlayer[], ballPosition: IPosition) {
    const newTouchInfo = Physics.getTouchInfoList(
      players,
      ballPosition,
      this.room.util.getIsAerialBall(),
    );
    if (newTouchInfo) {
      this.lastTouchInfo = newTouchInfo;
    }

    this.touchInfoList.unshift(newTouchInfo);
    if (this.touchInfoList.length > DRIVE_MIN_TICKS) {
      this.touchInfoList.pop();
    }
  }

  private handleAirKick(toucherIds: number[]) {
    // decrement tick counter
    if (this.airKickerId && this.ballTransitionCount > 0) {
      this.ballTransitionCount = this.ballTransitionCount - 1;
    }

    // catch blocks during block phase
    if (
      this.airKickerId &&
      this.ballTransitionCount > AIR_KICK_BLOCK_TICKS &&
      toucherIds.length > 0
    ) {
      // console.log('passed 1: catch blocks during block phase');
      this.chatService.announceBlockedAirKick(this.airKickerId, toucherIds[0]);
      this.airKickerId = null;
    }

    // toggle aerial ball after block phase
    if (
      this.airKickerId &&
      this.ballTransitionCount === AIR_KICK_BLOCK_TICKS &&
      toucherIds.length === 0
    ) {
      // console.log('passed 2: toggle aerial ball after block phase');
      this.room.util.toggleAerialBall(true);
    }

    // treat ball transformation delay to avoid bug
    if (
      this.airKickerId &&
      this.ballTransitionCount < AIR_KICK_BLOCK_TICKS &&
      this.ballTransitionCount > AIR_KICK_BLOCK_TICKS - 15 &&
      toucherIds.length > 0
    ) {
      // console.log('passed 3: treat ball transformation delay to avoid bug');
      this.chatService.announceBlockedAirKick(this.airKickerId, toucherIds[0]);
      this.airKickerId = null;
      this.room.util.toggleAerialBall(false);
    }

    // set air ball color & announce successful air kick
    if (
      this.airKickerId &&
      this.ballTransitionCount === AIR_KICK_BLOCK_TICKS - 15 &&
      toucherIds.length === 0
    ) {
      // console.log('passed 4: set air ball color & announce successful air kick');
      this.chatService.announceSuccessfulAirKick(this.airKickerId);
      if (this.isDefRec === false) {
        this.room.util.setBallColor(colors.airBall);
      }
    }

    // set def rec air ball color
    if (this.airKickerId && this.isDefRec) {
      // console.log('passed 5: set def rec air ball color');
      this.room.util.setBallColor(colors.defRecAirBall);
    }

    // toggle off aerial ball
    if (this.airKickerId && this.ballTransitionCount === 0) {
      // console.log('passed 6: toggle off aerial ball');
      this.airKickerId = null;
      this.room.util.toggleAerialBall(false);
      const ballColor = this.room.getDiscProperties(0).color;
      if (this.isDefRec === false && ballColor === colors.airBall) {
        this.room.util.setBallColor(colors.ball);
      }
    }
  }

  private checkForFieldGoal(ballPosition: IPosition, lastDriveInfo: TLastDriveInfo): boolean {
    if (this.airKickerId === null) {
      return false;
    }
    const airKickerTeam = this.room.getPlayer(this.airKickerId).team;

    const isGoal = this.map.getIsFieldGoal(
      ballPosition,
      this.room.getDiscProperties(0).xspeed,
      lastDriveInfo,
      airKickerTeam,
    );

    if (isGoal) {
      this.isTimeRunning = false;
      this.room.pauseGame(true);
      let teamName: string;
      let stadium: string;

      if (isGoal === TeamEnum.RED) {
        this.score.red = this.score.red + 3;
        teamName = this.teams.red.name;
        stadium = this.map.blueStadiums.getKickoff();
      } else {
        this.score.blue = this.score.blue + 3;
        teamName = this.teams.blue.name;
        stadium = this.map.redStadiums.getKickoff();
      }

      // announce goal
      this.chatService.sendBoldAnnouncement(`Drop Goal do ${teamName}!`, 2);

      this.handleRestartOrFinishing(stadium);
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
    const lastTeamThatTouchedBall = this.room.util.getTeamThatTouchedBall(this.lastTouchInfo);
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
    isSafety = this.map.getIsSafety(ballPosition, this.driverCountByTeam);

    // check for safety on goal post
    if (isSafety === false) {
      isSafety = this.map.getIsSafetyOnGoalPost(ballPosition, this.toucherCountByTeam);
    }

    if (isSafety) {
      this.isTimeRunning = false;
      this.room.pauseGame(true);
      let teamName: string;
      let stadium: string;

      let kickoffX = this.lastDriveInfo ? this.lastDriveInfo.ballPosition.x : 0;
      if (kickoffX < -this.map.areaLineX) {
        kickoffX = -this.map.areaLineX;
      } else if (kickoffX > this.map.areaLineX) {
        kickoffX = this.map.areaLineX;
      }
      this.kickoffX = kickoffX;

      if (isSafety === TeamEnum.RED) {
        teamName = this.teams.red.name;
        stadium = this.map.redStadiums.getKickoff(kickoffX);
      } else {
        teamName = this.teams.blue.name;
        stadium = this.map.blueStadiums.getKickoff(kickoffX);
      }

      // announce safety
      this.chatService.sendBoldAnnouncement(`Safety do ${teamName}!`, 2);

      this.handleRestartOrFinishing(stadium);
      return true;
    }
    return false;
  }

  private checkForTry(ballPosition: IPosition): boolean {
    let isTry: false | TeamEnum = false;

    // check for try on in-goal
    isTry = this.map.getIsTry(ballPosition, this.driverCountByTeam);

    // check for try on goal post
    if (isTry === false) {
      isTry = this.map.getIsTryOnGoalPost(ballPosition, this.toucherCountByTeam);
    }

    if (isTry) {
      this.isTry = isTry;
      this.tryY = ballPosition.y;
      let teamName: string;

      if (isTry === TeamEnum.RED) {
        this.score.red = this.score.red + 5;
        teamName = this.teams.red.name;
      } else {
        this.score.blue = this.score.blue + 5;
        teamName = this.teams.blue.name;
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

  private handleAfterTry(ballPosition: IPosition, driverCountByTeam: TPlayerCountByTeam) {
    if (this.isTry === false || this.tryY === null) {
      return;
    }

    let isStillAttempting: boolean = true;

    if (Math.abs(ballPosition.x) < this.map.tryLineX) {
      // finish attempt when ball is moved out of the in-goal
      isStillAttempting = false;
    }

    const teamTouchingBall = this.room.util.getTeamThatTouchedBall(this.touchInfoList[0]);

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

      let stadium: string;
      if (this.isTry === TeamEnum.RED) {
        stadium = this.map.redStadiums.getConversion({
          ballX: this.map.areaLineX,
          tryY: this.tryY,
        });
      } else {
        stadium = this.map.blueStadiums.getConversion({
          ballX: -this.map.areaLineX,
          tryY: this.tryY,
        });
      }

      this.handleRestartOrFinishing(stadium, () => {
        this.isConversionAttempt = this.isTry;
        this.isTry = false;
      });
    }
  }

  private handleBall(ballPosition: IPosition, isDefRec: boolean) {
    if (this.driverCountByTeam.red && ballPosition.x > -this.map.tryLineX) {
      this.lastDriveInfo = {
        ballPosition,
        team: TeamEnum.RED,
      };

      // change ball color to team's
      this.ballTransitionCount = BALL_TEAM_COLOR_TICKS;
      this.room.util.setBallColor(colors.ballRed);
    } else if (this.driverCountByTeam.blue && ballPosition.x < this.map.tryLineX) {
      this.lastDriveInfo = {
        ballPosition,
        team: TeamEnum.BLUE,
      };

      // change ball color to team's
      this.ballTransitionCount = BALL_TEAM_COLOR_TICKS;
      this.room.util.setBallColor(colors.ballBlue);
    }

    if (this.lastDriveInfo && this.ballTransitionCount > 0 && isDefRec === false) {
      // transition ball color to original
      this.ballTransitionCount = this.ballTransitionCount - 1;
      const color = Util.transitionBallColor(
        this.lastDriveInfo.team,
        this.ballTransitionCount,
        BALL_TEAM_COLOR_TICKS,
      );
      if (color) {
        this.room.util.setBallColor(color);
      }
    } else if (isDefRec && this.isTry === false) {
      const ballColor = this.room.getDiscProperties(0).color;
      if (ballColor !== colors.defRecBall) {
        this.room.util.setBallColor(colors.defRecBall);
      }
    }
  }

  private handleConversion(ballPosition: IPosition) {
    // handle after shot
    if (
      this.isConversionShot === false &&
      this.isReplacingBall === false &&
      ballPosition.x !== this.lastBallPosition.x &&
      ballPosition.y !== this.lastBallPosition.y
    ) {
      this.isConversionShot = true;

      Util.timeout(2500, () => {
        this.handleMissedConversion();
      });
    }

    // check missed conversion
    const isMissedConversion = this.map.getIsMissedConversion(
      ballPosition,
      this.room.getDiscProperties(0).xspeed,
    );
    if (isMissedConversion) {
      this.handleMissedConversion();
    }
  }

  // TODO: improve state logic (here and in other related parts too)
  private handleMissedConversion(timeout: boolean = false) {
    const isStillConversionAttempt = this.isConversionAttempt;
    this.isConversionShot = false;

    if (isStillConversionAttempt) {
      this.room.pauseGame(true);
      this.isConversionAttempt = false;
      this.tryY = null;

      const teamName = this.teams.getTeamName(isStillConversionAttempt);
      let stadium: string;

      if (isStillConversionAttempt === TeamEnum.RED) {
        stadium = this.map.blueStadiums.getKickoff();
      } else {
        stadium = this.map.redStadiums.getKickoff();
      }

      // announce missed conversion
      if (timeout === false) {
        this.chatService.sendBoldAnnouncement(`O ${teamName} errou a conversão!`, 2);
      } else {
        this.chatService.sendBoldAnnouncement(`Acabou o tempo para a cobrança do ${teamName}!`, 2);
      }

      this.handleRestartOrFinishing(stadium);
    }
  }

  private handleRestartOrFinishing(map: string, handleGameStop?: () => void) {
    if (this.util.getIsMatchFinished(this.score.red, this.score.blue, this.isTry) === false) {
      this.restartGame(map, handleGameStop);
    } else {
      this.finishMatch();
    }
  }

  private restartGame(map: string, handleGameStop?: () => void) {
    // won't pass here if is safety kick
    if (this.kickoffX === null && this.lastDriveInfo) {
      this.lastDriveInfo = {
        ...this.lastDriveInfo,
        ballPosition: { x: 0, y: 0 },
      };
    }

    this.chatService.sendMatchStatus();

    Util.timeout(3000, () => {
      this.driverIds = [];
      this.driverCountByTeam = { red: 0, blue: 0 };
      this.isDefRec = false;
      this.ballTransitionCount = 0;
      this.airKickerId = null;
      this.room.util.toggleAerialBall(false);
      this.room.util.setBallColor(colors.ball);

      this.room.stopGame();
      this.room.setCustomStadium(map);
      if (handleGameStop) handleGameStop();
      this.room.startGame();
    });
  }

  public getLastWinner(): TeamEnum | null | 0 {
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

  // TODO: Consider concurrence, that is, if 2 or more players are kicking the ball simultaneously.
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
