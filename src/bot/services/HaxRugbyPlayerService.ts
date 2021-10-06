import { injectable } from 'inversify';
import { IPlayerObject, IPlayerService } from 'inversihax';
import { HaxRugbyPlayer } from '../models/player/HaxRugbyPlayer';

@injectable()
export class HaxRugbyPlayerService implements IPlayerService<HaxRugbyPlayer> {
  public cast(player: IPlayerObject): HaxRugbyPlayer {
    if (player === null) {
      // @ts-ignore: Unreachable code error
      return;
    }

    return new HaxRugbyPlayer(
      player.id,
      player.name,
      player.team,
      player.admin,
      player.position,
      player.conn,
      player.auth,
    );
  }
}
