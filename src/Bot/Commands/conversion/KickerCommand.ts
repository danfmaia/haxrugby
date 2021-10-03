import { inject } from 'inversify';
import { CommandBase, CommandDecorator, TeamID, Types } from 'inversihax';

import PositionEnum from '../../enums/PositionEnum';
import { CustomPlayer } from '../../models/player/CustomPlayer';
import { IHaxRugbyRoom } from '../../rooms/HaxRugbyRoom';
import CommandService, { ICommandService } from '../../services/command/CommandService';

@CommandDecorator({
  names: ['k', 'kicker'],
})
export class KickerCommand extends CommandBase<CustomPlayer> {
  private readonly commandService: ICommandService;

  public constructor(@inject(Types.IRoom) room: IHaxRugbyRoom) {
    super();

    this.commandService = CommandService.getSingleton(room);
  }

  public canExecute(player: CustomPlayer): boolean {
    return true;
  }

  public execute(player: CustomPlayer, args: string[]): void {
    if (player.team === TeamID.Spectators) {
      return;
    }

    this.commandService.setPlayerAsPosition(player, args, PositionEnum.KICKER);
  }
}
