import { inject, injectable } from 'inversify';
import { ChatMessage, IChatMessageInterceptor, Types } from 'inversihax';
import { BallCommand } from '../commands/conversion/BallCommand';
import { CustomPlayer } from '../models/player/CustomPlayer';
import { IHaxRugbyRoom } from '../rooms/HaxRugbyRoom';
import Util from '../util/Util';

@injectable()
export class ExecuteCommandInterceptor
  implements IChatMessageInterceptor<ChatMessage<CustomPlayer>>
{
  private readonly room: IHaxRugbyRoom;

  public constructor(@inject(Types.IRoom) room: IHaxRugbyRoom) {
    this.room = room;
  }

  intercept(message: ChatMessage<CustomPlayer>): boolean {
    // BallCommand's interceptor
    if (['b', 'B'].includes(message.message)) {
      message.command = new BallCommand(this.room);
    }

    // other commands' interceptor
    if (message.command == null || !message.command.canExecute(message.sentBy)) {
      return true;
    }

    // execute command
    message.broadcastForward = false;
    message.command.execute(message.sentBy, message.commandParameters);

    console.log(
      `${Util.getPlayerNameAndId(message.sentBy)} executou o comando \`${message.message}\`.`,
    );

    return false;
  }
}
