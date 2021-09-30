import { IChatService } from '../../services/room/ChatService';
import { CustomPlayer } from './CustomPlayer';

export interface ITeamPositions {
  kicker: number | null;
  goalkeeper: number | null;

  fillAll(
    teamFirstPlayer: CustomPlayer | undefined,
    chatService: IChatService,
    teamName: string,
  ): void;
}

class TeamPositions implements ITeamPositions {
  public kicker: number | null = null;
  public goalkeeper: number | null = null;

  public fillAll(
    teamFirstPlayer: CustomPlayer | undefined,
    chatService: IChatService,
    teamName: string,
  ): void {
    if (teamFirstPlayer) {
      if (this.kicker === null) {
        this.kicker = teamFirstPlayer.id;
        chatService.sendNormalAnnouncement(
          `${teamFirstPlayer.name} é o novo kicker do ${teamName}.`,
        );
      }
      if (this.goalkeeper === null) {
        this.goalkeeper = teamFirstPlayer.id;
        chatService.sendNormalAnnouncement(`${teamFirstPlayer.name} é o novo GK do ${teamName}.`);
      }
    }
  }
}

export default TeamPositions;
