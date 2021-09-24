import { MINUTE_IN_MS } from '../../constants/general';
import TeamEnum from '../../enums/TeamEnum';
import { CustomPlayer } from '../../models/CustomPlayer';
import ITouchInfo from '../../models/physics/ITouchInfo';
import { IHaxRugbyRoom } from '../../rooms/HaxRugbyRoom';
import Physics from '../../util/Physics';
import Util from '../../util/Util';
import RoomMessager, { IRoomMessager } from './RoomMessager';

export interface IRoomGame {
  initializeMatch(player?: CustomPlayer): void;
  cancelMatch(player: CustomPlayer, callback: () => void): void;

  checkForTimeEvents(): void;
  checkForScoring(): void;
  registerKickAsTouch(playerId: number): void;
}

export default class RoomGame implements IRoomGame {
  private room: IHaxRugbyRoom;
  private roomMessager: IRoomMessager;

  constructor(room: IHaxRugbyRoom) {
    this.room = room;
    this.roomMessager = new RoomMessager(room);
  }

  public initializeMatch(player?: CustomPlayer) {
    this.room.remainingTime = this.room.matchConfig.getTimeLimitInMs();
    this.room.isMatchInProgress = true;
    this.room.isOvertime = false;
    this.room.score = { a: 0, b: 0 };
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
    this.room.isFinalizing = true;
    this.room.pauseGame(true);
    this.room.lastScores.unshift(this.room.score);
    Util.timeout(5000, () => {
      if (this.room.isFinalizing) {
        this.room.stopGame();
        const lastWinner = this.getLastWinner();
        if (lastWinner === TeamEnum.TEAM_A) {
          this.room.setCustomStadium(this.room.stadium.map_A);
        } else if (lastWinner === TeamEnum.TEAM_B) {
          this.room.setCustomStadium(this.room.stadium.map_B);
        }
      }
    });

    this.roomMessager.sendBoldAnnouncement('Fim da partida!', 2);
    this.roomMessager.sendNormalAnnouncement(
      `Placar final: ${this.room.score.a}-${this.room.score.b}`,
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
      `Placar parcial:  ${this.room.score.a}-${this.room.score.b}`,
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
      if (this.room.score.a !== this.room.score.b) {
        const ballPosition = this.room.getBallPosition();
        const canLosingTeamTieOrTurn =
          (this.room.score.a - this.room.score.b <= 7 &&
            ballPosition.x < -this.room.stadium.kickoffLineX) ||
          (this.room.score.b - this.room.score.a <= 7 &&
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

  public checkForScoring() {
    const players = this.room.getPlayerList();
    const ballPosition = this.room.getBallPosition();

    const newTouchInfo = Physics.getTouchPositionAndPlayers(players, ballPosition);
    if (newTouchInfo) {
      this.registerTouchInfo(newTouchInfo);
    }

    this.checkForGoal();
  }

  private checkForGoal() {
    if (this.room.lastTouchInfoList.length === 0) {
      return;
    }

    let isGoal: false | TeamEnum = false;
    isGoal = this.room.stadium.getIsGoal(
      this.room.getBallPosition(),
      this.room.getDiscProperties(0).xspeed,
      this.room.lastTouchInfoList[0].ballPosition,
    );

    if (isGoal) {
      this.room.isTimeRunning = false;
      let teamName: string;
      let map: string;

      if (isGoal === TeamEnum.TEAM_A) {
        this.room.score.a = this.room.score.a + 3;
        teamName = this.room.matchConfig.teamA.name;
        map = this.room.stadium.map_B;
      } else {
        this.room.score.b = this.room.score.b + 3;
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

  private getLastWinner(): TeamEnum | null | 0 {
    const lastScore = this.room.lastScores[0];
    if (!lastScore) {
      return null;
    }
    if (lastScore.a > lastScore.b) {
      return TeamEnum.TEAM_A;
    } else if (lastScore.a < lastScore.b) {
      return TeamEnum.TEAM_B;
    }
    return 0;
  }

  public registerKickAsTouch(playerId: number) {
    const ballPosition = this.room.getBallPosition();

    let updatedToucherIds =
      this.room.lastTouchInfoList.length > 0 ? this.room.lastTouchInfoList[0].toucherIds : [];
    updatedToucherIds.push(playerId);

    this.registerTouchInfo({
      toucherIds: updatedToucherIds,
      ballPosition: ballPosition,
    });
  }

  private registerTouchInfo(newTouchInfo: ITouchInfo) {
    this.room.lastTouchInfoList.unshift(newTouchInfo);
    if (this.room.lastTouchInfoList.length > 20) {
      this.room.lastTouchInfoList.pop();
    }
  }
}
