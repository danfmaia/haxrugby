import { inject } from 'inversify';
import { IChatMessageParser, IPlayerService, IRoomConfigObject, RoomBase, Types } from 'inversihax';
import { IChatMessageInterceptorFactoryType } from 'inversihax/lib/Core/Utility/Types';

import { CustomPlayer } from '../models/CustomPlayer';
import MatchConfig from '../models/match/MatchConfig';

import { MINUTE_IN_MS } from '../constants/general';
import smallConfig from '../constants/config/smallConfig';
import Util from '../util/Util';
import SmallStadium from '../models/stadium/SmallStadium';
import smallStadium from '../stadiums/smallStadium';
import Physics from '../util/Physics';
import TouchInfo from '../models/physics/TouchInfo';
import { MSG_GREETING_1, MSG_GREETING_2 } from '../constants/dictionary';
import { IHaxRugbyRoom } from './IHaxRugbyRoom';
import RoomService, { IHaxRugbyRoomService } from '../services/room/HaxRugbyRoomService';
import HaxRugbyRoomMessager, { IHaxRugbyRoomMessager } from '../services/room/HaxRugbyRoomMessager';
import HaxRugbyRoomService from '../services/room/HaxRugbyRoomService';

export class HaxRugbyRoom extends RoomBase<CustomPlayer> implements IHaxRugbyRoom {
  private _roomMessager: IHaxRugbyRoomMessager = new HaxRugbyRoomMessager(this);
  private _roomService: IHaxRugbyRoomService = new HaxRugbyRoomService(this);

  private _stadium: SmallStadium = smallStadium;
  private _matchConfig: MatchConfig = smallConfig;

  private _tickCount: number = 0;
  private _remainingTime: number = this._matchConfig.getTimeLimitInMs();
  private _scoreA: number = 0;
  private _scoreB: number = 0;

  private _isMatchInProgress: boolean = false;
  private _isBeforeKickoff: boolean = true;
  private _isTimeRunning: boolean = false;
  private _isOvertime: boolean = false;

  private _lastTouchInfo: TouchInfo | null = null;

  public get stadium(): SmallStadium {
    return this._stadium;
  }

  public get matchConfig(): MatchConfig {
    return this._matchConfig;
  }

  public get remainingTime(): number {
    return this._remainingTime;
  }
  public set remainingTime(value: number) {
    this._remainingTime = value;
  }

  public get scoreA(): number {
    return this._scoreA;
  }
  public set scoreA(value: number) {
    this._scoreA = value;
  }

  public get scoreB(): number {
    return this._scoreB;
  }
  public set scoreB(value: number) {
    this._scoreB = value;
  }

  public get isMatchInProgress(): boolean {
    return this._isMatchInProgress;
  }

  public get isTimeRunning(): boolean {
    return this._isTimeRunning;
  }

  public get isOvertime(): boolean {
    return this._isOvertime;
  }

  public get lastTouchInfo(): TouchInfo | null {
    return this._lastTouchInfo;
  }

  public constructor(
    @inject(Types.IRoomConfigObject) roomConfig: IRoomConfigObject,
    @inject(Types.IPlayerService) playerService: IPlayerService<CustomPlayer>,
    @inject(Types.IChatMessageInterceptorFactory)
    chatMessageInterceptorFactory: IChatMessageInterceptorFactoryType,
    @inject(Types.IChatMessageParser) chatMessageParser: IChatMessageParser,
  ) {
    super(roomConfig, playerService, chatMessageInterceptorFactory, chatMessageParser);

    this.onGameTick.addHandler(() => {
      // check for time events and send announcements
      this._tickCount = this._tickCount + 1;
      if (this._tickCount % 6 === 0) {
        this.checkForTimeEvents();
      }

      // check for scoring
      if (this._isTimeRunning) {
        const players = this.getPlayerList();
        const ballPosition = this.getBallPosition();

        const lastTouchInfos = Physics.getTouchPositionAndPlayers(players, ballPosition);
        if (lastTouchInfos.length) {
          this._lastTouchInfo = lastTouchInfos[0];
        }

        // if (this._lastTouchInfo.length) {
        // this.sendChat(
        //   // prettier-ignore
        //   `${this.getPlayer(this._lastPlayerIdThatTouchedBall).name} tocou na bola!`
        // );
        // }

        this._roomService.checkForGoal(this);
      }
    });

    this.onGameStart.addHandler((byPlayer) => {
      this._isBeforeKickoff = true;
      this._isTimeRunning = false;
      if (!this._isMatchInProgress) {
        this.initializeMatch(byPlayer);
      }
    });

    this.onGameStop.addHandler((byPlayer) => {
      if (this._isTimeRunning) {
        this._isTimeRunning = false;
        this._roomMessager.sendMatchStatus(2);
      }
    });

    this.onGamePause.addHandler((byPlayer) => {
      if (this._isMatchInProgress && this._isTimeRunning) {
        this._isTimeRunning = false;
        this._roomMessager.sendMatchStatus(2);
      }
    });

    this.onGameUnpause.addHandler((byPlayer) => {
      if (
        this._isMatchInProgress &&
        this._isTimeRunning === false &&
        this._isBeforeKickoff === false
      ) {
        this._isTimeRunning = true;
        this._roomMessager.sendMatchStatus(2);
      }
    });

    this.onPlayerJoin.addHandler((player) => {
      if (this.getPlayerList().length === 2) {
        this.setPlayerAdmin(player.id, true);
      }
      this._roomMessager.sendBoldAnnouncement(MSG_GREETING_1, 2, player.id);
      this._roomMessager.sendNormalAnnouncement(MSG_GREETING_2, 0, player.id);
      if (this._isMatchInProgress) {
        this._roomMessager.sendMatchStatus(0, player.id);
      }
      Util.timeout(10000, () => {
        this._roomMessager.sendPromotionLinks(player.id);
      });
    });

    this.onPlayerBallKick.addHandler((player) => {
      if (this._isBeforeKickoff) {
        this._isBeforeKickoff = false;
        this._isTimeRunning = true;
      }

      // report that this player touched the ball
      const ballPosition = this.getBallPosition();
      const touchPosition = Physics.getTouchPosition(player.position, ballPosition);
      this._lastTouchInfo = {
        playerId: player.id,
        touchPosition: touchPosition,
        ballPosition: ballPosition,
      };
      // this.sendChat(
      //   // prettier-ignore
      //   `${this.getPlayer(this._lastPlayerIdThatTouchedBall).name} tocou na bola!`
      // );
    });

    this.initializeRoom();
  }

  private initializeRoom() {
    this.setCustomStadium(this._stadium._map_A);
    this.setTeamsLock(true);
    this.setTimeLimit(this._matchConfig.timeLimit);
    this.setScoreLimit(this._matchConfig.scoreLimit);
  }

  public initializeMatch(player?: CustomPlayer) {
    this._remainingTime = this._matchConfig.getTimeLimitInMs();
    this._isMatchInProgress = true;
    this._isOvertime = false;
    this._scoreA = 0;
    this._scoreB = 0;
    this.startGame();

    if (player) {
      this._roomMessager.sendBoldAnnouncement(`${player.name} iniciou uma nova partida!`, 2);
    } else {
      this._roomMessager.sendBoldAnnouncement('Iniciando nova partida!', 2);
    }
    this._roomMessager.sendNormalAnnouncement(Util.getDurationString(this._matchConfig.timeLimit));
    this._roomMessager.sendNormalAnnouncement(`Limite de pontos:  ${this._matchConfig.scoreLimit}`);
  }

  private finalizeMatch() {
    this._isMatchInProgress = false;
    this._isTimeRunning = false;
    this.pauseGame(true);
    Util.timeout(5000, () => this.stopGame());

    this._roomMessager.sendBoldAnnouncement('Fim da partida!', 2);
    this._roomMessager.sendNormalAnnouncement(`Placar final: ${this._scoreA}-${this._scoreB}`);
  }

  public cancelMatch(player: CustomPlayer, callback: () => void) {
    this._isMatchInProgress = false;
    this._isTimeRunning = false;
    this.pauseGame(true);
    Util.timeout(3500, () => {
      this.stopGame();
      callback();
    });

    this._roomMessager.sendBoldAnnouncement(`Partida cancelada por ${player.name}!`, 2);
    this._roomMessager.sendNormalAnnouncement(
      `Tempo restante:  ${Util.getRemainingTimeString(this.remainingTime)}`,
    );
    this._roomMessager.sendNormalAnnouncement(`Placar parcial:  ${this._scoreA}-${this._scoreB}`);
    this._roomMessager.sendNormalAnnouncement('');
    this._roomMessager.sendNormalAnnouncement('Iniciando nova partida em 5 segundos...');
  }

  private checkForTimeEvents() {
    if (this._isTimeRunning) {
      this._remainingTime = this._remainingTime - 1000 / 10;
    }

    if (
      (this._remainingTime < this._matchConfig.getTimeLimitInMs() &&
        this._remainingTime > 0 &&
        this._remainingTime % MINUTE_IN_MS === 0) ||
      this._remainingTime === MINUTE_IN_MS / 2 ||
      this._remainingTime === MINUTE_IN_MS / 4
    ) {
      this._roomMessager.sendMatchStatus(2);
    }

    if (this._remainingTime === this._matchConfig.getTimeLimitInMs() - 5000) {
      this._roomMessager.sendPromotionLinks();
    }

    if ([5000, 4000, 3000, 2000, 1000].includes(this._remainingTime)) {
      this._roomMessager.sendNormalAnnouncement(`${this._remainingTime / 1000}...`, 2);
    }

    if (this._isMatchInProgress && this._remainingTime <= 0) {
      if (this._scoreA !== this._scoreB) {
        const ballPosition = this.getBallPosition();
        const canLosingTeamTieOrTurn =
          (this._scoreA - this._scoreB <= 7 && ballPosition.x < -this._stadium.kickoffLineX) ||
          (this._scoreB - this._scoreA <= 7 && ballPosition.x > this._stadium.kickoffLineX);

        if (canLosingTeamTieOrTurn === false) {
          this.finalizeMatch();
        } else if (this._isOvertime === false) {
          this.reportBallPositionOvertime();
        }
      } else if (this._isOvertime === false) {
        this.reportRegularOvertime();
      }
    }
  }
}
