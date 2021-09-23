import { inject } from 'inversify';
import { CommandBase, CommandDecorator, Types } from 'inversihax';

import { CustomPlayer } from '../models/CustomPlayer';

import smallConfig from '../constants/config/smallConfig';
import Util from '../util/Util';
import { IHaxRugbyRoom } from '../rooms/HaxRugbyRoom';
import RoomGame, { IRoomGame } from '../services/room/RoomGame';

@CommandDecorator({
  names: ['new', 'new-match'],
})
export class NewMatchCommand extends CommandBase<CustomPlayer> {
  private readonly _room: IHaxRugbyRoom;
  private readonly _roomGame: IRoomGame;

  public constructor(@inject(Types.IRoom) room: IHaxRugbyRoom) {
    super();

    this._room = room;
    this._roomGame = new RoomGame(room);
  }

  public canExecute(player: CustomPlayer): boolean {
    return true;
  }

  public execute(player: CustomPlayer, args: string[]): void {
    if (!player.admin) {
      return;
    }

    const callback = () => {
      const matchConfig = smallConfig;

      const timeLimit = Util.validatePositiveNumericInput(args[0]);
      if (timeLimit) {
        matchConfig.timeLimit = timeLimit;
      }

      const scoreLimit = Util.validatePositiveNumericInput(args[1]);
      if (scoreLimit) {
        matchConfig.scoreLimit = scoreLimit;
      }

      this._room.matchConfig = matchConfig;
      this._room.setTimeLimit(matchConfig.timeLimit);
      this._room.setScoreLimit(matchConfig.scoreLimit);
      Util.timeout(1500, () => this._roomGame.initializeMatch(player));
    };

    if (this._room.isMatchInProgress) {
      this._roomGame.cancelMatch(player, callback);
    } else {
      callback();
    }
  }
}
