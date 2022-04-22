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

import { KICK_RATE_LIMIT } from '../constants/constants';
import { HaxRugbyPlayer } from '../models/player/HaxRugbyPlayer';
import AdminService, { IAdminService } from '../services/room/AdminService';
import GameService from '../services/room/GameService';
import { IGameService } from '../services/room/IGameService';
import smallMap from '../singletons/smallMap';
import { RoomUtil } from '../util/RoomUtil';

export interface IHaxRugbyRoom extends IRoom<HaxRugbyPlayer> {
  gameService: IGameService;
  adminService: IAdminService;
  util: RoomUtil;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  CollisionFlags: any;
}

export class HaxRugbyRoom extends RoomBase<HaxRugbyPlayer> implements IHaxRugbyRoom {
  public gameService: IGameService = new GameService(this);
  public adminService: IAdminService = new AdminService(this);
  public util: RoomUtil = new RoomUtil(this);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public CollisionFlags: any;

  public constructor(
    @inject(Types.IRoomConfigObject) roomConfig: IRoomConfigObject,
    @inject(Types.IPlayerService) playerService: IPlayerService<HaxRugbyPlayer>,
    @inject(Types.IChatMessageInterceptorFactory)
    chatMessageInterceptorFactory: IChatMessageInterceptorFactoryType,
    @inject(Types.IChatMessageParser) chatMessageParser: IChatMessageParser,
  ) {
    super(roomConfig, playerService, chatMessageInterceptorFactory, chatMessageParser);

    this.onGameTick.addHandler(() => {
      this.gameService.handleGameTick();
    });

    this.onGameStart.addHandler((byPlayer) => {
      this.gameService.handleGameStart(byPlayer);
    });

    this.onGameStop.addHandler((byPlayer) => {
      this.gameService.handleGameStop(byPlayer);
    });

    this.onGamePause.addHandler((byPlayer) => {
      this.gameService.handleGamePause(byPlayer);
    });

    this.onGameUnpause.addHandler((byPlayer) => {
      this.gameService.handleGameUnpause(byPlayer);
    });

    this.onPlayerJoin.addHandler((player) => {
      this.adminService.handlePlayerJoin(player);
      this.gameService.handlePlayerJoin(player);
    });

    this.onPlayerLeave.addHandler((player) => {
      this.adminService.handlePlayerLeave(player);
      this.gameService.handlePlayerLeave(player);
    });

    this.onPlayerTeamChange.addHandler((player) => {
      this.gameService.handlePlayerTeamChange(player);
    });

    this.onPlayerBallKick.addHandler((player) => {
      this.gameService.handlePlayerBallKick(player);
    });

    this.onPlayerKicked.addHandler((player, reason, ban, byPlayer) => {
      this.adminService.handlePlayerKicked(player, reason, ban, byPlayer);
    });

    this.onTeamGoal.addHandler((team) => {
      this.gameService.handleTeamGoal(team);
    });

    this.onStadiumChange.addHandler((newStadiumName, byPlayer) => {
      this.gameService.handleStadiumChange(newStadiumName, byPlayer);
    });

    this.initializeRoom();
  }

  private initializeRoom() {
    this.gameService.stadium = smallMap.redStadiums.getKickoff(
      this.gameService.tickCount,
      this.gameService.matchConfig.timeLimit,
    );
    this.setCustomStadium(this.gameService.stadium);
    this.setTeamsLock(true);
    this.setTimeLimit(this.gameService.matchConfig.timeLimit);
    this.setScoreLimit(this.gameService.matchConfig.scoreLimit);

    this.setKickRateLimit(KICK_RATE_LIMIT[0], KICK_RATE_LIMIT[1], KICK_RATE_LIMIT[2]);

    this.gameService.util.resetTeams();
  }
}
