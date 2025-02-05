import { inject } from 'inversify';
import { CommandBase, CommandDecorator, Types } from 'inversihax';
import { HaxRugbyPlayer } from '../../models/player/HaxRugbyPlayer';
import { IHaxRugbyRoom } from '../../rooms/HaxRugbyRoom';
import CommandService, { ICommandService } from '../../services/CommandService';
import Util from '../../util/Util';

@CommandDecorator({
  names: ['clearban', 'clearbans'],
})
export class ClearBanCommand extends CommandBase<HaxRugbyPlayer> {
  private readonly room: IHaxRugbyRoom;
  private readonly service: ICommandService;

  public constructor(@inject(Types.IRoom) room: IHaxRugbyRoom) {
    super();

    this.room = room;
    this.service = CommandService.getSingleton(room);
  }

  public canExecute(player: HaxRugbyPlayer): boolean {
    return player.admin;
  }

  public execute(player: HaxRugbyPlayer, args: string[]): void {
    if (this.service.requireSuperAdmin(player.id) === false) {
      return;
    }

    const playerNameAndId = Util.getPlayerNameAndId(player);

    if (args[0] === 'all') {
      this.service.clearAllBans(playerNameAndId);
      return;
    }

    const kickedId = Util.parseNumericInput(args[0]);
    if (kickedId) {
      this.room.clearBan(kickedId);
      Util.logWithTime(`${playerNameAndId} tirou o ban do jogador com ID ${kickedId}`);
    }

    this.service.clearAllBans(playerNameAndId);
  }
}
