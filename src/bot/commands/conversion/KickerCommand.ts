import { inject } from 'inversify';
import { CommandBase, CommandDecorator, TeamID, Types } from 'inversihax';

import PositionEnum from '../../enums/PositionEnum';
import { HaxRugbyPlayer } from '../../models/player/HaxRugbyPlayer';
import { IHaxRugbyRoom } from '../../rooms/HaxRugbyRoom';
import CommandService, { ICommandService } from '../../services/CommandService';

@CommandDecorator({
  names: ['k', 'K', 'kicker'],
})
export class KickerCommand extends CommandBase<HaxRugbyPlayer> {
  private readonly commandService: ICommandService;

  public constructor(@inject(Types.IRoom) room: IHaxRugbyRoom) {
    super();

    this.commandService = CommandService.getSingleton(room);
  }

  public canExecute(player: HaxRugbyPlayer): boolean {
    return true;
  }

  public execute(player: HaxRugbyPlayer, args: string[]): void {
    if (player.team === TeamID.Spectators) {
      return;
    }

    this.commandService.setPlayerAsPosition(player, args, PositionEnum.KICKER);
  }
}
