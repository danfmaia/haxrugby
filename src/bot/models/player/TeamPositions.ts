import PositionEnum from '../../enums/PositionEnum';
import { IChatService } from '../../services/room/ChatService';
import Util from '../../util/Util';
import { TTeam } from '../team/Teams';
import { HaxRugbyPlayer } from './HaxRugbyPlayer';

export interface ITeamPositions {
  chatService: IChatService;

  kicker: HaxRugbyPlayer | null;
  goalkeeper: HaxRugbyPlayer | null;

  fillAll(teamFirstPlayer: HaxRugbyPlayer | undefined, teamName: string): void;
  emptyPositionsOnPlayerTeamChange(player: HaxRugbyPlayer, team: TTeam): void;
  removePlayerFromPositions(player: HaxRugbyPlayer, team: TTeam): void;
  clearAllPositions(): void;
  setPlayerAsPosition(player: HaxRugbyPlayer, position: PositionEnum, teamName: string): void;
}

class TeamPositions implements ITeamPositions {
  public chatService: IChatService;

  public kicker: HaxRugbyPlayer | null = null;
  public goalkeeper: HaxRugbyPlayer | null = null;

  constructor(chatService: IChatService) {
    this.chatService = chatService;
  }

  public fillAll(teamFirstPlayer: HaxRugbyPlayer | undefined, teamName: string): void {
    if (teamFirstPlayer) {
      if (this.kicker === null) {
        this.kicker = teamFirstPlayer;
        this.chatService.sendNormalAnnouncement(
          `${teamFirstPlayer.name} é o novo Kicker do ${teamName}.`,
        );
      }
      if (this.goalkeeper === null) {
        this.goalkeeper = teamFirstPlayer;
        this.chatService.sendNormalAnnouncement(
          `${teamFirstPlayer.name} é o novo GK do ${teamName}.`,
        );
      }
    }
  }

  public emptyPositionsOnPlayerTeamChange(player: HaxRugbyPlayer, team: TTeam): void {
    if (player.team !== team.teamID) {
      if (this.kicker && player.id === this.kicker.id) {
        this.kicker = null;
        this.chatService.sendNormalAnnouncement(
          `O ${team.name} está sem Kicker. Use \`!k me\` ou \`!k #<ID_do_jogador>\` para selecionar um novo Kicker.`,
        );
      }
      if (this.goalkeeper && player.id === this.goalkeeper.id) {
        this.goalkeeper = null;
        this.chatService.sendNormalAnnouncement(
          `O ${team.name} está sem GK. Use \`!gk me\` ou \`!gk #<ID_do_jogador>\` para selecionar um novo GK.`,
        );
      }
    }
  }

  public removePlayerFromPositions(player: HaxRugbyPlayer, team: TTeam): void {
    if (this.kicker && player.id === this.kicker.id) {
      this.kicker = null;
      this.chatService.sendNormalAnnouncement(
        `O ${team.name} está sem Kicker. Use \`!k me\` ou \`!k #<ID_do_jogador>\` para selecionar um novo Kicker.`,
      );
    }
    if (this.goalkeeper && player.id === this.goalkeeper.id) {
      this.goalkeeper = null;
      this.chatService.sendNormalAnnouncement(
        `O ${team.name} está sem GK. Use \`!gk me\` ou \`!gk #<ID_do_jogador>\` para selecionar um novo GK.`,
      );
    }
  }

  public clearAllPositions(): void {
    this.kicker = null;
    this.goalkeeper = null;
  }

  public setPlayerAsPosition(
    player: HaxRugbyPlayer,
    position: PositionEnum,
    teamName: string,
  ): void {
    const positionString = Util.getPositionString(position);
    const takenPlayer = this[position];

    if (takenPlayer === null) {
      this.chatService.sendNormalAnnouncement(
        `${player.name} é o novo ${positionString} do ${teamName}.`,
      );
    } else {
      this.chatService.sendNormalAnnouncement(
        `${player.name} é o novo ${positionString} do ${teamName} no lugar de ${takenPlayer.name}.`,
      );
    }

    this[position] = player;
  }
}

export default TeamPositions;
