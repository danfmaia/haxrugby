import { inject } from 'inversify';
import { CommandBase, CommandDecorator, TeamID, Types } from 'inversihax';
import colors from '../constants/style/colors';

import { HaxRugbyPlayer } from '../models/player/HaxRugbyPlayer';
import { HaxRugbyPlayerConfig } from '../models/player/HaxRugbyPlayerConfig';
import { IHaxRugbyRoom } from '../rooms/HaxRugbyRoom';
import { IChatService } from '../services/room/ChatService';

export const AIR_KICK_COMMAND_HOTKEYS = [
  'a',
  'A',
  'l',
  'L',
  'p',
  'P',
  'd',
  'D',
  'z',
  'Z',
  'c',
  'C',
];

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
    return player.team !== TeamID.Spectators;
  }

  public execute(player: HaxRugbyPlayer, args: string[]): void {
    const playerConfig = HaxRugbyPlayerConfig.getConfig(player.id);
    playerConfig.isAirKickEnabled = !playerConfig.isAirKickEnabled;

    if (playerConfig.isAirKickEnabled) {
      this.chatService.sendBoldAnnouncement(
        '*** Chute Aéreo ATIVADO! ***',
        2,
        player.id,
        colors.green,
      );
    } else {
      this.chatService.sendBoldAnnouncement(
        '*** Chute Aéreo DESATIVADO! *** ',
        2,
        player.id,
        colors.red,
      );
    }
  }
}
