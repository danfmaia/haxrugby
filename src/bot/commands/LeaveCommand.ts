import { inject } from 'inversify';
import { CommandBase, CommandDecorator, Types } from 'inversihax';
import { CustomPlayer } from '../models/player/CustomPlayer';
import { IHaxRugbyRoom } from '../rooms/HaxRugbyRoom';
import Util from '../util/Util';

@CommandDecorator({
  names: ['bb', 'leave', 'sair'],
})
export class LeaveCommand extends CommandBase<CustomPlayer> {
  private readonly room: IHaxRugbyRoom;

  public constructor(@inject(Types.IRoom) room: IHaxRugbyRoom) {
    super();

    this.room = room;
  }

  public canExecute(player: CustomPlayer): boolean {
    return true;
  }

  public execute(player: CustomPlayer, args: string[]): void {
    this.room.kickPlayer(player.id, '!bb', false);
    console.log(`${Util.getPlayerNameAndId(player)} saiu da sala através do comando !bb.`);
  }
}
