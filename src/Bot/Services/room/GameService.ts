import { IPlayerObject, IPosition } from 'inversihax';

import smallConfig from '../../singletons/smallConfig';
import { MINUTE_IN_MS } from '../../constants/general';
import TeamEnum from '../../enums/TeamEnum';
import { CustomPlayer } from '../../models/CustomPlayer';
import MatchConfig from '../../models/match/MatchConfig';
import { IScore } from '../../models/match/Score';
import ITouchInfo from '../../models/physics/ITouchInfo';
import SmallStadium from '../../models/stadium/SmallStadium';
import { IHaxRugbyRoom } from '../../rooms/HaxRugbyRoom';
import smallStadium from '../../singletons/smallStadium';
import Physics from '../../util/Physics';
import Util from '../../util/Util';
import { IGameService } from './IGameService';
import AdminService, { IAdminService } from './RoomAdmin';
import ChatService, { IChatService } from './RoomMessager';
import { RoomUtil } from '../../util/RoomUtil';

export default class GameService implements IGameService {
  private room: IHaxRugbyRoom;
  private adminService: IAdminService;
  private chatService: IChatService;
  private roomUtil: RoomUtil;

  private stadium: SmallStadium = smallStadium;
  public matchConfig: MatchConfig = smallConfig;

  private tickCount: number = 0;
  public remainingTime: number = this.matchConfig.getTimeLimitInMs();
  public score: IScore = { a: 0, b: 0 };
  private lastScores: IScore[] = [];

  public isMatchInProgress: boolean = false;
  private isBeforeKickoff: boolean = true;
  private isTimeRunning: boolean = false;
  public isOvertime: boolean = false;
  private isFinalizing: boolean = false;

  private lastTouchInfo: ITouchInfo | null = null;
  public touchInfoList: (ITouchInfo | null)[] = [];
  private driverIds: number[] = [];

  constructor(room: IHaxRugbyRoom) {
    this.room = room;
    this.adminService = new AdminService(room);
    this.chatService = new ChatService(room, this);
    this.roomUtil = new RoomUtil(room);
  }

  /**
   *  ROOM EVENT HANDLERS
   */

  public handleGameTick() {
    this.tickCount = this.tickCount + 1;
    if (this.tickCount % 6 === 0) {
      this.checkForTimeEvents();
    }

    if (this.isTimeRunning) {
      this.checkForGameEvents();
    }
  }

  public handleGameStart(byPlayer: CustomPlayer) {
    this.isBeforeKickoff = true;
    this.isTimeRunning = false;
    this.isFinalizing = false;
    if (!this.isMatchInProgress) {
      this.initializeMatch(byPlayer);
    }
  }

  public handleGameStop(byPlayer: CustomPlayer) {
    if (this.isTimeRunning) {
      this.isTimeRunning = false;
      this.chatService.sendMatchStatus(2);
    }
  }

  public handleGamePause(byPlayer: CustomPlayer) {
    if (this.isMatchInProgress && this.isTimeRunning) {
      this.isTimeRunning = false;
      this.chatService.sendMatchStatus(2);
    }
  }

  public handleGameUnpause(byPlayer: CustomPlayer) {
    if (this.isMatchInProgress && this.isTimeRunning === false && this.isBeforeKickoff === false) {
      this.isTimeRunning = true;
      this.chatService.sendMatchStatus(2);
    }
  }

  public handlePlayerJoin(player: IPlayerObject) {
    this.adminService.setFirstPlayerAsAdmin(player.id);
    this.chatService.sendGreetingsToIncomingPlayer(player.id);
  }

  public handlePlayerLeave(player: CustomPlayer) {
    this.adminService.setEarliestPlayerAsAdmin();
  }

  public handlePlayerBallKick(player: CustomPlayer) {
    // run time after kickoff
    if (this.isBeforeKickoff) {
      this.isBeforeKickoff = false;
      this.isTimeRunning = true;
    }

    this.registerKickAsTouch(player.id);
  }

  public handlePlayerTeamChange(player: CustomPlayer) {
    // pin host at top of spectators list
    if (player.id === 0) {
      this.room.setPlayerTeam(0, 0);
      this.room.reorderPlayers([0], true);
    }
  }

  /**
   *  OWN METHODS
   */

  public initializeMatch(player?: CustomPlayer) {
    this.remainingTime = this.matchConfig.getTimeLimitInMs();
    this.isMatchInProgress = true;
    this.isOvertime = false;
    this.score = { a: 0, b: 0 };

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

  public finalizeMatch() {
    this.isMatchInProgress = false;
    this.isTimeRunning = false;
    this.isFinalizing = true;
    this.room.pauseGame(true);
    this.lastScores.unshift(this.score);
    Util.timeout(5000, () => {
      if (this.isFinalizing) {
        this.room.stopGame();
        const lastWinner = this.getLastWinner();
        if (lastWinner === TeamEnum.RED) {
          this.room.setCustomStadium(this.stadium.map_A);
        } else if (lastWinner === TeamEnum.BLUE) {
          this.room.setCustomStadium(this.stadium.map_B);
        }
      }
    });

    this.chatService.sendBoldAnnouncement('Fim da partida!', 2);
    this.chatService.sendNormalAnnouncement(`Placar final: ${this.score.a}-${this.score.b}`);
  }

  public cancelMatch(player: CustomPlayer, callback: () => void) {
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
    this.chatService.sendNormalAnnouncement(`Placar parcial:  ${this.score.a}-${this.score.b}`);
    this.chatService.sendNormalAnnouncement('');
    this.chatService.sendNormalAnnouncement('Iniciando nova partida em 5 segundos...');
  }

  public checkForTimeEvents() {
    if (this.isTimeRunning) {
      this.remainingTime = this.remainingTime - 1000 / 10;
    }

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
      this.chatService.sendPromotionLinks();
    }

    if ([5000, 4000, 3000, 2000, 1000].includes(this.remainingTime)) {
      this.chatService.sendNormalAnnouncement(`${this.remainingTime / 1000}...`, 2);
    }

    if (this.isMatchInProgress && this.remainingTime <= 0) {
      if (this.score.a !== this.score.b) {
        const ballPosition = this.room.getBallPosition();
        const canLosingTeamTieOrTurn =
          (this.score.a - this.score.b <= 7 && ballPosition.x < -this.stadium.kickoffLineX) ||
          (this.score.b - this.score.a <= 7 && ballPosition.x > this.stadium.kickoffLineX);

        if (canLosingTeamTieOrTurn === false) {
          this.finalizeMatch();
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

  public checkForGameEvents() {
    const players = this.room.getPlayerList();
    const ballPosition = this.room.getBallPosition();

    const newTouchInfo = Physics.getTouchInfoList(players, ballPosition);
    this.registerTouchInfo(newTouchInfo);

    this.checkForGoal(ballPosition);

    this.driverIds = Physics.getDriverIds(this.touchInfoList);
    if (this.driverIds.length) {
      // this.room.sendChat('driverIds: ' + this.driverIds.toString());
      this.checkForTry(ballPosition);
    }
  }

  private checkForGoal(ballPosition: IPosition) {
    if (this.lastTouchInfo === null) {
      return;
    }

    const isGoal = this.stadium.getIsGoal(
      ballPosition,
      this.room.getDiscProperties(0).xspeed,
      this.lastTouchInfo.ballPosition,
    );

    if (isGoal) {
      this.isTimeRunning = false;
      let teamName: string;
      let map: string;

      if (isGoal === TeamEnum.RED) {
        this.score.a = this.score.a + 3;
        teamName = this.matchConfig.teamA.name;
        map = this.stadium.map_B;
      } else {
        this.score.b = this.score.b + 3;
        teamName = this.matchConfig.teamB.name;
        map = this.stadium.map_A;
      }

      // send announcements and restart game
      this.chatService.sendBoldAnnouncement(`Gol do ${teamName}!`, 2);
      this.chatService.sendMatchStatus();
      Util.timeout(3000, () => {
        this.room.stopGame();
        this.room.setCustomStadium(map);
        this.room.startGame();
      });
    }
  }

  private checkForTry(ballPosition: IPosition) {
    const playerCountByTeam = this.roomUtil.countPlayersByTeam(this.driverIds);

    const isTry = this.stadium.getIsTry(ballPosition, playerCountByTeam);

    if (isTry) {
      this.isTimeRunning = false;
      let teamName: string;
      let map: string;

      if (isTry === TeamEnum.RED) {
        this.score.a = this.score.a + 5;
        teamName = this.matchConfig.teamA.name;
        map = this.stadium.map_B;
      } else {
        this.score.b = this.score.b + 5;
        teamName = this.matchConfig.teamB.name;
        map = this.stadium.map_A;
      }

      // send announcements and restart game
      this.chatService.sendBoldAnnouncement(`Try do ${teamName}!`, 2);
      this.chatService.sendMatchStatus();
      Util.timeout(3000, () => {
        this.room.stopGame();
        this.room.setCustomStadium(map);
        this.room.startGame();
      });
    }
  }

  private getLastWinner(): TeamEnum | null | 0 {
    const lastScore = this.lastScores[0];
    if (!lastScore) {
      return null;
    }
    if (lastScore.a > lastScore.b) {
      return TeamEnum.RED;
    } else if (lastScore.a < lastScore.b) {
      return TeamEnum.BLUE;
    }
    return 0;
  }

  public registerKickAsTouch(playerId: number) {
    const ballPosition = this.room.getBallPosition();

    let updatedToucherIds = this.lastTouchInfo ? this.lastTouchInfo.toucherIds : [];
    updatedToucherIds.push(playerId);

    this.registerTouchInfo({
      toucherIds: updatedToucherIds,
      ballPosition: ballPosition,
      hasKick: true,
    });
  }

  private registerTouchInfo(newTouchInfo: ITouchInfo | null) {
    this.touchInfoList.unshift(newTouchInfo);
    if (this.touchInfoList.length > 20) {
      this.touchInfoList.pop();
    }
  }
}
