import { inject } from 'inversify';
import { CommandBase, CommandDecorator, Types } from 'inversihax';
import PlayerConfigEnum from '../../enums/PlayerConfigEnum';

import { HaxRugbyPlayer } from '../../models/player/HaxRugbyPlayer';
import { HaxRugbyPlayerConfig } from '../../models/player/HaxRugbyPlayerConfig';
import { IHaxRugbyRoom } from '../../rooms/HaxRugbyRoom';
import { IChatService } from '../../services/room/ChatService';

export const CONFIG_COMMAND_HOTKEYS = ['c', 'conf', 'config', 'configs'];

@CommandDecorator({
  names: CONFIG_COMMAND_HOTKEYS,
})
export class ConfigCommand extends CommandBase<HaxRugbyPlayer> {
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

    this.chatService.sendPlayerConfigInfo(
      PlayerConfigEnum.SAFETY,
      playerConfig.isSafetyEnabled,
      player.id,
    );
    this.chatService.sendPlayerConfigInfo(
      PlayerConfigEnum.AIR_KICK,
      playerConfig.isAirKickEnabled,
      player.id,
    );
  }
}
