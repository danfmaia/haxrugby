import { inject } from 'inversify';
import { CommandBase, CommandDecorator, Types } from 'inversihax';

import { HaxRugbyPlayer } from '../../models/player/HaxRugbyPlayer';
import { IHaxRugbyRoom } from '../../rooms/HaxRugbyRoom';
import { IGameService } from '../../services/room/IGameService';

export const ADVANTAGE_COMMAND_HOTKEYS = ['v'];

@CommandDecorator({
  names: ADVANTAGE_COMMAND_HOTKEYS,
})
export class AdvantageCommand extends CommandBase<HaxRugbyPlayer> {
  // private readonly room: IHaxRugbyRoom;
  private gameService: IGameService;

  public constructor(@inject(Types.IRoom) room: IHaxRugbyRoom) {
    super();

    // this.room = room;
    this.gameService = room.gameService;
  }

  public canExecute(player: HaxRugbyPlayer): boolean {
    const playerTeam = this.gameService.teams.getTeamByTeamID(player.team);
    if (!playerTeam) {
      return false;
    }
    if (this.gameService.isPenalty !== playerTeam.teamEnum) {
      return false;
    }
    return true;
  }

  public execute(player: HaxRugbyPlayer, args: string[]): void {
    this.gameService.isPenalty = false;
    this.gameService.util.clearAllAheadPlayers();
  }
}
