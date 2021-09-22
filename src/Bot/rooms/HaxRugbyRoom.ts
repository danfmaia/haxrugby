import { inject } from 'inversify';
import { IChatMessageParser, IPlayerService, IRoomConfigObject, RoomBase, Types } from 'inversihax';
import { IChatMessageInterceptorFactoryType } from 'inversihax/lib/Core/Utility/Types';

import { CustomPlayer } from '../models/CustomPlayer';
import MatchConfig from '../models/match/MatchConfig';

import smallConfig from '../constants/config/smallConfig';
import Util from '../util/Util';
import SmallStadium from '../models/stadium/SmallStadium';
import smallStadium from '../stadiums/smallStadium';
import Physics from '../util/Physics';
import TouchInfo from '../models/physics/TouchInfo';
import { MSG_GREETING_1, MSG_GREETING_2 } from '../constants/dictionary';
import { IHaxRugbyRoom } from './IHaxRugbyRoom';
import { IHaxRugbyRoomService } from '../services/room/HaxRugbyRoomService';
import HaxRugbyRoomMessager, { IHaxRugbyRoomMessager } from '../services/room/HaxRugbyRoomMessager';
import HaxRugbyRoomService from '../services/room/HaxRugbyRoomService';

export class HaxRugbyRoom extends RoomBase<CustomPlayer> implements IHaxRugbyRoom {
  private _roomService: IHaxRugbyRoomService = new HaxRugbyRoomService(this);
  private _roomMessager: IHaxRugbyRoomMessager = new HaxRugbyRoomMessager(this);

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
  public set stadium(value: SmallStadium) {
    this._stadium = value;
  }

  public get matchConfig(): MatchConfig {
    return this._matchConfig;
  }
  public set matchConfig(value: MatchConfig) {
    this._matchConfig = value;
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
  public set isMatchInProgress(value: boolean) {
    this._isMatchInProgress = value;
  }

  public get isTimeRunning(): boolean {
    return this._isTimeRunning;
  }
  public set isTimeRunning(value: boolean) {
    this._isTimeRunning = value;
  }

  public get isOvertime(): boolean {
    return this._isOvertime;
  }
  public set isOvertime(value: boolean) {
    this._isOvertime = value;
  }

  public get lastTouchInfo(): TouchInfo | null {
    return this._lastTouchInfo;
  }
  public set lastTouchInfo(value: TouchInfo | null) {
    this._lastTouchInfo = value;
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
        this._roomService.checkForTimeEvents();
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

        this._roomService.checkForGoal();
      }
    });

    this.onGameStart.addHandler((byPlayer) => {
      this._isBeforeKickoff = true;
      this._isTimeRunning = false;
      if (!this._isMatchInProgress) {
        this._roomService.initializeMatch(byPlayer);
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
    this.setCustomStadium(this._stadium.map_A);
    this.setTeamsLock(true);
    this.setTimeLimit(this._matchConfig.timeLimit);
    this.setScoreLimit(this._matchConfig.scoreLimit);
  }
}
