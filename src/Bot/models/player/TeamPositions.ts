import { IChatService } from '../../services/room/ChatService';
import { TTeam } from '../team/Team';
import { CustomPlayer } from './CustomPlayer';

export interface ITeamPositions {
  chatService: IChatService;

  kickerId: number | null;
  goalkeeperId: number | null;

  fillAll(teamFirstPlayer: CustomPlayer | undefined, teamName: string): void;
  clearPositionsOnPlayerTeamChange(player: CustomPlayer, team: TTeam): void;
  clearAllPositions(): void;
}

class TeamPositions implements ITeamPositions {
  public chatService: IChatService;

  public kickerId: number | null = null;
  public goalkeeperId: number | null = null;

  constructor(chatService: IChatService) {
    this.chatService = chatService;
  }

  public fillAll(teamFirstPlayer: CustomPlayer | undefined, teamName: string): void {
    console.log('PASSED 1');

    if (teamFirstPlayer) {
      console.log('PASSED 2');
      if (this.kickerId === null) {
        console.log('PASSED 3');
        this.kickerId = teamFirstPlayer.id;
        this.chatService.sendNormalAnnouncement(
          `${teamFirstPlayer.name} é o novo kicker do ${teamName}.`,
        );
      }
      if (this.goalkeeperId === null) {
        this.goalkeeperId = teamFirstPlayer.id;
        this.chatService.sendNormalAnnouncement(
          `${teamFirstPlayer.name} é o novo GK do ${teamName}.`,
        );
      }
    }

    console.log('kickerId: ', this.kickerId);
    console.log('goalkeeperId: ', this.goalkeeperId);
  }

  public clearPositionsOnPlayerTeamChange(player: CustomPlayer, team: TTeam): void {
    if (player.team !== team.teamID) {
      if (player.id === this.kickerId) {
        this.kickerId = null;
        this.chatService.sendNormalAnnouncement(
          `O ${team.name} está sem kicker. Use \`!k me\` ou \`!k @jogador\` para selecionar um novo kicker.`,
        );
      }
      if (player.id === this.goalkeeperId) {
        this.goalkeeperId = null;
        this.chatService.sendNormalAnnouncement(
          `O ${team.name} está sem GK. Use \`!gk me\` ou \`!gk @jogador\` para selecionar um novo GK.`,
        );
      }
    }
  }

  public clearAllPositions(): void {
    this.kickerId = null;
    this.goalkeeperId = null;
  }
}

export default TeamPositions;
