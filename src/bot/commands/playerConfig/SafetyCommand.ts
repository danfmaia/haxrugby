import { inject } from 'inversify';
import { CommandBase, CommandDecorator, Types } from 'inversihax';
import PlayerConfigEnum from '../../enums/PlayerConfigEnum';

import { HaxRugbyPlayer } from '../../models/player/HaxRugbyPlayer';
import { HaxRugbyPlayerConfig } from '../../models/player/HaxRugbyPlayerConfig';
import { IHaxRugbyRoom } from '../../rooms/HaxRugbyRoom';
import { IChatService } from '../../services/room/ChatService';

export const SAFETY_COMMAND_HOTKEYS_WITHOUT_EXCLAMATION = ['z', 'Z'];
const SAFETY_COMMAND_HOTKEYS_WITH_EXCLAMATION = ['sf', 'SF', 'sF', 'Sf'];
const SAFETY_COMMAND_HOTKEYS = SAFETY_COMMAND_HOTKEYS_WITHOUT_EXCLAMATION.concat(
  SAFETY_COMMAND_HOTKEYS_WITH_EXCLAMATION,
);

@CommandDecorator({
  names: SAFETY_COMMAND_HOTKEYS,
})
export class SafetyCommand extends CommandBase<HaxRugbyPlayer> {
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
    playerConfig.isSafetyEnabled = !playerConfig.isSafetyEnabled;

    this.chatService.sendPlayerConfigInfo(
      PlayerConfigEnum.SAFETY,
      playerConfig.isSafetyEnabled,
      player.id,
      2,
    );
  }
}
