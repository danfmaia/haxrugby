import { MINUTE_IN_MS } from '../../constants/general';
import TeamEnum from '../../enums/TeamEnum';
import { CustomPlayer } from '../../models/CustomPlayer';
import { IHaxRugbyRoom } from '../../rooms/HaxRugbyRoom';
import Util from '../../util/Util';
import HaxRugbyRoomMessager, { IHaxRugbyRoomMessager } from './HaxRugbyRoomMessager';

export interface IHaxRugbyRoomService {
  initializeMatch(player?: CustomPlayer): void;
  cancelMatch(player: CustomPlayer, callback: () => void): void;

  checkForTimeEvents(): void;
  checkForGoal(): void;
}

export default class HaxRugbyRoomService implements IHaxRugbyRoomService {
  private room: IHaxRugbyRoom;
  private roomMessager: IHaxRugbyRoomMessager;

  constructor(room: IHaxRugbyRoom) {
    this.room = room;
    this.roomMessager = new HaxRugbyRoomMessager(room);
  }

  public initializeMatch(player?: CustomPlayer) {
    this.room.remainingTime = this.room.matchConfig.getTimeLimitInMs();
    this.room.isMatchInProgress = true;
    this.room.isOvertime = false;
    this.room.scoreA = 0;
    this.room.scoreB = 0;
    this.room.startGame();

    if (player) {
      this.roomMessager.sendBoldAnnouncement(`${player.name} iniciou uma nova partida!`, 2);
    } else {
      this.roomMessager.sendBoldAnnouncement('Iniciando nova partida!', 2);
    }
    this.roomMessager.sendNormalAnnouncement(
      Util.getDurationString(this.room.matchConfig.timeLimit),
    );
    this.roomMessager.sendNormalAnnouncement(
      `Limite de pontos:  ${this.room.matchConfig.scoreLimit}`,
    );
  }

  public finalizeMatch() {
    this.room.isMatchInProgress = false;
    this.room.isTimeRunning = false;
    this.room.pauseGame(true);
    Util.timeout(5000, () => this.room.stopGame());

    this.roomMessager.sendBoldAnnouncement('Fim da partida!', 2);
    this.roomMessager.sendNormalAnnouncement(
      `Placar final: ${this.room.scoreA}-${this.room.scoreB}`,
    );
  }

  public cancelMatch(player: CustomPlayer, callback: () => void) {
    this.room.isMatchInProgress = false;
    this.room.isTimeRunning = false;
    this.room.pauseGame(true);
    Util.timeout(3500, () => {
      this.room.stopGame();
      callback();
    });

    this.roomMessager.sendBoldAnnouncement(`Partida cancelada por ${player.name}!`, 2);
    this.roomMessager.sendNormalAnnouncement(
      `Tempo restante:  ${Util.getRemainingTimeString(this.room.remainingTime)}`,
    );
    this.roomMessager.sendNormalAnnouncement(
      `Placar parcial:  ${this.room.scoreA}-${this.room.scoreB}`,
    );
    this.roomMessager.sendNormalAnnouncement('');
    this.roomMessager.sendNormalAnnouncement('Iniciando nova partida em 5 segundos...');
  }

  public checkForTimeEvents() {
    if (this.room.isTimeRunning) {
      this.room.remainingTime = this.room.remainingTime - 1000 / 10;
    }

    if (
      (this.room.remainingTime < this.room.matchConfig.getTimeLimitInMs() &&
        this.room.remainingTime > 0 &&
        this.room.remainingTime % MINUTE_IN_MS === 0) ||
      this.room.remainingTime === MINUTE_IN_MS / 2 ||
      this.room.remainingTime === MINUTE_IN_MS / 4
    ) {
      this.roomMessager.sendMatchStatus(2);
    }

    if (this.room.remainingTime === this.room.matchConfig.getTimeLimitInMs() - 5000) {
      this.roomMessager.sendPromotionLinks();
    }

    if ([5000, 4000, 3000, 2000, 1000].includes(this.room.remainingTime)) {
      this.roomMessager.sendNormalAnnouncement(`${this.room.remainingTime / 1000}...`, 2);
    }

    if (this.room.isMatchInProgress && this.room.remainingTime <= 0) {
      if (this.room.scoreA !== this.room.scoreB) {
        const ballPosition = this.room.getBallPosition();
        const canLosingTeamTieOrTurn =
          (this.room.scoreA - this.room.scoreB <= 7 &&
            ballPosition.x < -this.room.stadium.kickoffLineX) ||
          (this.room.scoreB - this.room.scoreA <= 7 &&
            ballPosition.x > this.room.stadium.kickoffLineX);

        if (canLosingTeamTieOrTurn === false) {
          this.finalizeMatch();
        } else if (this.room.isOvertime === false) {
          this.startBallPositionOvertime(this.room);
        }
      } else if (this.room.isOvertime === false) {
        this.startRegularOvertime();
      }
    }
  }

  private startRegularOvertime() {
    this.room.isOvertime = true;

    this.roomMessager.sendBoldAnnouncement('OVERTIME!', 2);
    this.roomMessager.sendNormalAnnouncement('O primeiro time que pontuar ganha!');
    this.roomMessager.sendMatchStatus();
  }

  private startBallPositionOvertime(room: IHaxRugbyRoom) {
    room.isOvertime = true;

    // report
    this.roomMessager.sendBoldAnnouncement('OVERTIME!', 2);
    this.roomMessager.sendNormalAnnouncement(
      'O jogo não termina enquanto o time perdedor estiver no ataque e ainda puder empatar ou virar o jogo!',
    );
    this.roomMessager.sendNormalAnnouncement(
      'No ataque, para efeito de regra, significa à frente da linha de kickoff do campo adversário.',
    );
    this.roomMessager.sendMatchStatus();
  }

  public checkForGoal() {
    if (!this.room.lastTouchInfo) {
      return;
    }

    let isGoal: false | TeamEnum = false;
    isGoal = this.room.stadium.getIsGoal(
      this.room.getBallPosition(),
      this.room.getDiscProperties(0).xspeed,
      this.room.lastTouchInfo.ballPosition,
    );

    if (isGoal) {
      this.room.isTimeRunning = false;
      let teamName: string;
      let map: string;

      if (isGoal === TeamEnum.TEAM_A) {
        this.room.scoreA = this.room.scoreA + 3;
        teamName = this.room.matchConfig.teamA.name;
        map = this.room.stadium.map_B;
      } else {
        this.room.scoreB = this.room.scoreB + 3;
        teamName = this.room.matchConfig.teamB.name;
        map = this.room.stadium.map_A;
      }

      // send announcements and restart game
      this.roomMessager.sendBoldAnnouncement(`Gol do ${teamName}!`, 2);
      this.roomMessager.sendMatchStatus();
      Util.timeout(3000, () => {
        this.room.stopGame();
        this.room.setCustomStadium(map);
        this.room.startGame();
      });
    }
  }
}
