import { inject } from 'inversify';
import { CommandBase, CommandDecorator, Types } from 'inversihax';

import { CustomPlayer } from '../models/CustomPlayer';

import { smallConfig } from '../constants/config/smallConfig';
import { ISmallHaxRURoom } from '../Room/ISmallHaxRURoom';

@CommandDecorator({
  names: ['new-match', 'new']
})
export class NewMatchCommand extends CommandBase<CustomPlayer> {
  private readonly mRoom: ISmallHaxRURoom;

  public constructor(@inject(Types.IRoom) room: ISmallHaxRURoom) {
    super();

    this.mRoom = room;
  }

  public canExecute(player: CustomPlayer): boolean {
    return true;
  }

  public execute(player: CustomPlayer, args: string[]): void {
    this.mRoom.stopGame();
    this.mRoom.setTimeLimit(smallConfig.TIME_LIMIT);
    this.mRoom.setScoreLimit(smallConfig.SCORE_LIMIT);
    this.mRoom.startGame();

    this.mRoom.sendChat('');
    this.mRoom.sendChat(`${player.name} iniciou uma nova partida.`);
    this.mRoom.sendChat(`Duração: ${smallConfig.TIME_LIMIT} minutos`);
    this.mRoom.sendChat(`Limite de pontos: ${smallConfig.SCORE_LIMIT}`);
    this.mRoom.sendChat('');
  }
}
