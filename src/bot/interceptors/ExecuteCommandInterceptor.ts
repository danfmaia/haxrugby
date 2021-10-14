import { inject, injectable } from 'inversify';
import { ChatMessage, IChatMessageInterceptor, Types } from 'inversihax';
import { BallCommand, BALL_COMMAND_HOTKEYS } from '../commands/conversion/BallCommand';
import { AirKickCommand, AIR_KICK_COMMAND_HOTKEYS } from '../commands/AirKickCommand';
import { HaxRugbyPlayer } from '../models/player/HaxRugbyPlayer';
import { IHaxRugbyRoom } from '../rooms/HaxRugbyRoom';
import Util from '../util/Util';

@injectable()
export class ExecuteCommandInterceptor
  implements IChatMessageInterceptor<ChatMessage<HaxRugbyPlayer>>
{
  private readonly room: IHaxRugbyRoom;

  public constructor(@inject(Types.IRoom) room: IHaxRugbyRoom) {
    this.room = room;
  }

  intercept(message: ChatMessage<HaxRugbyPlayer>): boolean {
    if (BALL_COMMAND_HOTKEYS.includes(message.message)) {
      message.command = new BallCommand(this.room);
    }
    if (AIR_KICK_COMMAND_HOTKEYS.includes(message.message)) {
      message.command = new AirKickCommand(this.room);
    }

    // other commands' interceptor
    if (message.command == null || !message.command.canExecute(message.sentBy)) {
      return true;
    }

    Util.logMessageWithTime(
      `${Util.getPlayerNameAndId(message.sentBy)} executou o comando \`${message.message}\`.`,
    );

    // execute command
    message.broadcastForward = false;
    message.command.execute(message.sentBy, message.commandParameters);

    return false;
  }
}
