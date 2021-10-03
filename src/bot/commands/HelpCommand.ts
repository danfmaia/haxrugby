import { inject } from 'inversify';
import { CommandBase, CommandDecorator, Types } from 'inversihax';
import { CustomPlayer } from '../models/player/CustomPlayer';
import { IHaxRugbyRoom } from '../rooms/HaxRugbyRoom';
import { IChatService } from '../services/room/ChatService';

@CommandDecorator({
  names: ['h', 'help', 'ajuda'],
})
export class HelpCommand extends CommandBase<CustomPlayer> {
  // private readonly room: IHaxRugbyRoom;
  private readonly chatService: IChatService;

  public constructor(@inject(Types.IRoom) room: IHaxRugbyRoom) {
    super();

    // this.room = room;
    this.chatService = room.gameService.chatService;
  }

  public canExecute(player: CustomPlayer): boolean {
    return true;
  }

  public execute(player: CustomPlayer, args: string[]): void {
    if (player.admin && args[0] === 'forall') {
      this.chatService.sendHelp(2);
    } else {
      this.chatService.sendHelp(0, player.id);
    }
  }
}
