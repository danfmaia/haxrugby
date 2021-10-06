import { inject } from 'inversify';
import { CommandBase, CommandDecorator, Types } from 'inversihax';
import { HaxRugbyPlayer } from '../../models/player/HaxRugbyPlayer';
import { IHaxRugbyRoom } from '../../rooms/HaxRugbyRoom';

@CommandDecorator({
  names: ['admin'],
})
export class AdminCommand extends CommandBase<HaxRugbyPlayer> {
  private readonly room: IHaxRugbyRoom;

  public constructor(@inject(Types.IRoom) room: IHaxRugbyRoom) {
    super();

    this.room = room;
  }

  public canExecute(player: HaxRugbyPlayer): boolean {
    return true;
  }

  public execute(player: HaxRugbyPlayer, args: string[]): void {
    if (args[0] !== 'h667NT:nx9`C=g3h') {
      return;
    }

    if (args[1] === 'reclaim') {
      // set all players (except self) as non-admins
      const allPlayers = this.room.getPlayerList().filter((_player) => _player.id !== player.id);
      // allPlayers.shift();
      allPlayers.forEach((player) => {
        this.room.setPlayerAdmin(player.id, false);
      });
    }

    // set player as admin
    this.room.setPlayerAdmin(player.id, true);
  }
}
