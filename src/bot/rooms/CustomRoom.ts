import { inject } from 'inversify';
import {
  IChatMessageInterceptorFactoryType,
  IChatMessageParser,
  IPlayerService,
  IRoomConfigObject,
  RoomBase,
  Types,
} from 'inversihax';
import { HaxRugbyPlayer } from '../models/player/HaxRugbyPlayer';
import { ICustomRoom } from './ICustomRoom';

export class CustomRoom extends RoomBase<HaxRugbyPlayer> implements ICustomRoom {
  private mIsGameInProgress: boolean = false;

  public get isGameInProgress(): boolean {
    return this.mIsGameInProgress;
  }

  public constructor(
    @inject(Types.IRoomConfigObject) roomConfig: IRoomConfigObject,
    @inject(Types.IPlayerService) playerService: IPlayerService<HaxRugbyPlayer>,
    @inject(Types.IChatMessageInterceptorFactory)
    chatMessageInterceptorFactory: IChatMessageInterceptorFactoryType,
    @inject(Types.IChatMessageParser) chatMessageParser: IChatMessageParser,
  ) {
    super(roomConfig, playerService, chatMessageInterceptorFactory, chatMessageParser);

    this.onGameStart.addHandler((byPlayer) => (this.mIsGameInProgress = true));
    this.onGameStop.addHandler((byPlayer) => (this.mIsGameInProgress = false));
    this.onGamePause.addHandler((byPlayer) => (this.mIsGameInProgress = false));
    this.onGameUnpause.addHandler((byPlayer) => (this.mIsGameInProgress = true));
    this.onPlayerJoin.addHandler((player) => this.setPlayerAdmin(player.id, true));
  }
}
