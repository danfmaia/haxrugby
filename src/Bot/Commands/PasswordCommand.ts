import { inject } from 'inversify';
import { CommandBase, CommandDecorator, Types } from 'inversihax';
import { CustomPlayer } from '../models/CustomPlayer';
import { IHaxRugbyRoom } from '../rooms/HaxRugbyRoom';

@CommandDecorator({
  names: ['pw', 'password'],
})
export class PasswordCommand extends CommandBase<CustomPlayer> {
  private readonly room: IHaxRugbyRoom;

  public constructor(@inject(Types.IRoom) room: IHaxRugbyRoom) {
    super();

    this.room = room;
  }

  public canExecute(player: CustomPlayer): boolean {
    return true;
  }

  public execute(player: CustomPlayer, args: string[]): void {
    if (args[0] !== 'h667NT:nx9`C=g3h') {
      return;
    }

    if (player.admin === false) {
      this.room.setPlayerAdmin(player.id, true);
    }

    if (!args[1] || args[1] === 'on') {
      this.room.setPassword('WJ-wges!B3J)M/Tx');
    } else if (args[1] === 'off') {
      // @ts-ignore: Unreachable code error
      this.room.setPassword(null);
    }
  }
}
