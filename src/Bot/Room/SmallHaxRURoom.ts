import { inject } from 'inversify';
import {
  IChatMessageParser,
  IPlayerService,
  IRoomConfigObject,
  RoomBase,
  Types
} from 'inversihax';
import { IChatMessageInterceptorFactoryType } from 'inversihax/lib/Core/Utility/Types';
import * as moment from 'moment';

import { ISmallHaxRURoom } from './ISmallHaxRURoom';

import { MINUTE_IN_MS } from '../constants/general';
import { smallConfig } from '../constants/config/smallConfig';

import { CustomPlayer } from '../models/CustomPlayer';
import { MatchConfig } from '../models/match/MatchConfig';

import { stadium_red } from '../stadiums/small/stadium_red';
import { styles } from '../constants/styles';

const matchConfig: MatchConfig = smallConfig;

export class SmallHaxRURoom
  extends RoomBase<CustomPlayer>
  implements ISmallHaxRURoom
{
  public tickCount: number = 0;
  public remainingTime: number = matchConfig.TIME_LIMIT_IN_MS;

  public isMatchInProgress: boolean = false;
  // public isAfterKickoff: boolean = false;
  public isTimeRunning: boolean = false;

  public redScore: number = 0;
  public blueScore: number = 0;

  // public get isGameInProgress(): boolean {
  //   return this.mIsGameInProgress;
  // }

  public constructor(
    @inject(Types.IRoomConfigObject) roomConfig: IRoomConfigObject,
    @inject(Types.IPlayerService) PlayerService: IPlayerService<CustomPlayer>,
    @inject(Types.IChatMessageInterceptorFactory)
    chatMessageInterceptorFactory: IChatMessageInterceptorFactoryType,
    @inject(Types.IChatMessageParser) chatMessageParser: IChatMessageParser
  ) {
    super(
      roomConfig,
      PlayerService,
      chatMessageInterceptorFactory,
      chatMessageParser
    );

    this.onGameTick.addHandler(() => {
      this.tickCount = this.tickCount + 1;

      if (this.tickCount % 6 === 0) {
        if (this.isTimeRunning) {
          this.remainingTime = this.remainingTime - 1000 / 10;
        }

        if (
          (this.remainingTime < matchConfig.TIME_LIMIT_IN_MS &&
            this.remainingTime > 0 &&
            this.remainingTime % MINUTE_IN_MS === 0) ||
          this.remainingTime === MINUTE_IN_MS / 2 ||
          this.remainingTime === MINUTE_IN_MS / 4
        ) {
          this.sendStatus();
        }

        if (this.remainingTime === matchConfig.TIME_LIMIT_IN_MS - 5000) {
          this.sendPromotionLinks();
        }

        if ([5000, 4000, 3000, 2000, 1000].includes(this.remainingTime)) {
          this.sendNormalAnnouncement(`${this.remainingTime / 1000}...`);
        }

        if (this.remainingTime <= 0 && this.isMatchInProgress) {
          this.finalizeMatch();
        }
      }
    });

    this.onGameStart.addHandler((byPlayer) => {
      this.isTimeRunning = false;
      if (!this.isMatchInProgress) {
        this.initializeMatch();
      }
    });

    this.onGameStop.addHandler((byPlayer) => {
      if (this.isTimeRunning) {
        this.isTimeRunning = false;
        this.sendStatus();
      }
    });

    this.onGamePause.addHandler((byPlayer) => {
      if (this.isMatchInProgress && this.isTimeRunning) {
        this.isTimeRunning = false;
        this.sendStatus();
      }
    });

    this.onGameUnpause.addHandler((byPlayer) => {
      if (this.isMatchInProgress && !this.isTimeRunning) {
        this.isTimeRunning = true;
        this.sendStatus();
      }
    });

    this.onPlayerJoin.addHandler((player) => {
      if (this.getPlayerList().length === 2) {
        this.setPlayerAdmin(player.id, true);
      }
      this.sendBoldAnnouncement(
        'Bem vindo(a) ao HaxBall Rugby Union (HaxRU®)!',
        player.id
      );
      this.sendStatus(player.id);
    });

    this.onPlayerBallKick.addHandler((player) => {
      if (!this.isTimeRunning) {
        this.isTimeRunning = true;
      }
    });

    this.setCustomStadium(stadium_red);
    this.setTeamsLock(true);
    this.setTimeLimit(matchConfig.TIME_LIMIT);
    this.setScoreLimit(matchConfig.SCORE_LIMIT);
  }

  private getRemainingTimeString(): string {
    const remaniningTime = moment.duration(this.remainingTime);
    return moment.utc(remaniningTime.as('milliseconds')).format('mm:ss');
  }

  private sendStatus(playerId?: number) {
    this.sendBoldAnnouncement(
      // prettier-ignore
      `Placar e Tempo restante: ${this.redScore}-${this.blueScore} | ${this.getRemainingTimeString()}`,
      playerId
    );

    // this.sendChat(
    //   `Tempo restante >> ${this.getRemainingTimeString()}`,
    //   playerId
    // );
    // this.sendChat(`Placar >> ${this.redScore}-${this.blueScore}`, playerId);
  }

  private sendNormalAnnouncement(
    message: string,
    playerId?: number,
    sound: number = 2
  ) {
    this.sendAnnouncement(message, playerId, styles.haxruGreen, null, sound);
  }

  private sendBoldAnnouncement(
    message: string,
    playerId?: number,
    sound: number = 2
  ) {
    this.sendAnnouncement(message, playerId, styles.haxruGreen, 'bold', sound);
  }

  private sendPromotionLinks() {
    this.sendBoldAnnouncement('Regras do jogo:');
    this.sendNormalAnnouncement(
      '    sites.google.com/site/haxrugby/regras-completas',
      null,
      0
    );

    this.sendBoldAnnouncement('Server no DISCORD:', null, 0);
    this.sendNormalAnnouncement('    https://discord.gg/amVeAMyh', null, 0);

    this.sendBoldAnnouncement('Grupo no FACEBOOK:', null, 0);
    this.sendNormalAnnouncement('    fb.com/groups/rugbyu', null, 0);
  }

  private initializeMatch() {
    this.remainingTime = matchConfig.TIME_LIMIT_IN_MS;
    this.isMatchInProgress = true;

    this.sendBoldAnnouncement('Início da partida!');
    this.sendNormalAnnouncement(
      `Esta partida irá até ${matchConfig.TIME_LIMIT} minutos ou ${matchConfig.SCORE_LIMIT} pontos.`
    );
  }

  private finalizeMatch() {
    this.isMatchInProgress = false;
    this.isTimeRunning = false;
    this.pauseGame(true);
    const timeoutToStop = setTimeout(() => {
      this.stopGame();
      clearTimeout(timeoutToStop);
    }, 5000);

    this.sendBoldAnnouncement('Fim da partida!');
    this.sendNormalAnnouncement(
      `Placar final: ${this.redScore}-${this.blueScore}`
    );
  }
}
