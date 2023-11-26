import { inject } from 'inversify';
import { CommandBase, CommandDecorator, Types } from 'inversihax';
import { HaxRugbyPlayer } from '../../models/player/HaxRugbyPlayer';
import { IHaxRugbyRoom } from '../../rooms/HaxRugbyRoom';
import { IChatService } from '../../services/room/ChatService';
import { HaxRugbyPlayerConfig } from '../../models/player/HaxRugbyPlayerConfig';
import PlayerConfigEnum from '../../enums/PlayerConfigEnum';

export const TOGGLE_TEAM_CHAT_COMMAND_HOTKEYS = ['team', 'teamchat', 'team-chat'];

@CommandDecorator({
  names: TOGGLE_TEAM_CHAT_COMMAND_HOTKEYS,
})
export class ToggleTeamChatCommand extends CommandBase<HaxRugbyPlayer> {
  private readonly chatService: IChatService;

  public constructor(@inject(Types.IRoom) room: IHaxRugbyRoom) {
    super();
    this.chatService = room.gameService.chatService;
  }

  public canExecute(player: HaxRugbyPlayer): boolean {
    return true;
  }

  public execute(player: HaxRugbyPlayer, args: string[]): void {
    const playerConfig = HaxRugbyPlayerConfig.getConfig(player.id);
    playerConfig.isTeamChatEnabled = !playerConfig.isTeamChatEnabled;

    this.chatService.sendPlayerConfigInfo(
      PlayerConfigEnum.TEAM_CHAT,
      playerConfig.isTeamChatEnabled,
      player.id,
      2,
    );
  }
}
