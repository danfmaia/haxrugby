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

import { CustomPlayer } from '../models/player/CustomPlayer';
import GameService from '../services/room/GameService';
import { IGameService } from '../services/room/IGameService';
import smallStadium from '../singletons/smallStadium';

export interface IHaxRugbyRoom extends IRoom<CustomPlayer> {
  gameService: IGameService;
}

export class HaxRugbyRoom extends RoomBase<CustomPlayer> implements IHaxRugbyRoom {
  public gameService: IGameService = new GameService(this);

  public constructor(
    @inject(Types.IRoomConfigObject) roomConfig: IRoomConfigObject,
    @inject(Types.IPlayerService) playerService: IPlayerService<CustomPlayer>,
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
      this.gameService.handlePlayerJoin(player);
    });

    this.onPlayerLeave.addHandler((player) => {
      this.gameService.handlePlayerLeave(player);
    });

    this.onPlayerBallKick.addHandler((player) => {
      this.gameService.handlePlayerBallKick(player);
    });

    this.onPlayerTeamChange.addHandler((player) => {
      this.gameService.handlePlayerTeamChange(player);
    });

    this.initializeRoom();
  }

  private initializeRoom() {
    this.setCustomStadium(smallStadium.redMaps.kickoff);
    this.setTeamsLock(true);
    this.setTimeLimit(this.gameService.matchConfig.timeLimit);
    this.setScoreLimit(this.gameService.matchConfig.scoreLimit);
  }
}
