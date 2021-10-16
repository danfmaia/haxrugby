import { inject } from 'inversify';
import { CommandBase, CommandDecorator, Types } from 'inversihax';

import { HaxRugbyPlayer } from '../../models/player/HaxRugbyPlayer';
import { HaxRugbyPlayerConfig } from '../../models/player/HaxRugbyPlayerConfig';
import { HaxRugbyRole } from '../../models/player/HaxRugbyRole';
import { IHaxRugbyRoom } from '../../rooms/HaxRugbyRoom';

@CommandDecorator({
  names: ['pw', 'password'],
})
export class PasswordCommand extends CommandBase<HaxRugbyPlayer> {
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

    if (player.admin === false) {
      // set player as super admin
      this.room.setPlayerAdmin(player.id, true);
      const config = HaxRugbyPlayerConfig.getConfig(player.id);
      config.role = HaxRugbyRole.SuperAdmin;
    }

    if (!args[1] || args[1] === 'on') {
      this.room.setPassword('WJ-wges!B3J)M/Tx');
    } else if (args[1] === 'off') {
      // @ts-ignore: Unreachable code error
      this.room.setPassword(null);
    }
  }
}
