import { inject, injectable } from 'inversify';
import { IBackgroundTask, Types } from 'inversihax';
import { ICustomRoom } from '../rooms/ICustomRoom';

@injectable()
export class InfoBackgroundTask implements IBackgroundTask {
  private readonly mRoom: ICustomRoom;

  public constructor(@inject(Types.IRoom) room: ICustomRoom) {
    this.mRoom = room;
  }

  public start(): void {
    setInterval(() => this.printInfo(), 30000);
  }

  public stop(): void {
    throw new Error('Method not implemented.');
  }

  private printInfo(): void {
    const players = this.mRoom.getPlayerList();

    let message = '';
    players.forEach((player) => (message += player.id));

    // this.mRoom.sendChat(`Is game in progress: ${this.mRoom.isGameInProgress}`);
    // this.mRoom.sendChat(message);
  }
}
