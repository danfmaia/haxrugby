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
import SmallStadium from '../models/stadium/SmallStadium';
import smallStadium from '../stadiums/smallStadium';
import ITouchInfo from '../models/physics/ITouchInfo';
import RoomGame, { IRoomGame } from '../services/room/RoomGame';
import RoomMessager, { IRoomMessager } from '../services/room/RoomMessager';
import RoomAdmin, { IRoomAdmin } from '../services/room/RoomAdmin';
import { IScore } from '../models/match/Score';

export interface IHaxRugbyRoom extends IRoom<CustomPlayer> {
  stadium: SmallStadium;
  matchConfig: MatchConfig;

  remainingTime: number;
  score: IScore;
  lastScores: IScore[];

  isMatchInProgress: boolean;
  isTimeRunning: boolean;
  isOvertime: boolean;
  isFinalizing: boolean;

  lastTouchInfoList: ITouchInfo[];
}

export class HaxRugbyRoom extends RoomBase<CustomPlayer> implements IHaxRugbyRoom {
  private roomGame: IRoomGame = new RoomGame(this);
  private roomAdmin: IRoomAdmin = new RoomAdmin(this);
  private roomMessager: IRoomMessager = new RoomMessager(this);

  public stadium: SmallStadium = smallStadium;
  public matchConfig: MatchConfig = smallConfig;

  private tickCount: number = 0;
  public remainingTime: number = this.matchConfig.getTimeLimitInMs();
  public score: IScore = { a: 0, b: 0 };
  public lastScores: IScore[] = [];

  public isMatchInProgress: boolean = false;
  private isBeforeKickoff: boolean = true;
  public isTimeRunning: boolean = false;
  public isOvertime: boolean = false;
  public isFinalizing: boolean = false;

  public lastTouchInfoList: ITouchInfo[] = [];

  public constructor(
    @inject(Types.IRoomConfigObject) roomConfig: IRoomConfigObject,
    @inject(Types.IPlayerService) playerService: IPlayerService<CustomPlayer>,
    @inject(Types.IChatMessageInterceptorFactory)
    chatMessageInterceptorFactory: IChatMessageInterceptorFactoryType,
    @inject(Types.IChatMessageParser) chatMessageParser: IChatMessageParser,
  ) {
    super(roomConfig, playerService, chatMessageInterceptorFactory, chatMessageParser);

    this.onGameTick.addHandler(() => {
      this.tickCount = this.tickCount + 1;
      if (this.tickCount % 6 === 0) {
        this.roomGame.checkForTimeEvents();
      }

      if (this.isTimeRunning) {
        this.roomGame.checkForScoring();
      }
    });

    this.onGameStart.addHandler((byPlayer) => {
      this.isBeforeKickoff = true;
      this.isTimeRunning = false;
      this.isFinalizing = false;
      if (!this.isMatchInProgress) {
        this.roomGame.initializeMatch(byPlayer);
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
      this.roomAdmin.setFirstPlayerAsAdmin(player.id);
      this.roomMessager.sendGreetingsToIncomingPlayer(player.id);
    });

    this.onPlayerLeave.addHandler((player) => {
      this.roomAdmin.setEarliestPlayerAsAdmin();
    });

    this.onPlayerBallKick.addHandler((player) => {
      // run time after kickoff
      if (this.isBeforeKickoff) {
        this.isBeforeKickoff = false;
        this.isTimeRunning = true;
      }

      this.roomGame.registerKickAsTouch(player.id);
    });

    this.onPlayerTeamChange.addHandler((player) => {
      // pin host at top of spectators list
      if (player.id === 0) {
        this.setPlayerTeam(0, 0);
        this.reorderPlayers([0], true);
      }
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
