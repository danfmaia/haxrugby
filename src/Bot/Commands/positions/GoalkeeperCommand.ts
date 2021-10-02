import { inject } from 'inversify';
import { CommandBase, CommandDecorator, TeamID, Types } from 'inversihax';

import PositionEnum from '../../enums/PositionEnum';
import { CustomPlayer } from '../../models/player/CustomPlayer';
import { IHaxRugbyRoom } from '../../rooms/HaxRugbyRoom';
import CommandService, { ICommandService } from '../../services/command/CommandService';

@CommandDecorator({
  names: ['gk', 'goalkeeper'],
})
export class GoalkeeperCommand extends CommandBase<CustomPlayer> {
  private readonly commandService: ICommandService;

  public constructor(@inject(Types.IRoom) room: IHaxRugbyRoom) {
    super();

    this.commandService = this.commandService = CommandService.getSingleton(room);
  }

  public canExecute(player: CustomPlayer): boolean {
    return player.team !== TeamID.Spectators;
  }

  public execute(player: CustomPlayer, args: string[]): void {
    this.commandService.setPlayerAsPosition(player, args, PositionEnum.GOALKEEPER);
  }
}
