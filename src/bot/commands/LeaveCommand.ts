import { inject } from 'inversify';
import { CommandBase, CommandDecorator, Types } from 'inversihax';
import { HaxRugbyPlayer } from '../models/player/HaxRugbyPlayer';
import { IHaxRugbyRoom } from '../rooms/HaxRugbyRoom';
import Util from '../util/Util';

@CommandDecorator({
  names: ['bb', 'leave', 'sair'],
})
export class LeaveCommand extends CommandBase<HaxRugbyPlayer> {
  private readonly room: IHaxRugbyRoom;

  public constructor(@inject(Types.IRoom) room: IHaxRugbyRoom) {
    super();

    this.room = room;
  }

  public canExecute(player: HaxRugbyPlayer): boolean {
    return true;
  }

  public execute(player: HaxRugbyPlayer, args: string[]): void {
    this.room.kickPlayer(player.id, '!bb', false);
    Util.logMessageWithTime(
      `${Util.getPlayerNameAndId(player)} saiu da sala através do comando !bb.`,
    );
  }
}
