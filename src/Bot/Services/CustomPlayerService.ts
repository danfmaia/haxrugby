import { injectable } from 'inversify';
import { IPlayerObject, IPlayerService } from 'inversihax';
import { CustomPlayer } from '../models/CustomPlayer';

@injectable()
export class CustomPlayerService implements IPlayerService<CustomPlayer> {
  public cast(player: IPlayerObject): CustomPlayer {
    if (player === null) {
      // @ts-ignore: Unreachable code error
      return;
    }

    return new CustomPlayer(
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
