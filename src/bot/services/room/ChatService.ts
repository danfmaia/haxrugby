import appConfig from '../../constants/appConfig';
import { LINK_DISCORD, LINK_DISCORD_RULES } from '../../constants/constants';
import {
  MSG_BALL_LEAVE_INGOAL,
  MSG_CLOSED_ROOM_1,
  MSG_CLOSED_ROOM_2,
  MSG_CLOSED_ROOM_3,
  MSG_DEF_REC,
  MSG_GAME_INFO_1,
  MSG_GAME_INFO_2,
  MSG_GAME_INFO_3,
  MSG_GAME_INFO_4,
  MSG_GAME_INFO_5,
  MSG_GREETING,
  MSG_HELP,
  MSG_RULES,
  MSG_SAFETY_ALLOWED,
} from '../../constants/dictionary/dictionary';
import colors from '../../constants/style/colors';
import LinkEnum from '../../enums/LinkEnum';
import PlayerConfigEnum, { PlayerConfigEnumExtension } from '../../enums/PlayerConfigEnum';
import RuleEnum from '../../enums/RuleEnum';
import { IBallEnterOrLeaveIngoal } from '../../models/map/AHaxRugbyMap';
import { IHaxRugbyRoom } from '../../rooms/HaxRugbyRoom';
import Util from '../../util/Util';
import { IGameService } from './IGameService';
import { TeamID } from 'inversihax';

export interface IChatService {
  sendNormalAnnouncement(message: string, sound?: number, playerId?: number, color?: number): void;
  sendBoldAnnouncement(message: string, sound?: number, playerId?: number, color?: number): void;
  sendGreenAnnouncement(message: string, sound?: number, playerId?: number): void;
  sendGreenBoldAnnouncement(message: string, sound?: number, playerId?: number): void;
  sendYellowAnnouncement(message: string, sound?: number, playerId?: number): void;
  sendYellowBoldAnnouncement(message: string, sound?: number, playerId?: number): void;
  sendBlueAnnouncement(message: string, sound?: number, playerId?: number): void;
  sendBlueBoldAnnouncement(message: string, sound?: number, playerId?: number): void;
  sendHaxRugbyAnnouncement(message: string, sound?: number, playerId?: number): void;
  sendHaxRugbyBoldAnnouncement(message: string, sound?: number, playerId?: number): void;

  sendBlankLine(playerId?: number): void;

  sendMatchStatus(sound?: number, playerId?: number): void;
  announceDefRec(didBallEnterOrLeaveIngoal: IBallEnterOrLeaveIngoal, isDefRec: boolean): void;
  announceRegularOvertime(): void;
  announceBallPositionOvertime(): void;

  sendGreetingsToIncomingPlayer(playerId: number): void;
  sendGameInfo(playerId?: number): void;
  sendNewMatchHelp(link?: boolean, playerId?: number): void;
  sendMainPromoLinks(sound?: number, playerId?: number): void;
  sendMainPromoLinksForSpectators(): void;
  sendSinglePromoLink(link: LinkEnum, sound?: number, playerId?: number): void;
  sendMainRules(sound?: number, playerId?: number): void;
  sendLongRule(rule: RuleEnum, sound?: number, playerId?: number): void;
  sendHelp(sound?: number, playerId?: number): void;
  sendConversionHelp(playerId?: number): void;

  announceBlockedAirKick(kickerId: number, blockerId: number): void;
  announceSuccessfulAirKick(kickerId: number): void;

  sendPlayerConfigInfo(
    config: PlayerConfigEnum,
    isEnabled: boolean,
    playerId: number,
    sound?: number,
  ): void;

  sendAllMessage(playerId: number, message: string): void;
  sendTeamMessage(playerId: number, message: string): void;
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

  public sendGreenAnnouncement(message: string, sound: number = 0, playerId?: number): void {
    this.room.sendAnnouncement(message, playerId, colors.green, undefined, sound);
  }

  public sendGreenBoldAnnouncement(message: string, sound: number = 0, playerId?: number): void {
    this.room.sendAnnouncement(message, playerId, colors.green, 'bold', sound);
  }

  public sendYellowAnnouncement(message: string, sound: number = 0, playerId?: number): void {
    this.room.sendAnnouncement(message, playerId, colors.yellow, undefined, sound);
  }

  public sendYellowBoldAnnouncement(message: string, sound: number = 0, playerId?: number): void {
    this.room.sendAnnouncement(message, playerId, colors.yellow, 'bold', sound);
  }

  public sendBlueAnnouncement(message: string, sound: number = 0, playerId?: number): void {
    this.room.sendAnnouncement(message, playerId, colors.mediumBlue, undefined, sound);
  }

  public sendBlueBoldAnnouncement(message: string, sound: number = 0, playerId?: number): void {
    this.room.sendAnnouncement(message, playerId, colors.mediumBlue, 'bold', sound);
  }

  public sendHaxRugbyAnnouncement(message: string, sound: number = 0, playerId?: number): void {
    this.room.sendAnnouncement(message, playerId, colors.haxRugbyBall, undefined, sound);
  }

  public sendHaxRugbyBoldAnnouncement(message: string, sound: number = 0, playerId?: number): void {
    this.room.sendAnnouncement(message, playerId, colors.haxRugbyBall, 'bold', sound);
  }

  public sendBlankLine(playerId?: number): void {
    this.sendNormalAnnouncement('', 0, playerId);
  }

  public sendMatchStatus(sound: number = 0, playerId?: number): void {
    let timeString: string;
    if (this.gameService.isOvertime === false) {
      timeString = Util.getRemainingTimeString(this.gameService.remainingTime);
    } else {
      if (this.gameService.remainingTime === 0) {
        timeString = 'Início do Overtime';
      } else {
        timeString = `${Util.getRemainingTimeString(this.gameService.remainingTime)} do Overtime`;
      }
    }

    this.sendBoldAnnouncement(
      // prettier-ignore
      `Placar e Tempo restante: ${this.gameService.score.red}-${this.gameService.score.blue} | ${timeString}`,
      sound,
      playerId,
      colors.green,
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
    if (appConfig.isOpen === false) {
      Util.timeout(1000, () => {
        this.sendBlankLine(playerId);
        this.sendBoldAnnouncement(MSG_GREETING, 2, playerId, colors.haxRugbyBall);
        // this.sendBlankLine(playerId);
        this.sendYellowBoldAnnouncement(MSG_CLOSED_ROOM_1, 0, playerId);
        // this.sendBlankLine(playerId);
        this.sendNormalAnnouncement(MSG_CLOSED_ROOM_2, 0, playerId, colors.discordPurple);
        this.sendNormalAnnouncement(MSG_CLOSED_ROOM_3, 0, playerId);
      });
      return;
    }

    Util.timeout(1000, () => {
      this.sendBoldAnnouncement(MSG_GREETING, 2, playerId, colors.haxRugbyBall);
      this.sendYellowAnnouncement(MSG_GAME_INFO_2, 0, playerId);
      this.sendNormalAnnouncement(MSG_GAME_INFO_3, 0, playerId);
      this.sendNormalAnnouncement(MSG_GAME_INFO_4, 0, playerId);
      this.sendBlueAnnouncement(MSG_GAME_INFO_5, 0, playerId);
    });
    Util.timeout(3000, () => {
      if (this.gameService.isMatchInProgress) {
        this.sendBlankLine(playerId);
        this.sendMatchStatus(2, playerId);
      }
    });
    Util.timeout(10000, () => {
      this.sendMainPromoLinks(2, playerId);
    });
  }

  public sendGameInfo(playerId: number): void {
    this.sendNormalAnnouncement(MSG_GAME_INFO_1, 0, playerId, colors.haxRugbyBall);
    this.sendYellowAnnouncement(MSG_GAME_INFO_2, 0, playerId);
    this.sendNormalAnnouncement(MSG_GAME_INFO_3, 0, playerId);
    this.sendNormalAnnouncement(MSG_GAME_INFO_4, 0, playerId);
    this.sendBlueAnnouncement(MSG_GAME_INFO_5, 0, playerId);
    this.sendBlankLine(playerId);
  }

  public sendNewMatchHelp(link: boolean = true, playerId: number): void {
    if (link) {
      this.sendSinglePromoLink(LinkEnum.DISCORD, 0, playerId);
    }
    this.sendNormalAnnouncement(
      '𝖴𝗌𝖾 !𝗿𝗿 𝗈𝗎 !𝗿𝗿 𝘅𝟮/𝘅𝟯/𝘅𝟰 𝗉𝖺𝗋𝖺 𝗂𝗇𝗂𝖼𝗂𝖺𝗋 𝗎𝗆𝖺 𝗇𝗈𝗏𝖺 𝗉𝖺𝗋𝗍𝗂𝖽𝖺!   𝖤𝗑𝖾𝗆𝗉𝗅𝗈: !𝗿𝗿 𝘅𝟰',
      0,
      playerId,
    );
    this.sendNormalAnnouncement('    𝐴𝑝𝑒𝑛𝑎𝑠 𝑎𝑑𝑚𝑖𝑛𝑠 𝑝𝑜𝑑𝑒𝑚 𝑢𝑠𝑎𝑟 𝑒𝑠𝑠𝑒 𝑐𝑜𝑚𝑎𝑛𝑑𝑜.', 0, playerId);
    this.sendBlankLine(playerId);
  }

  public sendMainPromoLinks(sound: number = 2, playerId?: number): void {
    this.sendSinglePromoLink(LinkEnum.DISCORD, 0, playerId);
    this.sendSinglePromoLink(LinkEnum.RULES, sound, playerId);
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
        this.sendHaxRugbyBoldAnnouncement('𝗥𝗘𝗚𝗥𝗔𝗦 𝗱𝗼 𝗷𝗼𝗴𝗼:', 0, playerId);
        this.room.sendAnnouncement(
          '    ' + LINK_DISCORD_RULES,
          playerId,
          colors.haxRugbyBall,
          undefined,
          0,
        );
        return;
      case LinkEnum.DISCORD:
        this.sendBoldAnnouncement('𝗦𝗲𝗿𝘃𝗲𝗿 𝗻𝗼 𝗗𝗜𝗦𝗖𝗢𝗥𝗗:', sound, playerId, colors.discordPurple);
        this.room.sendAnnouncement(
          '    ' + LINK_DISCORD,
          playerId,
          colors.discordPurple,
          undefined,
          0,
        );
        return;
      case LinkEnum.FACEBOOK:
        this.sendBoldAnnouncement('𝗚𝗿𝘂𝗽𝗼 𝗻𝗼 𝗙𝗔𝗖𝗘𝗕𝗢𝗢𝗞:', sound, playerId);
        this.room.sendAnnouncement(
          '    fb.com/groups/haxrugby',
          playerId,
          colors.haxRugbyGreen,
          undefined,
          0,
        );
        return;
      default:
    }
  }

  public sendMainRules(sound: number = 2, playerId?: number): void {
    this.sendBlankLine(playerId);
    this.sendBoldAnnouncement(MSG_RULES.TITLE, sound, playerId, colors.green);

    this.sendNormalAnnouncement(MSG_RULES.TRY.shortDescription, 0, playerId);
    this.sendNormalAnnouncement(MSG_RULES.DROP_GOAL.shortDescription, 0, playerId);
    this.sendNormalAnnouncement(MSG_RULES.SAFETY.shortDescription, 0, playerId);
    this.sendNormalAnnouncement(MSG_RULES.OFFSIDE.shortDescription, 0, playerId);

    this.sendNormalAnnouncement(MSG_RULES.POST_RULES, 0, playerId);
  }

  public sendLongRule(rule: RuleEnum, sound: number = 2, playerId?: number): void {
    switch (rule) {
      case RuleEnum.TRY:
        this.sendBoldAnnouncement(MSG_RULES.TRY.title, sound, playerId);
        MSG_RULES.TRY.longDescription.forEach((rule) => {
          this.sendNormalAnnouncement(rule, 0, playerId);
        });
        this.sendBlankLine(playerId);
        return;
      case RuleEnum.FIELD_GOAL:
        this.sendBoldAnnouncement(MSG_RULES.DROP_GOAL.title, sound, playerId);
        MSG_RULES.DROP_GOAL.longDescription.forEach((rule) => {
          this.sendNormalAnnouncement(rule, 0, playerId);
        });
        this.sendBlankLine(playerId);
        return;
      case RuleEnum.AIR_KICK:
        this.sendBoldAnnouncement(MSG_RULES.AIR_KICK.title, sound, playerId);
        MSG_RULES.AIR_KICK.longDescription.forEach((rule) => {
          this.sendNormalAnnouncement(rule, 0, playerId);
        });
        return;
      case RuleEnum.SAFETY:
        this.sendBoldAnnouncement(MSG_RULES.SAFETY.title, sound, playerId);
        MSG_RULES.SAFETY.longDescription.forEach((rule) => {
          this.sendNormalAnnouncement(rule, 0, playerId);
        });
        return;
      case RuleEnum.OFFSIDE:
        this.sendBoldAnnouncement(MSG_RULES.OFFSIDE.title, sound, playerId);
        MSG_RULES.OFFSIDE.longDescription.forEach((rule) => {
          this.sendNormalAnnouncement(rule, 0, playerId);
        });
        return;
      case RuleEnum.PENALTY:
        this.sendBoldAnnouncement(MSG_RULES.PENALTY.title, sound, playerId);
        MSG_RULES.PENALTY.longDescription.forEach((rule) => {
          this.sendNormalAnnouncement(rule, 0, playerId);
        });
        return;
      default:
    }
  }

  public sendHelp(sound: number = 2, playerId?: number): void {
    this.sendBlankLine(playerId);
    this.sendBoldAnnouncement(MSG_HELP.TITLE, sound, playerId);
    this.sendBlankLine(playerId);

    if (typeof playerId !== 'undefined' && this.room.getPlayer(playerId).admin) {
      this.sendBoldAnnouncement(MSG_HELP.ADMIN_COMMANDS, 0, playerId);
      this.sendBlankLine(playerId);

      this.sendBoldAnnouncement(MSG_HELP.NEW_MATCH, 0, playerId);
      this.sendNormalAnnouncement(MSG_HELP.NEW_MATCH_DESCRIPTION, 0, playerId);

      this.sendBoldAnnouncement(MSG_HELP.ADMIN, 0, playerId);
      this.sendNormalAnnouncement(MSG_HELP.ADMIN_DESCRIPTION, 0, playerId);

      this.sendBoldAnnouncement(MSG_HELP.PASSWORD, 0, playerId);
      this.sendNormalAnnouncement(MSG_HELP.PASSWORD_DESCRIPTION, 0, playerId);
      this.sendBlankLine(playerId);

      this.sendBoldAnnouncement(MSG_HELP.OTHER_COMMANDS, 0, playerId);
      this.sendBlankLine(playerId);
    }

    this.sendBoldAnnouncement(MSG_HELP.SCORE, 0, playerId);
    this.sendNormalAnnouncement(MSG_HELP.SCORE_DESCRIPTION, 0, playerId);

    this.sendNormalAnnouncement(MSG_HELP.BALL_DESCRIPTION, 0, playerId);
    this.sendNormalAnnouncement(MSG_HELP.KICKER_DESCRIPTION, 0, playerId);
    this.sendNormalAnnouncement(MSG_HELP.GOALKEEPER_DESCRIPTION, 0, playerId);

    this.sendBoldAnnouncement(MSG_HELP.RULES, 0, playerId);
    this.sendNormalAnnouncement(MSG_HELP.RULES_DESCRIPTION, 0, playerId);

    this.sendBoldAnnouncement(MSG_HELP.LINKS, 0, playerId);
    this.sendNormalAnnouncement(MSG_HELP.LINKS_DESCRIPTION, 0, playerId);

    if (!playerId) {
      this.sendBoldAnnouncement(MSG_HELP.HELP, 0, playerId);
      this.sendNormalAnnouncement(MSG_HELP.HELP_DESCRIPTION, 0, playerId);
    }

    this.sendBlankLine(playerId);
  }

  public sendConversionHelp(playerId?: number): void {
    this.sendNormalAnnouncement(MSG_HELP.BALL_DESCRIPTION, 0, playerId);
    this.sendNormalAnnouncement(MSG_HELP.KICKER_DESCRIPTION, 0, playerId);
    this.sendNormalAnnouncement(MSG_HELP.GOALKEEPER_DESCRIPTION, 0, playerId);
    this.sendBlankLine(playerId);
  }

  public announceBlockedAirKick(kickerId: number, blockerId: number): void {
    const players = this.room.getPlayerList();
    const kicker = this.room.getPlayer(kickerId);
    const blocker = this.room.getPlayer(blockerId);

    if (!kicker || !blocker) {
      return;
    }

    players.forEach((player) => {
      if (kickerId === blockerId) {
        return;
      }

      if (player.id === kickerId) {
        this.sendBoldAnnouncement(
          `🦵 🏉   🚫   Seu Chute Aéreo foi bloqueado por ${blocker.name}!`,
          0,
          player.id,
        );
        this.sendNormalAnnouncement(
          'Use o comando `a` para ativar/desativar seu Chute Aéreo.',
          0,
          player.id,
        );
      } else if (player.id === blockerId) {
        this.sendBoldAnnouncement(
          `🦵 🏉   🚫   Você bloqueou o Chute Aéreo de ${kicker.name}!   🙌`,
          0,
          player.id,
        );
      } else {
        const kickerTeam = this.gameService.teams.getTeamByTeamID(kicker.team);
        if (kickerId !== blockerId && kickerTeam) {
          this.sendBoldAnnouncement(
            `🦵 🏉   🚫   ${kicker.name} (${kickerTeam.name}) tentou um Chute Aéreo, mas foi bloqueado por ${blocker.name}!   🙌`,
            0,
            player.id,
          );
        }
      }
    });
  }

  public announceSuccessfulAirKick(kickerId: number): void {
    const players = this.room.getPlayerList();

    players.forEach((player) => {
      if (player.id === kickerId) {
        this.sendBoldAnnouncement(
          `🦵 🏉   ✅   Você conectou um Chute Aéreo!   💨`,
          0,
          player.id,
          colors.airKickMessage,
        );
        // this.sendNormalAnnouncement(
        //   'Use o comando `a` para ativar/desativar seu Chute Aéreo.',
        //   0,
        //   player.id,
        //   colors.airKickMessage,
        // );
      } else {
        const kicker = this.room.getPlayer(kickerId);
        const kickerTeam = this.gameService.teams.getTeamByTeamID(kicker.team);

        if (kickerTeam) {
          this.sendBoldAnnouncement(
            `🦵 🏉   ✅   ${kicker.name} (${kickerTeam.name}) conectou um Chute Aéreo!   💨`,
            0,
            player.id,
            colors.airKickMessage,
          );
        }
      }
    });
  }

  public sendPlayerConfigInfo(
    config: PlayerConfigEnum,
    isEnabled: boolean,
    playerId: number,
    sound: number = 0,
  ): void {
    const configName = PlayerConfigEnumExtension.getName(config);

    if (isEnabled) {
      this.sendBoldAnnouncement(`*** ${configName} ATIVADO! ***`, sound, playerId, colors.green);
    } else {
      this.sendBoldAnnouncement(`*** ${configName} DESATIVADO! ***`, sound, playerId, colors.red);
    }
  }

  public sendAllMessage(playerId: number, message: string): void {
    const msgPlayer = this.room.getPlayer(playerId);
    const teams = this.gameService.teams;
    const teamId = msgPlayer.team;

    // format message
    let formattedMsg: string;
    const team = teams.getTeamByTeamID(teamId);
    if (!team) {
      formattedMsg = `${msgPlayer.name}: ${message}`;
    } else {
      formattedMsg = `[${team.name.toUpperCase()} > all] ${msgPlayer.name}: ${message}`;
    }

    const msgColor = teams.getTeamMessageColor(undefined, teamId);

    const players = this.room.getPlayerList();
    let sound: number;
    players.forEach((player) => {
      if (player.team === TeamID.Spectators) {
        sound = 1;
      } else {
        if (msgPlayer.team === player.team) {
          sound = 1;
        } else {
          sound = 0;
        }
      }
      this.sendNormalAnnouncement(formattedMsg, sound, player.id, msgColor);
    });
  }

  public sendTeamMessage(playerId: number, message: string): void {
    const msgPlayer = this.room.getPlayer(playerId);
    const teams = this.gameService.teams;
    const teamId = msgPlayer.team;

    // format message
    let formattedMsg: string;
    const team = teams.getTeamByTeamID(teamId);
    if (!team) {
      return;
    } else {
      formattedMsg = `[${team.name.toUpperCase()} > team] ${msgPlayer.name}: ${message}`;
    }

    const msgColor = teams.getTeamMessageColor(undefined, teamId);

    const players = this.room.getPlayerList();
    players.forEach((player) => {
      if (player.team === teamId) {
        this.sendNormalAnnouncement(formattedMsg, 1, player.id, msgColor);
      }
    });

    // const playerTeam = this.gameService.teams.getTeamByTeamID(playerId);
    // const playetTeam = PlayerConfigEnumExtension;
  }
}
