import { MSG_GREETING_1, MSG_GREETING_2 } from '../../constants/dictionary';
import styles from '../../constants/styles';
import { IHaxRugbyRoom } from '../../rooms/HaxRugbyRoom';
import Util from '../../util/Util';
import { IGameService } from './IGameService';

export interface IChatService {
  sendNormalAnnouncement(message: string, sound?: number, playerId?: number): void;
  sendBoldAnnouncement(message: string, sound: number, playerId?: number): void;

  sendGreetingsToIncomingPlayer(playerId: number): void;
  sendMatchStatus(sound?: number, playerId?: number): void;
  sendPromotionLinks(playerId?: number): void;

  announceRegularOvertime(): void;
  announceBallPositionOvertime(): void;
}

export default class ChatService implements IChatService {
  private room: IHaxRugbyRoom;
  private gameService: IGameService;

  constructor(room: IHaxRugbyRoom, gameService: IGameService) {
    this.room = room;
    this.gameService = gameService;
  }

  public sendNormalAnnouncement(message: string, sound: number = 0, playerId?: number) {
    this.room.sendAnnouncement(message, playerId, styles.haxruGreen, undefined, sound);
  }

  public sendBoldAnnouncement(message: string, sound: number = 0, playerId?: number) {
    this.room.sendAnnouncement(message, playerId, styles.haxruGreen, 'bold', sound);
  }

  public sendGreetingsToIncomingPlayer(playerId: number) {
    Util.timeout(1000, () => {
      this.sendBoldAnnouncement(MSG_GREETING_1, 2, playerId);
      this.sendNormalAnnouncement(MSG_GREETING_2, 0, playerId);
    });
    Util.timeout(3000, () => {
      if (this.gameService.isMatchInProgress) {
        this.sendMatchStatus(2, playerId);
      }
    });
    Util.timeout(10000, () => {
      this.sendPromotionLinks(playerId);
    });
  }

  public sendMatchStatus(sound: number = 0, playerId?: number) {
    let timeString: string;
    if (this.gameService.isOvertime === false) {
      timeString = Util.getRemainingTimeString(this.gameService.remainingTime);
    } else {
      if (this.gameService.remainingTime === 0) {
        timeString = 'Início do overtime';
      } else {
        timeString = `${Util.getRemainingTimeString(this.gameService.remainingTime)} do overtime`;
      }
    }

    this.sendBoldAnnouncement(
      // prettier-ignore
      `Placar e Tempo restante: ${this.gameService.score.red}-${this.gameService.score.blue} | ${timeString}`,
      sound,
      playerId,
    );
  }

  public sendPromotionLinks(playerId?: number) {
    this.sendBoldAnnouncement('Regras do jogo:', 2, playerId);
    this.sendNormalAnnouncement('    sites.google.com/site/haxrugby/regras-completas', 0, playerId);

    this.sendBoldAnnouncement('Server no DISCORD:', 0, playerId);
    this.sendNormalAnnouncement('    discord.io/HaxRugby', 0, playerId);

    this.sendBoldAnnouncement('Grupo no FACEBOOK:', 0, playerId);
    this.sendNormalAnnouncement('    fb.com/groups/haxrugby', 0, playerId);
  }

  public announceRegularOvertime() {
    this.sendBoldAnnouncement('OVERTIME!', 2);
    this.sendNormalAnnouncement('O primeiro time que pontuar ganha!');
    this.sendMatchStatus();
  }

  public announceBallPositionOvertime() {
    this.sendBoldAnnouncement('OVERTIME!', 2);
    this.sendNormalAnnouncement(
      'O jogo não termina enquanto o time perdedor estiver no ataque e ainda puder empatar ou virar o jogo!',
    );
    this.sendNormalAnnouncement(
      'No ataque, para efeito de regra, significa à frente da linha de kickoff do campo adversário.',
    );
    this.sendMatchStatus();
  }
}
