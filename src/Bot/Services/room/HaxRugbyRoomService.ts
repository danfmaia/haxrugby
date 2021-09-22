import { MINUTE_IN_MS } from '../../constants/general';
import TeamEnum from '../../enums/TeamEnum';
import { CustomPlayer } from '../../models/CustomPlayer';
import { IHaxRugbyRoom } from '../../rooms/IHaxRugbyRoom';
import Util from '../../util/Util';
import HaxRugbyRoomMessager, { IHaxRugbyRoomMessager } from './HaxRugbyRoomMessager';

export interface IHaxRugbyRoomService {}

export default class HaxRugbyRoomService implements IHaxRugbyRoomService {
  private _room: IHaxRugbyRoom;
  private _roomMessager: IHaxRugbyRoomMessager;

  constructor(room: IHaxRugbyRoom) {
    this._room = room;
    this._roomMessager = new HaxRugbyRoomMessager(room);
  }

  public initializeMatch(player?: CustomPlayer) {
    this._room.remainingTime = this._room.matchConfig.getTimeLimitInMs();
    this._room.isMatchInProgress = true;
    this._room.isOvertime = false;
    this._room.scoreA = 0;
    this._room.scoreB = 0;
    this._room.startGame();

    if (player) {
      this._roomMessager.sendBoldAnnouncement(`${player.name} iniciou uma nova partida!`, 2);
    } else {
      this._roomMessager.sendBoldAnnouncement('Iniciando nova partida!', 2);
    }
    this._roomMessager.sendNormalAnnouncement(
      Util.getDurationString(this._room.matchConfig.timeLimit),
    );
    this._roomMessager.sendNormalAnnouncement(
      `Limite de pontos:  ${this._room.matchConfig.scoreLimit}`,
    );
  }

  public finalizeMatch() {
    this._room.isMatchInProgress = false;
    this._room.isTimeRunning = false;
    this._room.pauseGame(true);
    Util.timeout(5000, () => this._room.stopGame());

    this._roomMessager.sendBoldAnnouncement('Fim da partida!', 2);
    this._roomMessager.sendNormalAnnouncement(
      `Placar final: ${this._room.scoreA}-${this._room.scoreB}`,
    );
  }

  public checkForTimeEvents(room: IHaxRugbyRoom) {
    if (room.isTimeRunning) {
      room.remainingTime = room.remainingTime - 1000 / 10;
    }

    if (
      (room.remainingTime < room.matchConfig.getTimeLimitInMs() &&
        room.remainingTime > 0 &&
        room.remainingTime % MINUTE_IN_MS === 0) ||
      room.remainingTime === MINUTE_IN_MS / 2 ||
      room.remainingTime === MINUTE_IN_MS / 4
    ) {
      this._roomMessager.sendMatchStatus(2);
    }

    if (room.remainingTime === room.matchConfig.getTimeLimitInMs() - 5000) {
      this._roomMessager.sendPromotionLinks();
    }

    if ([5000, 4000, 3000, 2000, 1000].includes(room.remainingTime)) {
      this._roomMessager.sendNormalAnnouncement(`${room.remainingTime / 1000}...`, 2);
    }

    if (room.isMatchInProgress && room.remainingTime <= 0) {
      if (room.scoreA !== room.scoreB) {
        const ballPosition = room.getBallPosition();
        const canLosingTeamTieOrTurn =
          (room.scoreA - room.scoreB <= 7 && ballPosition.x < -room.stadium.kickoffLineX) ||
          (room.scoreB - room.scoreA <= 7 && ballPosition.x > room.stadium.kickoffLineX);

        if (canLosingTeamTieOrTurn === false) {
          this.finalizeMatch();
        } else if (room.isOvertime === false) {
          this.startBallPositionOvertime(room);
        }
      } else if (room.isOvertime === false) {
        this.startRegularOvertime();
      }
    }
  }

  private startRegularOvertime() {
    this._room.isOvertime = true;

    this._roomMessager.sendBoldAnnouncement('OVERTIME!', 2);
    this._roomMessager.sendNormalAnnouncement('O primeiro time que pontuar ganha!');
    this._roomMessager.sendMatchStatus();
  }

  private startBallPositionOvertime(room: IHaxRugbyRoom) {
    room.isOvertime = true;

    // report
    this._roomMessager.sendBoldAnnouncement('OVERTIME!', 2);
    this._roomMessager.sendNormalAnnouncement(
      'O jogo não termina enquanto o time perdedor estiver no ataque e ainda puder empatar ou virar o jogo!',
    );
    this._roomMessager.sendNormalAnnouncement(
      'No ataque, para efeito de regra, significa à frente da linha de kickoff do campo adversário.',
    );
    this._roomMessager.sendMatchStatus();
  }

  private checkForGoal() {
    if (!this._room.lastTouchInfo) {
      return;
    }

    let isGoal: false | TeamEnum = false;
    isGoal = this._room.stadium.getIsGoal(
      this._room.getBallPosition(),
      this._room.getDiscProperties(0).xspeed,
      this._room.lastTouchInfo.ballPosition,
    );

    if (isGoal) {
      this._room.isTimeRunning = false;
      let teamName: string;
      let map: string;

      if (isGoal === TeamEnum.TEAM_A) {
        this._room.scoreA = this._room.scoreA + 3;
        teamName = this._room.matchConfig.teamA.name;
        map = this._room.stadium.map_B;
      } else {
        this._room.scoreB = this._room.scoreB + 3;
        teamName = this._room.matchConfig.teamB.name;
        map = this._room.stadium.map_A;
      }

      // send announcements and restart game
      this._roomMessager.sendBoldAnnouncement(`Gol do ${teamName}!`, 2);
      this._roomMessager.sendMatchStatus();
      Util.timeout(3000, () => {
        this._room.stopGame();
        this._room.setCustomStadium(map);
        this._room.startGame();
      });
    }
  }
}
