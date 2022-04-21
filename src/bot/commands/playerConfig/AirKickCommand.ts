import { inject } from 'inversify';
import { CommandBase, CommandDecorator, Types } from 'inversihax';
import PlayerConfigEnum from '../../enums/PlayerConfigEnum';

import { HaxRugbyPlayer } from '../../models/player/HaxRugbyPlayer';
import { HaxRugbyPlayerConfig } from '../../models/player/HaxRugbyPlayerConfig';
import { IHaxRugbyRoom } from '../../rooms/HaxRugbyRoom';
import { IChatService } from '../../services/room/ChatService';

export const AIR_KICK_COMMAND_HOTKEYS = ['a', 'A'];

@CommandDecorator({
  names: AIR_KICK_COMMAND_HOTKEYS,
})
export class AirKickCommand extends CommandBase<HaxRugbyPlayer> {
  // private readonly room: IHaxRugbyRoom;
  private readonly chatService: IChatService;

  public constructor(@inject(Types.IRoom) room: IHaxRugbyRoom) {
    super();

    // this.room = room;
    this.chatService = room.gameService.chatService;
  }

  public canExecute(player: HaxRugbyPlayer): boolean {
    return true;
  }

  public execute(player: HaxRugbyPlayer, args: string[]): void {
    const playerConfig = HaxRugbyPlayerConfig.getConfig(player.id);
    playerConfig.isAirKickEnabled = !playerConfig.isAirKickEnabled;

    this.chatService.sendPlayerConfigInfo(
      PlayerConfigEnum.AIR_KICK,
      playerConfig.isAirKickEnabled,
      player.id,
      2,
    );
  }
}
