import { IPosition, Player, TeamID } from 'inversihax';

export class HaxRugbyPlayer extends Player {
  constructor(
    id: number,
    name: string,
    team: TeamID,
    admin: boolean,
    position: IPosition,
    conn: string,
    auth: string,
  ) {
    super(id, name, team, admin, position, conn, auth);
  }
}
