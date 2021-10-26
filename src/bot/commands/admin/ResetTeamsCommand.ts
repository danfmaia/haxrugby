import { inject } from 'inversify';
import { CommandBase, CommandDecorator, Types } from 'inversihax';
import { HaxRugbyPlayer } from '../../models/player/HaxRugbyPlayer';
import { IHaxRugbyRoom } from '../../rooms/HaxRugbyRoom';
import CommandService, { ICommandService } from '../../services/CommandService';
import { IGameService } from '../../services/room/IGameService';

@CommandDecorator({
  names: ['rr-teams', 'reset-teams'],
})
export class ResetTeamsCommand extends CommandBase<HaxRugbyPlayer> {
  // private readonly room: IHaxRugbyRoom;
  private readonly gameService: IGameService;
  private readonly service: ICommandService;

  public constructor(@inject(Types.IRoom) room: IHaxRugbyRoom) {
    super();

    // this.room = room;
    this.gameService = room.gameService;
    this.service = CommandService.getSingleton(room);
  }

  public canExecute(player: HaxRugbyPlayer): boolean {
    return player.admin;
  }

  public execute(player: HaxRugbyPlayer, args: string[]): void {
    if (this.service.requireSuperAdmin(player.id) === false) {
      return;
    }

    this.gameService.lastWinners = [];
    this.gameService.util.resetTeams();
  }
}
