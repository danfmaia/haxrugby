import { inject, injectable } from 'inversify';
import { ChatMessage, IChatMessageInterceptor, Types } from 'inversihax';
import { HaxRugbyPlayer } from '../models/player/HaxRugbyPlayer';
import { IHaxRugbyRoom } from '../rooms/HaxRugbyRoom';
import Util from '../util/Util';

@injectable()
export class FilterInterceptor implements IChatMessageInterceptor<ChatMessage<HaxRugbyPlayer>> {
  // private readonly room: IHaxRugbyRoom;

  public constructor(@inject(Types.IRoom) room: IHaxRugbyRoom) {
    // this.room = room;
  }

  intercept(message: ChatMessage<HaxRugbyPlayer>): boolean {
    if (Util.isUsingIllegalChars(message.message)) {
      message.broadcastForward = false;
      return false;
    }

    return true;
  }
}
