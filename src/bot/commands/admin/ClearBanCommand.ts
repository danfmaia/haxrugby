import { inject } from 'inversify';
import { CommandBase, CommandDecorator, Types } from 'inversihax';
import { CustomPlayer } from '../../models/player/CustomPlayer';
import { IHaxRugbyRoom } from '../../rooms/HaxRugbyRoom';
import Util from '../../util/Util';

@CommandDecorator({
  names: ['clearban'],
})
export class ClearBanCommand extends CommandBase<CustomPlayer> {
  private readonly room: IHaxRugbyRoom;

  public constructor(@inject(Types.IRoom) room: IHaxRugbyRoom) {
    super();

    this.room = room;
  }

  public canExecute(player: CustomPlayer): boolean {
    return player.admin;
  }

  public execute(player: CustomPlayer, args: string[]): void {
    const playerNameAndId = Util.getPlayerNameAndId(player);

    if (args[0] === 'all') {
      this.room.clearBans();
      console.log(`${playerNameAndId} tirou o ban de todos os jogadores.`);
      return;
    }

    const kickedId = Util.parseNumericInput(args[0]);
    if (kickedId) {
      this.room.clearBan(kickedId);
      console.log(`${playerNameAndId} tirou o ban do jogador com ID ${kickedId}`);
    }

    this.room.clearBans();
  }
}
