import { inject } from 'inversify';
import { IChatMessageParser, IPlayerService, IRoomConfigObject, RoomBase, Types } from 'inversihax';
import { IChatMessageInterceptorFactoryType } from 'inversihax/lib/Core/Utility/Types';
import * as moment from 'moment';

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
import { MSG_GREETING_1, MSG_GREETING_2 } from '../constants/dictionary';
import { ISmallHaxRURoom } from './ISmallHaxRURoom';

export class SmallHaxRURoom extends RoomBase<CustomPlayer> implements ISmallHaxRURoom {
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

  public get matchConfig(): MatchConfig {
    return this._matchConfig;
  }
  public set matchConfig(value: MatchConfig) {
    this._matchConfig = value;
  }

  public get isMatchInProgress(): boolean {
    return this._isMatchInProgress;
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

        // check for goal
        this.checkForGoal();
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
        this.sendMatchStatus(2);
      }
    });

    this.onGamePause.addHandler((byPlayer) => {
      if (this._isMatchInProgress && this._isTimeRunning) {
        this._isTimeRunning = false;
        this.sendMatchStatus(2);
      }
    });

    this.onGameUnpause.addHandler((byPlayer) => {
      if (
        this._isMatchInProgress &&
        this._isTimeRunning === false &&
        this._isBeforeKickoff === false
      ) {
        this._isTimeRunning = true;
        this.sendMatchStatus(2);
      }
    });

    this.onPlayerJoin.addHandler((player) => {
      if (this.getPlayerList().length === 2) {
        this.setPlayerAdmin(player.id, true);
      }
      this.sendBoldAnnouncement(MSG_GREETING_1, 2, player.id);
      this.sendNormalAnnouncement(MSG_GREETING_2, 0, player.id);
      if (this._isMatchInProgress) {
        this.sendMatchStatus(0, player.id);
      }
      Util.timeout(10000, () => {
        this.sendPromotionLinks(player.id);
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

  private getRemainingTimeString(): string {
    const remaniningTime = moment.duration(Math.abs(this._remainingTime));
    return moment.utc(remaniningTime.as('milliseconds')).format('mm:ss');
  }

  private sendNormalAnnouncement(message: string, sound: number = 0, playerId?: number) {
    this.sendAnnouncement(message, playerId, styles.haxruGreen, undefined, sound);
  }

  private sendBoldAnnouncement(message: string, sound: number = 0, playerId?: number) {
    this.sendAnnouncement(message, playerId, styles.haxruGreen, 'bold', sound);
  }

  private sendMatchStatus(sound: number = 0, playerId?: number) {
    let timeString: string;
    if (this._isOvertime === false) {
      timeString = this.getRemainingTimeString();
    } else {
      timeString = `${this.getRemainingTimeString()} do overtime`;
    }

    this.sendBoldAnnouncement(
      // prettier-ignore
      `Placar e Tempo restante: ${this._scoreA}-${this._scoreB} | ${timeString}`,
      sound,
      playerId,
    );
  }

  private sendPromotionLinks(playerId?: number) {
    this.sendBoldAnnouncement('Regras do jogo:', 2, playerId);
    this.sendNormalAnnouncement('    sites.google.com/site/haxrugby/regras-completas', 0, playerId);

    this.sendBoldAnnouncement('Server no DISCORD:', 0, playerId);
    this.sendNormalAnnouncement('    discord.io/HaxRU', 0, playerId);

    this.sendBoldAnnouncement('Grupo no FACEBOOK:', 0, playerId);
    this.sendNormalAnnouncement('    fb.com/groups/rugbyu', 0, playerId);
  }

  public initializeMatch(player?: CustomPlayer) {
    this._remainingTime = this._matchConfig.getTimeLimitInMs();
    this._isMatchInProgress = true;
    this._isOvertime = false;
    this._scoreA = 0;
    this._scoreB = 0;
    this.startGame();

    if (player) {
      this.sendBoldAnnouncement(`${player.name} iniciou uma nova partida!`, 2);
    } else {
      this.sendBoldAnnouncement('Iniciando nova partida!', 2);
    }
    this.sendNormalAnnouncement(Util.getDurationString(this._matchConfig.timeLimit));
    this.sendNormalAnnouncement(`Limite de pontos:  ${this._matchConfig.scoreLimit}`);
  }

  private finalizeMatch() {
    this._isMatchInProgress = false;
    this._isTimeRunning = false;
    this.pauseGame(true);
    Util.timeout(5000, () => this.stopGame());

    this.sendBoldAnnouncement('Fim da partida!', 2);
    this.sendNormalAnnouncement(`Placar final: ${this._scoreA}-${this._scoreB}`);
  }

  private reportRegularOvertime() {
    this._isOvertime = true;

    this.sendBoldAnnouncement('OVERTIME!', 2);
    this.sendNormalAnnouncement('O primeiro time que pontuar ganha!');
    this.sendMatchStatus();
  }

  private reportBallPositionOvertime() {
    this._isOvertime = true;

    this.sendBoldAnnouncement('OVERTIME!', 2);
    this.sendNormalAnnouncement(
      'O jogo não termina enquanto o time perdedor estiver no ataque e ainda puder empatar ou virar o jogo!',
    );
    this.sendNormalAnnouncement(
      'No ataque, para efeito de regra, significa à frente da linha de kickoff do campo adversário.',
    );
    this.sendMatchStatus();
  }

  public cancelMatch(player: CustomPlayer, callback: () => void) {
    this._isMatchInProgress = false;
    this._isTimeRunning = false;
    this.pauseGame(true);
    Util.timeout(3500, () => {
      this.stopGame();
      callback();
    });

    this.sendBoldAnnouncement(`Partida cancelada por ${player.name}!`, 2);
    this.sendNormalAnnouncement(`Tempo restante:  ${this.getRemainingTimeString()}`);
    this.sendNormalAnnouncement(`Placar parcial:  ${this._scoreA}-${this._scoreB}`);
    this.sendNormalAnnouncement('');
    this.sendNormalAnnouncement('Iniciando nova partida em 5 segundos...');
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
      this.sendMatchStatus(2);
    }

    if (this._remainingTime === this._matchConfig.getTimeLimitInMs() - 5000) {
      this.sendPromotionLinks();
    }

    if ([5000, 4000, 3000, 2000, 1000].includes(this._remainingTime)) {
      this.sendNormalAnnouncement(`${this._remainingTime / 1000}...`, 2);
    }

    if (this._isMatchInProgress && this._remainingTime <= 0) {
      if (this._scoreA !== this._scoreB) {
        const ballPosition = this.getBallPosition();
        const canLosingTeamTieOrTurn =
          (this._scoreA > this._scoreB && ballPosition.x < -this._stadium.kickoffLineX) ||
          (this._scoreA < this._scoreB && ballPosition.x > this._stadium.kickoffLineX);

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

  private checkForGoal() {
    if (!this._lastTouchInfo) {
      return;
    }

    let isGoal: false | TeamEnum = false;
    isGoal = this._stadium.getIsGoal(
      this.getBallPosition(),
      this.getDiscProperties(0).xspeed,
      this._lastTouchInfo.ballPosition,
    );

    if (isGoal) {
      this._isTimeRunning = false;
      let teamName: string;
      let map: string;

      if (isGoal === TeamEnum.TEAM_A) {
        this._scoreA = this._scoreA + 3;
        teamName = this._matchConfig.teamA.name;
        map = this._stadium._map_B;
      } else {
        this._scoreB = this._scoreB + 3;
        teamName = this._matchConfig.teamB.name;
        map = this._stadium._map_A;
      }

      // send announcements and restart game
      this.sendBoldAnnouncement(`Gol do ${teamName}!`, 2);
      this.sendMatchStatus();
      Util.timeout(3000, () => {
        this.stopGame();
        this.setCustomStadium(map);
        this.startGame();
      });
    }
  }
}
