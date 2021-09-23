import { inject } from 'inversify';
import {
  IChatMessageParser,
  IPlayerService,
  IRoom,
  IRoomConfigObject,
  RoomBase,
  Types,
} from 'inversihax';
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
import HaxRugbyRoomService, { IHaxRugbyRoomService } from '../services/room/HaxRugbyRoomService';
import HaxRugbyRoomMessager, { IHaxRugbyRoomMessager } from '../services/room/HaxRugbyRoomMessager';

export interface IHaxRugbyRoom extends IRoom<CustomPlayer> {
  stadium: SmallStadium;
  matchConfig: MatchConfig;

  remainingTime: number;
  scoreA: number;
  scoreB: number;

  isMatchInProgress: boolean;
  isTimeRunning: boolean;
  isOvertime: boolean;

  lastTouchInfo: TouchInfo | null;
}

export class HaxRugbyRoom extends RoomBase<CustomPlayer> implements IHaxRugbyRoom {
  private roomService: IHaxRugbyRoomService = new HaxRugbyRoomService(this);
  private roomMessager: IHaxRugbyRoomMessager = new HaxRugbyRoomMessager(this);

  public stadium: SmallStadium = smallStadium;
  public matchConfig: MatchConfig = smallConfig;

  private tickCount: number = 0;
  public remainingTime: number = this.matchConfig.getTimeLimitInMs();
  public scoreA: number = 0;
  public scoreB: number = 0;

  public isMatchInProgress: boolean = false;
  private isBeforeKickoff: boolean = true;
  public isTimeRunning: boolean = false;
  public isOvertime: boolean = false;

  public lastTouchInfo: TouchInfo | null = null;

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
      this.tickCount = this.tickCount + 1;
      if (this.tickCount % 6 === 0) {
        this.roomService.checkForTimeEvents();
      }

      // check for scoring
      if (this.isTimeRunning) {
        const players = this.getPlayerList();
        const ballPosition = this.getBallPosition();

        const lastTouchInfos = Physics.getTouchPositionAndPlayers(players, ballPosition);
        if (lastTouchInfos.length) {
          this.lastTouchInfo = lastTouchInfos[0];
        }

        // if (this._lastTouchInfo.length) {
        // this.sendChat(
        //   // prettier-ignore
        //   `${this.getPlayer(this._lastPlayerIdThatTouchedBall).name} tocou na bola!`
        // );
        // }

        this.roomService.checkForGoal();
      }
    });

    this.onGameStart.addHandler((byPlayer) => {
      this.isBeforeKickoff = true;
      this.isTimeRunning = false;
      if (!this.isMatchInProgress) {
        this.roomService.initializeMatch(byPlayer);
      }
    });

    this.onGameStop.addHandler((byPlayer) => {
      if (this.isTimeRunning) {
        this.isTimeRunning = false;
        this.roomMessager.sendMatchStatus(2);
      }
    });

    this.onGamePause.addHandler((byPlayer) => {
      if (this.isMatchInProgress && this.isTimeRunning) {
        this.isTimeRunning = false;
        this.roomMessager.sendMatchStatus(2);
      }
    });

    this.onGameUnpause.addHandler((byPlayer) => {
      if (
        this.isMatchInProgress &&
        this.isTimeRunning === false &&
        this.isBeforeKickoff === false
      ) {
        this.isTimeRunning = true;
        this.roomMessager.sendMatchStatus(2);
      }
    });

    this.onPlayerJoin.addHandler((player) => {
      if (this.getPlayerList().length === 2) {
        this.setPlayerAdmin(player.id, true);
      }
      this.roomMessager.sendBoldAnnouncement(MSG_GREETING_1, 2, player.id);
      this.roomMessager.sendNormalAnnouncement(MSG_GREETING_2, 0, player.id);
      if (this.isMatchInProgress) {
        this.roomMessager.sendMatchStatus(0, player.id);
      }
      Util.timeout(10000, () => {
        this.roomMessager.sendPromotionLinks(player.id);
      });
    });

    this.onPlayerBallKick.addHandler((player) => {
      if (this.isBeforeKickoff) {
        this.isBeforeKickoff = false;
        this.isTimeRunning = true;
      }

      // report that this player touched the ball
      const ballPosition = this.getBallPosition();
      const touchPosition = Physics.getTouchPosition(player.position, ballPosition);
      this.lastTouchInfo = {
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
    this.setCustomStadium(this.stadium.map_A);
    this.setTeamsLock(true);
    this.setTimeLimit(this.matchConfig.timeLimit);
    this.setScoreLimit(this.matchConfig.scoreLimit);
  }
}
