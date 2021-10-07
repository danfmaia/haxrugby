import {
  MSG_BALL_LEAVE_INGOAL,
  MSG_DEF_REC,
  MSG_GREETING_1,
  MSG_GREETING_2,
  MSG_GREETING_3,
  MSG_GREETING_4,
  MSG_GREETING_5,
  MSG_HELP,
  MSG_RULES,
  MSG_SAFETY_ALLOWED,
} from '../../constants/dictionary/dictionary';
import colors from '../../constants/style/colors';
import LinkEnum from '../../enums/LinkEnum';
import RuleEnum from '../../enums/RuleEnum';
import { IBallEnterOrLeaveIngoal } from '../../models/stadium/AHaxRugbyStadium';
import { IHaxRugbyRoom } from '../../rooms/HaxRugbyRoom';
import Util from '../../util/Util';
import { IGameService } from './IGameService';

export interface IChatService {
  sendNormalAnnouncement(message: string, sound?: number, playerId?: number, color?: number): void;
  sendBoldAnnouncement(message: string, sound: number, playerId?: number, color?: number): void;
  sendBlueAnnouncement(message: string, sound?: number, playerId?: number): void;
  sendBlueBoldAnnouncement(message: string, sound: number, playerId?: number): void;
  sendYellowAnnouncement(message: string, sound?: number, playerId?: number): void;
  sendYellowBoldAnnouncement(message: string, sound: number, playerId?: number): void;

  sendSpace(playerId?: number): void;

  sendMatchStatus(sound?: number, playerId?: number): void;
  announceDefRec(didBallEnterOrLeaveIngoal: IBallEnterOrLeaveIngoal, isDefRec: boolean): void;
  announceRegularOvertime(): void;
  announceBallPositionOvertime(): void;

  sendGreetingsToIncomingPlayer(playerId: number): void;
  sendNewMatchHelp(): void;
  sendMainPromoLinks(sound?: number, playerId?: number): void;
  sendMainPromoLinksForSpectators(): void;
  sendSinglePromoLink(link: LinkEnum, sound?: number, playerId?: number): void;
  sendMainRules(sound?: number, playerId?: number): void;
  sendSingleRule(rule: RuleEnum, sound?: number, playerId?: number): void;
  sendHelp(sound?: number, playerId?: number): void;
  sendConversionHelp(playerId?: number): void;
}

export default class ChatService implements IChatService {
  private room: IHaxRugbyRoom;
  private gameService: IGameService;

  constructor(room: IHaxRugbyRoom, gameService: IGameService) {
    this.room = room;
    this.gameService = gameService;
  }

  public sendNormalAnnouncement(
    message: string,
    sound: number = 0,
    playerId?: number,
    color?: number,
  ): void {
    this.room.sendAnnouncement(message, playerId, color || colors.haxRugbyGreen, undefined, sound);
  }

  public sendBoldAnnouncement(
    message: string,
    sound: number = 0,
    playerId?: number,
    color?: number,
  ): void {
    this.room.sendAnnouncement(message, playerId, color || colors.haxRugbyGreen, 'bold', sound);
  }

  public sendYellowAnnouncement(message: string, sound: number = 0, playerId?: number): void {
    this.room.sendAnnouncement(message, playerId, colors.yellow, undefined, sound);
  }

  public sendYellowBoldAnnouncement(message: string, sound: number = 0, playerId?: number): void {
    this.room.sendAnnouncement(message, playerId, colors.yellow, 'bold', sound);
  }

  public sendBlueAnnouncement(message: string, sound: number = 0, playerId?: number): void {
    this.room.sendAnnouncement(message, playerId, colors.blue, undefined, sound);
  }

  public sendBlueBoldAnnouncement(message: string, sound: number = 0, playerId?: number): void {
    this.room.sendAnnouncement(message, playerId, colors.blue, 'bold', sound);
  }

  public sendSpace(playerId?: number): void {
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

  public announceDefRec(
    didBallEnterOrLeaveIngoal: IBallEnterOrLeaveIngoal,
    isDefRec: boolean,
  ): void {
    if (didBallEnterOrLeaveIngoal === 'enter') {
      if (isDefRec) {
        this.sendYellowBoldAnnouncement(MSG_DEF_REC[0], 2);
        this.sendYellowAnnouncement(MSG_DEF_REC[1]);
      } else {
        this.sendBoldAnnouncement(MSG_SAFETY_ALLOWED, 0);
      }
    } else if (didBallEnterOrLeaveIngoal === 'leave') {
      this.sendNormalAnnouncement(MSG_BALL_LEAVE_INGOAL);
    }
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
      this.sendBoldAnnouncement(MSG_GREETING_1, 2, playerId, colors.haxRugbyBall);
      this.sendYellowAnnouncement(MSG_GREETING_2, 0, playerId);
      this.sendNormalAnnouncement(MSG_GREETING_3, 0, playerId);
      this.sendBlueAnnouncement(MSG_GREETING_4, 0, playerId);
      this.sendBlueAnnouncement(MSG_GREETING_5, 0, playerId);
    });
    Util.timeout(3000, () => {
      if (this.gameService.isMatchInProgress) {
        this.sendSpace(playerId);
        this.sendMatchStatus(2, playerId);
      }
    });
    Util.timeout(10000, () => {
      this.sendMainPromoLinks(2, playerId);
    });
  }

  public sendNewMatchHelp(): void {
    this.sendBoldAnnouncement(
      'Use !rr ou !rr x2/x3/x4 para iniciar uma nova partida!   Exemplo: !rr x4',
      2,
    );
    this.sendNormalAnnouncement('Apenas admins podem usar esse comando.');
  }

  public sendMainPromoLinks(sound: number = 2, playerId?: number): void {
    this.sendSinglePromoLink(LinkEnum.RULES, sound, playerId);
    this.sendSinglePromoLink(LinkEnum.DISCORD, 0, playerId);
    // this.sendSinglePromoLink(LinkEnum.FACEBOOK, 0, playerId);
  }

  public sendMainPromoLinksForSpectators(): void {
    const spectators = this.room.getPlayerList().filter((player) => player.team === 0);
    spectators.forEach((spectator) => {
      this.sendMainPromoLinks(2, spectator.id);
    });
  }

  public sendSinglePromoLink(link: LinkEnum, sound: number = 2, playerId?: number): void {
    switch (link) {
      case LinkEnum.RULES:
        this.room.sendAnnouncement('REGRAS do jogo:', playerId, colors.haxRugbyBall, 'bold', 0);
        this.room.sendAnnouncement(
          '    sites.google.com/site/haxrugby/regras',
          playerId,
          colors.haxRugbyBall,
          undefined,
          0,
        );
        return;
      case LinkEnum.DISCORD:
        this.sendBoldAnnouncement('Server no DISCORD:', sound, playerId, colors.discordPurple);
        this.sendNormalAnnouncement(
          '    fb.discord.io/HaxRugby',
          0,
          playerId,
          colors.discordPurple,
        );
        return;
      case LinkEnum.FACEBOOK:
        this.sendBoldAnnouncement('Grupo no FACEBOOK:', sound, playerId);
        this.sendNormalAnnouncement('    fb.com/groups/haxrugby', 0, playerId);
        return;
      default:
    }
  }

  public sendMainRules(sound: number = 2, playerId?: number): void {
    this.sendSpace(playerId);
    this.sendBoldAnnouncement(MSG_RULES.TITLE, sound, playerId);
    this.sendSpace(playerId);

    this.sendSingleRule(RuleEnum.TRY, 0, playerId);
    this.sendSingleRule(RuleEnum.FIELD_GOAL, 0, playerId);
    this.sendSingleRule(RuleEnum.SAFETY, 0, playerId);
    this.sendSingleRule(RuleEnum.OFFSIDE, 0, playerId);

    this.room.sendAnnouncement(
      MSG_RULES.POST_RULES[0],
      playerId,
      colors.haxRugbyGreen,
      'italic',
      0,
    );
    this.room.sendAnnouncement(
      MSG_RULES.POST_RULES[1],
      playerId,
      colors.haxRugbyGreen,
      'italic',
      0,
    );
    this.sendSpace(playerId);
  }

  public sendSingleRule(rule: RuleEnum, sound: number = 2, playerId?: number): void {
    switch (rule) {
      case RuleEnum.TRY:
        this.sendBoldAnnouncement(MSG_RULES.TRY_TITLE, sound, playerId);
        MSG_RULES.TRY.forEach((rule) => {
          this.sendNormalAnnouncement(rule, 0, playerId);
        });
        this.sendSpace(playerId);
        return;
      case RuleEnum.FIELD_GOAL:
        this.sendBoldAnnouncement(MSG_RULES.FIELD_GOAL_TITLE, sound, playerId);
        MSG_RULES.FIELD_GOAL.forEach((rule) => {
          this.sendNormalAnnouncement(rule, 0, playerId);
        });
        this.sendSpace(playerId);
        return;
      case RuleEnum.SAFETY:
        this.sendBoldAnnouncement(MSG_RULES.SAFETY_TITLE, sound, playerId);
        MSG_RULES.SAFETY.forEach((rule) => {
          this.sendNormalAnnouncement(rule, 0, playerId);
        });
        this.sendSpace(playerId);
        return;
      case RuleEnum.OFFSIDE:
        this.sendBoldAnnouncement(MSG_RULES.OFFSIDE_TITLE, sound, playerId);
        MSG_RULES.OFFSIDE.forEach((rule) => {
          this.sendNormalAnnouncement(rule, 0, playerId);
        });
        this.sendSpace(playerId);
        return;
      default:
    }
  }

  public sendHelp(sound: number = 2, playerId?: number): void {
    this.sendSpace(playerId);
    this.sendBoldAnnouncement(MSG_HELP.TITLE, sound, playerId);
    this.sendSpace(playerId);

    if (typeof playerId !== 'undefined' && this.room.getPlayer(playerId).admin) {
      this.sendBoldAnnouncement(MSG_HELP.ADMIN_COMMANDS, 0, playerId);
      this.sendSpace(playerId);

      this.sendBoldAnnouncement(MSG_HELP.NEW_MATCH, 0, playerId);
      this.sendNormalAnnouncement(MSG_HELP.NEW_MATCH_DESCRIPTION, 0, playerId);

      this.sendBoldAnnouncement(MSG_HELP.ADMIN, 0, playerId);
      this.sendNormalAnnouncement(MSG_HELP.ADMIN_DESCRIPTION, 0, playerId);

      this.sendBoldAnnouncement(MSG_HELP.PASSWORD, 0, playerId);
      this.sendNormalAnnouncement(MSG_HELP.PASSWORD_DESCRIPTION, 0, playerId);
      this.sendSpace(playerId);

      this.sendBoldAnnouncement(MSG_HELP.OTHER_COMMANDS, 0, playerId);
      this.sendSpace(playerId);
    }

    this.sendBoldAnnouncement(MSG_HELP.SCORE, 0, playerId);
    this.sendNormalAnnouncement(MSG_HELP.SCORE_DESCRIPTION, 0, playerId);

    this.sendBoldAnnouncement(MSG_HELP.KICKER, 0, playerId);
    this.sendNormalAnnouncement(MSG_HELP.KICKER_DESCRIPTION, 0, playerId);

    this.sendBoldAnnouncement(MSG_HELP.GOALKEEPER, 0, playerId);
    this.sendNormalAnnouncement(MSG_HELP.GOALKEEPER_DESCRIPTION, 0, playerId);

    this.sendBoldAnnouncement(MSG_HELP.BALL, 0, playerId);
    this.sendNormalAnnouncement(MSG_HELP.BALL_DESCRIPTION, 0, playerId);

    this.sendBoldAnnouncement(MSG_HELP.RULES, 0, playerId);
    this.sendNormalAnnouncement(MSG_HELP.RULES_DESCRIPTION, 0, playerId);

    this.sendBoldAnnouncement(MSG_HELP.LINKS, 0, playerId);
    this.sendNormalAnnouncement(MSG_HELP.LINKS_DESCRIPTION, 0, playerId);

    if (!playerId) {
      this.sendBoldAnnouncement(MSG_HELP.HELP, 0, playerId);
      this.sendNormalAnnouncement(MSG_HELP.HELP_DESCRIPTION, 0, playerId);
    }

    this.sendSpace(playerId);
  }

  public sendConversionHelp(playerId?: number): void {
    this.sendSpace(playerId);

    this.sendBoldAnnouncement(MSG_HELP.KICKER, 0, playerId);
    this.sendNormalAnnouncement(MSG_HELP.KICKER_DESCRIPTION, 0, playerId);

    this.sendBoldAnnouncement(MSG_HELP.GOALKEEPER, 0, playerId);
    this.sendNormalAnnouncement(MSG_HELP.GOALKEEPER_DESCRIPTION, 0, playerId);

    this.sendBoldAnnouncement(MSG_HELP.BALL, 0, playerId);
    this.sendNormalAnnouncement(MSG_HELP.BALL_DESCRIPTION, 0, playerId);
  }
}
