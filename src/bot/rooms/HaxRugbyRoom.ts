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
import GameService from '../services/room/GameService';
import { IGameService } from '../services/room/IGameService';
import smallStadium from '../singletons/smallStadium';
import Util from '../util/Util';

export interface IHaxRugbyRoom extends IRoom<HaxRugbyPlayer> {
  gameService: IGameService;
}

export class HaxRugbyRoom extends RoomBase<HaxRugbyPlayer> implements IHaxRugbyRoom {
  public gameService: IGameService = new GameService(this);

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
      const playerTotal = this.getPlayerList().length;
      Util.logMessageWithTime(
        `${player.name} (ID: ${player.id}) entrou na sala. Total: ${playerTotal}`,
      );

      this.gameService.handlePlayerJoin(player);
    });

    this.onPlayerLeave.addHandler((player) => {
      const playerTotal = this.getPlayerList().length;
      Util.logMessageWithTime(
        `${Util.getPlayerNameAndId(player)} saiu da sala. Total: ${playerTotal}`,
      );

      this.gameService.handlePlayerLeave(player);
    });

    this.onPlayerTeamChange.addHandler((player) => {
      this.gameService.handlePlayerTeamChange(player);
    });

    this.onPlayerBallKick.addHandler((player) => {
      this.gameService.handlePlayerBallKick(player);
    });

    this.onPlayerKicked.addHandler((player, reason, ban, byPlayer) => {
      if (reason === '!bb') {
        return;
      }

      const playerNameAndId: string = Util.getPlayerNameAndId(player);
      const byPlayerNameAndId: string = Util.getPlayerNameAndId(byPlayer);

      if (ban === false) {
        if (byPlayer.id > 0) {
          Util.logMessageWithTime(`${playerNameAndId} foi kickado por ${byPlayerNameAndId}).`);
        } else {
          Util.logMessageWithTime(`${playerNameAndId} foi kickado pelo bot.`);
        }
      } else {
        if (byPlayer.id > 0) {
          Util.logMessageWithTime(`${playerNameAndId} foi banido por ${byPlayerNameAndId}).`);
        } else {
          Util.logMessageWithTime(`${playerNameAndId} foi banido pelo bot.`);
        }
      }

      if (reason) {
        console.log(`    Motivo: ${reason}.`);
      }
    });

    this.onTeamGoal.addHandler((team) => {
      this.gameService.handleTeamGoal(team);
    });

    this.initializeRoom();
  }

  private initializeRoom() {
    this.setCustomStadium(smallStadium.redMaps.kickoff);
    this.setTeamsLock(true);
    this.setTimeLimit(this.gameService.matchConfig.timeLimit);
    this.setScoreLimit(this.gameService.matchConfig.scoreLimit);

    this.setKickRateLimit(KICK_RATE_LIMIT[0], KICK_RATE_LIMIT[1], KICK_RATE_LIMIT[2]);
  }
}
