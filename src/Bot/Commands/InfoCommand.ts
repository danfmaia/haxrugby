import { inject } from 'inversify';
import { CommandBase, CommandDecorator, Types } from 'inversihax';
import { CustomPlayer } from '../models/CustomPlayer';
import { ICustomRoom } from '../rooms/ICustomRoom';

@CommandDecorator({
  names: ['info', 'i'],
})
export class InfoCommand extends CommandBase<CustomPlayer> {
  private readonly room: ICustomRoom;

  public constructor(@inject(Types.IRoom) room: ICustomRoom) {
    super();

    this.room = room;
  }

  public canExecute(player: CustomPlayer): boolean {
    return true;
  }

  public execute(player: CustomPlayer, args: string[]): void {
    this.room.sendChat('This is just a simple command that shows how to implement a command');
  }
}
