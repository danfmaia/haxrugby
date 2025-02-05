import { inject } from 'inversify';
import { CommandBase, CommandDecorator, Types } from 'inversihax';

import { HaxRugbyPlayer } from '../../models/player/HaxRugbyPlayer';
import Util from '../../util/Util';
import { IHaxRugbyRoom } from '../../rooms/HaxRugbyRoom';
import { IGameService } from '../../services/room/IGameService';
import { IChatService } from '../../services/room/ChatService';
import TeamEnum from '../../enums/TeamEnum';
import { MINUTE_IN_MS } from '../../constants/constants';

@CommandDecorator({
  names: ['set-score', 'ss'],
})
export class SetScoreCommand extends CommandBase<HaxRugbyPlayer> {
  private readonly room: IHaxRugbyRoom;
  private readonly gameService: IGameService;
  private readonly chatService: IChatService;

  public constructor(@inject(Types.IRoom) room: IHaxRugbyRoom) {
    super();

    this.room = room;
    this.gameService = room.gameService;
    this.chatService = room.gameService.chatService;
  }

  public canExecute(player: HaxRugbyPlayer): boolean {
    return player.admin;
  }

  public execute(player: HaxRugbyPlayer, args: string[]): void {
    const newRedScore = Util.parseNumericInput(args[0]);
    const newBlueScore = Util.parseNumericInput(args[1]);

    const tickCount = this.gameService.tickCount;
    const matchDuration = this.gameService.matchConfig.timeLimit;

    if (newRedScore === false) {
      this.chatService.sendNormalAnnouncement(
        'O argumento <pontos_do_red> é obrigatório.',
        0,
        player.id,
      );
      return;
    }
    if (newBlueScore === false) {
      this.chatService.sendNormalAnnouncement(
        'O argumento <pontos_do_blue> é obrigatório.',
        0,
        player.id,
      );
      return;
    }

    this.gameService.score.red = newRedScore;
    this.gameService.score.blue = newBlueScore;

    if (args[2]) {
      const teamArg = args[2].toUpperCase();
      if (teamArg === TeamEnum.RED) {
        this.room.setCustomStadium(
          this.gameService.map.redStadiums.getKickoff(tickCount, matchDuration),
        );
      } else if (teamArg === TeamEnum.BLUE) {
        this.room.setCustomStadium(
          this.gameService.map.blueStadiums.getKickoff(tickCount, matchDuration),
        );
      }
    }

    let hasChangedTime: boolean = false;

    if (args[3]) {
      const newRemainingTimeObj = args[3].split(':');
      const newRemainingMinutes = Util.parseNumericInput(newRemainingTimeObj[0]);
      const newRemainingSeconds = Util.parseNumericInput(newRemainingTimeObj[1]);

      if (newRemainingMinutes !== false && newRemainingSeconds !== false) {
        const newRemainingTime = newRemainingMinutes * MINUTE_IN_MS + newRemainingSeconds * 1000;

        if (newRemainingTime >= 1000) {
          this.gameService.remainingTime = newRemainingTime;
          hasChangedTime = true;
        }
      }
    }

    let message: string;
    if (hasChangedTime === false) {
      message = `${player.name} alterou o placar da partida.`;
    } else {
      message = `${player.name} alterou o placar e o tempo da partida.`;
    }

    this.chatService.sendBoldAnnouncement(message, 2);
    this.chatService.sendMatchStatus();
  }
}
