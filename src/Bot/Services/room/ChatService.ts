import {
  MSG_GREETING_1,
  MSG_GREETING_2,
  MSG_GREETING_3,
  MSG_GREETING_4,
  MSG_GREETING_5,
  MSG_HELP,
  MSG_RULES,
} from '../../constants/dictionary/dictionary';
import styles from '../../constants/styles';
import { IHaxRugbyRoom } from '../../rooms/HaxRugbyRoom';
import Util from '../../util/Util';
import { IGameService } from './IGameService';

export interface IChatService {
  sendNormalAnnouncement(message: string, sound?: number, playerId?: number): void;
  sendBoldAnnouncement(message: string, sound: number, playerId?: number): void;

  sendMatchStatus(sound?: number, playerId?: number): void;
  announceRegularOvertime(): void;
  announceBallPositionOvertime(): void;

  sendGreetingsToIncomingPlayer(playerId: number): void;
  sendMainPromotionLinks(sound?: number, playerId?: number): void;
  sendRules(sound?: number, playerId?: number): void;
  sendHelp(sound?: number, playerId?: number): void;
}

export default class ChatService implements IChatService {
  private room: IHaxRugbyRoom;
  private gameService: IGameService;

  constructor(room: IHaxRugbyRoom, gameService: IGameService) {
    this.room = room;
    this.gameService = gameService;
  }

  public sendNormalAnnouncement(message: string, sound: number = 0, playerId?: number): void {
    this.room.sendAnnouncement(message, playerId, styles.haxruGreen, undefined, sound);
  }

  public sendBoldAnnouncement(message: string, sound: number = 0, playerId?: number): void {
    this.room.sendAnnouncement(message, playerId, styles.haxruGreen, 'bold', sound);
  }

  private sendSpace(playerId?: number) {
    this.sendNormalAnnouncement('', 0, playerId);
  }

  public sendMatchStatus(sound: number = 0, playerId?: number): void {
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

  public announceRegularOvertime(): void {
    this.sendBoldAnnouncement('OVERTIME!', 2);
    this.sendNormalAnnouncement('O primeiro time que pontuar ganha!');
    this.sendMatchStatus();
  }

  public announceBallPositionOvertime(): void {
    this.sendBoldAnnouncement('OVERTIME!', 2);
    this.sendNormalAnnouncement(
      'O jogo não termina enquanto o time perdedor estiver no ataque e ainda puder empatar ou virar o jogo!',
    );
    this.sendNormalAnnouncement(
      'No ataque, para efeito de regra, significa à frente da linha de kickoff do campo adversário.',
    );
    this.sendMatchStatus();
  }

  public sendGreetingsToIncomingPlayer(playerId: number): void {
    Util.timeout(1000, () => {
      this.sendBoldAnnouncement(MSG_GREETING_1, 2, playerId);
      this.sendNormalAnnouncement(MSG_GREETING_2, 0, playerId);
      this.sendNormalAnnouncement(MSG_GREETING_3, 0, playerId);
      this.sendSpace(playerId);
      this.sendNormalAnnouncement(MSG_GREETING_4, 0, playerId);
      this.sendNormalAnnouncement(MSG_GREETING_5, 0, playerId);
    });
    Util.timeout(3000, () => {
      if (this.gameService.isMatchInProgress) {
        this.sendSpace(playerId);
        this.sendMatchStatus(2, playerId);
      }
    });
    Util.timeout(10000, () => {
      this.sendMainPromotionLinks(2, playerId);
    });
  }

  public sendMainPromotionLinks(sound: number = 2, playerId?: number): void {
    this.sendBoldAnnouncement('REGRAS do jogo:', sound, playerId);
    this.sendNormalAnnouncement('    sites.google.com/site/haxrugby/regras', 0, playerId);

    this.sendBoldAnnouncement('Server no DISCORD:', 0, playerId);
    this.sendNormalAnnouncement('    discord.io/HaxRugby', 0, playerId);

    this.sendBoldAnnouncement('Grupo no FACEBOOK:', 0, playerId);
    this.sendNormalAnnouncement('    fb.com/groups/haxrugby', 0, playerId);
  }

  public sendRules(sound: number = 2, playerId?: number): void {
    this.sendSpace(playerId);
    this.sendBoldAnnouncement(MSG_RULES.TITLE, sound, playerId);
    this.sendSpace(playerId);

    this.sendBoldAnnouncement('TRY', 0, playerId);
    MSG_RULES.TRY.forEach((rule) => {
      this.sendNormalAnnouncement(rule, 0, playerId);
    });
    this.sendSpace(playerId);

    this.sendBoldAnnouncement('FIELD GOAL (FG)', 0, playerId);
    MSG_RULES.GOAL.forEach((rule) => {
      this.sendNormalAnnouncement(rule, 0, playerId);
    });
    this.sendSpace(playerId);

    this.sendBoldAnnouncement('SAFETY (SF)', 0, playerId);
    MSG_RULES.SAFETY.forEach((rule) => {
      this.sendNormalAnnouncement(rule, 0, playerId);
    });
    this.sendSpace(playerId);

    this.sendBoldAnnouncement(MSG_RULES.LINK_FOR_COMPLETE_RULES, 0, playerId);
    this.sendSpace(playerId);
  }

  public sendHelp(sound: number = 2, playerId?: number): void {
    this.sendSpace(playerId);
    this.sendBoldAnnouncement(MSG_HELP.TITLE, sound, playerId);
    this.sendSpace(playerId);

    if (!playerId) {
      this.sendBoldAnnouncement(MSG_HELP.HELP, 0, playerId);
      this.sendNormalAnnouncement(MSG_HELP.HELP_DESCRIPTION, 0, playerId);
    }

    this.sendBoldAnnouncement(MSG_HELP.RULES, 0, playerId);
    this.sendNormalAnnouncement(MSG_HELP.RULES_DESCRIPTION, 0, playerId);

    this.sendBoldAnnouncement(MSG_HELP.NEW_MATCH, 0, playerId);
    this.sendNormalAnnouncement(MSG_HELP.NEW_MATCH_DESCRIPTION, 0, playerId);

    this.sendBoldAnnouncement(MSG_HELP.SCORE, 0, playerId);
    this.sendNormalAnnouncement(MSG_HELP.SCORE_DESCRIPTION, 0, playerId);

    this.sendBoldAnnouncement(MSG_HELP.LINKS, 0, playerId);
    this.sendNormalAnnouncement(MSG_HELP.LINKS_DESCRIPTION, 0, playerId);

    this.sendBoldAnnouncement(MSG_HELP.ADMIN, 0, playerId);
    this.sendNormalAnnouncement(MSG_HELP.ADMIN_DESCRIPTION, 0, playerId);

    this.sendBoldAnnouncement(MSG_HELP.PASSWORD, 0, playerId);
    this.sendNormalAnnouncement(MSG_HELP.PASSWORD_DESCRIPTION, 0, playerId);

    this.sendSpace(playerId);
  }
}
