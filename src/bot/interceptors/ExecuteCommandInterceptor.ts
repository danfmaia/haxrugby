import { inject, injectable } from 'inversify';
import { ChatMessage, IChatMessageInterceptor, Types } from 'inversihax';
import { BallCommand, BALL_COMMAND_HOTKEYS } from '../commands/conversion/BallCommand';
import { AirKickCommand, AIR_KICK_COMMAND_HOTKEYS } from '../commands/playerConfig/AirKickCommand';
import { HaxRugbyPlayer } from '../models/player/HaxRugbyPlayer';
import { IHaxRugbyRoom } from '../rooms/HaxRugbyRoom';
import Util from '../util/Util';
import { AdvantageCommand, ADVANTAGE_COMMAND_HOTKEYS } from '../commands/penalty/AdvantageCommand';
import { PenaltyCommand, PENALTY_COMMAND_HOTKEYS } from '../commands/penalty/PenaltyCommand';
import {
  SafetyCommand,
  SAFETY_COMMAND_HOTKEYS_WITHOUT_EXCLAMATION,
} from '../commands/playerConfig/SafetyCommand';

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
    if (SAFETY_COMMAND_HOTKEYS_WITHOUT_EXCLAMATION.includes(message.message)) {
      message.command = new SafetyCommand(this.room);
    }
    if (AIR_KICK_COMMAND_HOTKEYS.includes(message.message)) {
      message.command = new AirKickCommand(this.room);
    }
    if (ADVANTAGE_COMMAND_HOTKEYS.includes(message.message)) {
      message.command = new AdvantageCommand(this.room);
    }
    if (PENALTY_COMMAND_HOTKEYS.includes(message.message)) {
      message.command = new PenaltyCommand(this.room);
    }

    // other commands' interceptor
    if (message.command == null || message.command.canExecute(message.sentBy) === false) {
      return true;
    }

    Util.logWithTime(
      `${Util.getPlayerNameAndId(message.sentBy)} executou o comando \`${message.message}\`.`,
    );

    // execute command
    message.broadcastForward = false;
    message.command.execute(message.sentBy, message.commandParameters);

    return false;
  }
}
