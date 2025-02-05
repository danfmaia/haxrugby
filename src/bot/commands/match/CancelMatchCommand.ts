import { inject } from 'inversify';
import { CommandBase, CommandDecorator, Types } from 'inversihax';

import { HaxRugbyPlayer } from '../../models/player/HaxRugbyPlayer';
import { IHaxRugbyRoom } from '../../rooms/HaxRugbyRoom';
import { IGameService } from '../../services/room/IGameService';

@CommandDecorator({
  names: ['cancel'],
})
export class CancelMatchCommand extends CommandBase<HaxRugbyPlayer> {
  // private readonly room: IHaxRugbyRoom;
  private readonly gameService: IGameService;

  public constructor(@inject(Types.IRoom) room: IHaxRugbyRoom) {
    super();

    // this.room = room;
    this.gameService = room.gameService;
  }

  public canExecute(player: HaxRugbyPlayer): boolean {
    return player.admin;
  }

  public execute(player: HaxRugbyPlayer, args: string[]): void {
    if (this.gameService.isMatchInProgress) {
      this.gameService.cancelMatch(player);
    }
  }
}
