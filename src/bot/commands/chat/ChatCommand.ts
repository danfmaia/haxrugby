import { inject } from 'inversify';
import { CommandBase, CommandDecorator, Types } from 'inversihax';
import { HaxRugbyPlayer } from '../../models/player/HaxRugbyPlayer';
import { IHaxRugbyRoom } from '../../rooms/HaxRugbyRoom';
import { IGameService } from '../../services/room/IGameService';
import { HaxRugbyPlayerConfig } from '../../models/player/HaxRugbyPlayerConfig';
import { IChatService } from '../../services/room/ChatService';
import PlayerConfigEnum from '../../enums/PlayerConfigEnum';

export const CHAT_COMMAND_HOTKEYS = [';', ';;'];

@CommandDecorator({
  names: CHAT_COMMAND_HOTKEYS,
})
export class ChatCommand extends CommandBase<HaxRugbyPlayer> {
  private readonly gameService: IGameService;
  private readonly chatService: IChatService;
  private message: string;

  public constructor(@inject(Types.IRoom) room: IHaxRugbyRoom, message: string) {
    super();

    this.gameService = room.gameService;
    this.chatService = room.gameService.chatService;
    this.message = message;
  }

  public canExecute(player: HaxRugbyPlayer): boolean {
    return true;
  }

  public execute(player: HaxRugbyPlayer, args: string[]): void {
    const playerConfig = HaxRugbyPlayerConfig.getConfig(player.id);

    const firstTwoStrings = this.message.slice(0, 2);
    let pureMessage: string = '';

    if (firstTwoStrings === ';;') {
      // toggle team chat & send team message
      playerConfig.isTeamChatEnabled = !playerConfig.isTeamChatEnabled;
      this.chatService.sendPlayerConfigInfo(
        PlayerConfigEnum.TEAM_CHAT,
        playerConfig.isTeamChatEnabled,
        player.id,
        2,
      );
      // filter empty message
      pureMessage = this.message.slice(2);
      if (pureMessage.length === 0) {
        return;
      }
    } else {
      // prepare team message and filter empty message
      const firstString = this.message.slice(0, 1);
      if (firstString === ';') {
        pureMessage = this.message.slice(1);
        if (pureMessage.length === 0) {
          return;
        }
      } else {
        pureMessage = this.message;
        if (pureMessage.length === 0) {
          return;
        }
      }
    }

    if (playerConfig.isTeamChatEnabled === false) {
      // send all message
      this.gameService.chatService.sendAllMessage(player.id, pureMessage);
    } else {
      // send team message
      this.gameService.chatService.sendTeamMessage(player.id, pureMessage);
    }
  }
}
