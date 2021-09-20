import { inject } from 'inversify';
import {
  IChatMessageParser,
  IPlayerService,
  IPosition,
  IRoomConfigObject,
  RoomBase,
  Types
} from 'inversihax';
import { IChatMessageInterceptorFactoryType } from 'inversihax/lib/Core/Utility/Types';
import * as moment from 'moment';

import { ISmallHaxRURoom } from './ISmallHaxRURoom';

import { CustomPlayer } from '../models/CustomPlayer';
import MatchConfig from '../models/match/MatchConfig';

import { MINUTE_IN_MS } from '../constants/general';
import smallConfig from '../constants/config/smallConfig';
import styles from '../constants/styles';
import Util from '../util/Util';
import SmallStadium from '../models/stadium/SmallStadium';
import smallStadium from '../stadiums/smallStadium';
import TeamEnum from '../enums/TeamEnum';
import Physics from '../util/Physics';
import TouchInfo from '../models/physics/TouchInfo';

export class SmallHaxRURoom
  extends RoomBase<CustomPlayer>
  implements ISmallHaxRURoom
{
  private _stadium: SmallStadium = smallStadium;
  private _matchConfig: MatchConfig = smallConfig;

  private _tickCount: number = 0;
  private _remainingTime: number;
  private _scoreA: number = 0;
  private _scoreB: number = 0;

  private _isMatchInProgress: boolean = false;
  private _isBeforeKickoff: boolean = true;
  private _isTimeRunning: boolean = false;

  private _lastTouchInfo: TouchInfo;
  private _lastBallXSpeedWhenTouched: number;

  // private _lastPlayerIdThatTouchedBall: number;
  // private _lastTouchPosition: IPosition;
  // private _lastBallPositionWhenTouched: IPosition;

  public get matchConfig(): MatchConfig {
    return this._matchConfig;
  }
  public get isMatchInProgress(): boolean {
    return this._isMatchInProgress;
  }

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
      // check for time events and send announcements
      this._tickCount = this._tickCount + 1;
      if (this._tickCount % 6 === 0) {
        this.checkForTimeEvents();
      }

      // check for scoring
      if (this._isTimeRunning) {
        const players = this.getPlayerList();
        const ballPosition = this.getBallPosition();

        const lastTouchInfos = Physics.getTouchPositionAndPlayers(
          players,
          ballPosition
        );
        if (lastTouchInfos.length) {
          this._lastTouchInfo = lastTouchInfos[0];
          this._lastBallXSpeedWhenTouched = this.getDiscProperties(0).xspeed;
        }

        // if (this._lastTouchInfo.length) {
        // this.sendChat(
        //   // prettier-ignore
        //   `${this.getPlayer(this._lastPlayerIdThatTouchedBall).name} tocou na bola!`
        // );
        // }

        // check for goal
        if (this._lastTouchInfo) {
          this.checkForGoal();
        }
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
        this.sendStatus();
      }
    });

    this.onGamePause.addHandler((byPlayer) => {
      if (this._isMatchInProgress && this._isTimeRunning) {
        this._isTimeRunning = false;
        this.sendStatus();
      }
    });

    this.onGameUnpause.addHandler((byPlayer) => {
      if (this._isMatchInProgress && !this._isTimeRunning) {
        this._isTimeRunning = true;
        this.sendStatus();
      }
    });

    this.onPlayerJoin.addHandler((player) => {
      if (this.getPlayerList().length === 2) {
        this.setPlayerAdmin(player.id, true);
      }
      this.sendBoldAnnouncement(
        'Bem vindo(a) ao HaxBall Rugby Union (HaxRU)!',
        player.id
      );
      if (this._isMatchInProgress) {
        this.sendStatus(player.id);
      }
    });

    this.onPlayerBallKick.addHandler((player) => {
      if (this._isBeforeKickoff) {
        this._isBeforeKickoff = false;
        this._isTimeRunning = true;
      }

      // inform that this player touched the ball
      const ballPosition = this.getBallPosition();
      const touchPosition = Physics.getTouchPosition(
        player.position,
        ballPosition
      );
      this._lastTouchInfo = {
        playerId: player.id,
        touchPosition: touchPosition,
        ballPosition: ballPosition
      };
      this._lastBallXSpeedWhenTouched = this.getDiscProperties(0).xspeed;
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

  private getRemainingTimeString(): string {
    const remaniningTime = moment.duration(this._remainingTime);
    return moment.utc(remaniningTime.as('milliseconds')).format('mm:ss');
  }

  private sendStatus(playerId?: number) {
    this.sendBoldAnnouncement(
      // prettier-ignore
      `Placar e Tempo restante: ${this._scoreA}-${this._scoreB} | ${this.getRemainingTimeString()}`,
      playerId
    );
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
    this.sendNormalAnnouncement('    discord.io/HaxRU', null, 0);

    this.sendBoldAnnouncement('Grupo no FACEBOOK:', null, 0);
    this.sendNormalAnnouncement('    fb.com/groups/rugbyu', null, 0);
  }

  public initializeMatch(player?: CustomPlayer) {
    this._remainingTime = this._matchConfig.getTimeLimitInMs();
    this._isMatchInProgress = true;
    this.startGame();

    if (player) {
      this.sendBoldAnnouncement(`${player.name} iniciou uma nova partida!`);
    } else {
      this.sendBoldAnnouncement('Iniciando nova partida!');
    }
    this.sendNormalAnnouncement(
      `Duração:  ${this._matchConfig.timeLimit} minutos`
    );
    this.sendNormalAnnouncement(
      `Limite de pontos:  ${this._matchConfig.scoreLimit}`
    );
  }

  private finalizeMatch() {
    this._isMatchInProgress = false;
    this._isTimeRunning = false;
    this.pauseGame(true);
    Util.timeout(5000, () => this.stopGame());

    this.sendBoldAnnouncement('Fim da partida!');
    this.sendNormalAnnouncement(
      `Placar final: ${this._scoreA}-${this._scoreB}`
    );
  }

  public cancelMatch(player: CustomPlayer, callback: () => void) {
    this._isMatchInProgress = false;
    this._isTimeRunning = false;
    this.pauseGame(true);
    Util.timeout(3500, () => {
      this.stopGame();
      callback();
    });

    this.sendBoldAnnouncement(`Partida cancelada por ${player.name}!`);
    this.sendNormalAnnouncement(
      `Tempo restante:  ${this.getRemainingTimeString()}`
    );
    this.sendNormalAnnouncement(
      `Placar parcial:  ${this._scoreA}-${this._scoreB}`
    );
    this.sendNormalAnnouncement('', null, 0);
    this.sendNormalAnnouncement(`Iniciando nova partida em 5 segundos...`);
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
      this.sendStatus();
    }

    if (this._remainingTime === this._matchConfig.getTimeLimitInMs() - 5000) {
      this.sendPromotionLinks();
    }

    if ([5000, 4000, 3000, 2000, 1000].includes(this._remainingTime)) {
      this.sendNormalAnnouncement(`${this._remainingTime / 1000}...`);
    }

    if (this._remainingTime <= 0 && this._isMatchInProgress) {
      this.finalizeMatch();
    }
  }

  private checkForGoal() {
    let isGoal: false | TeamEnum = false;
    isGoal = this._stadium.getIsGoal(
      this.getBallPosition(),
      this.getDiscProperties(0).xspeed,
      this._lastTouchInfo.ballPosition
    );

    if (isGoal) {
      this._isTimeRunning = false;
      let teamName: string;
      let map: string;

      if (isGoal === TeamEnum.TEAM_A) {
        this._scoreA = this._scoreA + 3;
        teamName = this._matchConfig.teamA.name;
        map = this._stadium._map_B;
      } else if (isGoal === TeamEnum.TEAM_B) {
        this._scoreB = this._scoreB + 3;
        teamName = this._matchConfig.teamB.name;
        map = this._stadium._map_A;
      }

      // send announcements and restart game
      this.sendBoldAnnouncement(`Gol do ${teamName}!`);
      this.sendStatus();

      Util.timeout(3000, () => {
        this.stopGame();
        this.setCustomStadium(map);
        this.startGame();
      });
    }
  }
}
