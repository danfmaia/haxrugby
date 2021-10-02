import PositionEnum from '../../enums/PositionEnum';
import { CustomPlayer } from '../../models/player/CustomPlayer';
import { IHaxRugbyRoom } from '../../rooms/HaxRugbyRoom';
import Util from '../../util/Util';
import { IChatService } from '../room/ChatService';
import { IGameService } from '../room/IGameService';

export interface ICommandService {
  setPlayerAsPosition(player: CustomPlayer, args: string[], position: PositionEnum): void;
}

class CommandService implements ICommandService {
  private static _singleton: CommandService;

  private room: IHaxRugbyRoom;
  private gameService: IGameService;
  private chatService: IChatService;

  constructor(room: IHaxRugbyRoom) {
    this.room = room;
    this.gameService = room.gameService;
    this.chatService = room.gameService.chatService;
  }

  public static getSingleton(room: IHaxRugbyRoom): CommandService {
    if (!this._singleton) {
      this._singleton = new this(room);
    }
    return this._singleton;
  }

  public setPlayerAsPosition(player: CustomPlayer, args: string[], position: PositionEnum): void {
    console.log('args[0]: ', args[0]);
    const args0 = args[0];

    const team = this.gameService.teams.getTeamByTeamID(player.team);
    if (!team) {
      return;
    }

    const currentPlayer = team.positions[position];
    const positionString = Util.getPositionString(position);

    if (args0 === 'me') {
      if (currentPlayer && currentPlayer.id === player.id) {
        this.chatService.sendNormalAnnouncement(
          `Você já é o ${positionString} do ${team.name}!`,
          0,
          player.id,
        );
      } else {
        this.gameService.roomUtil.setPlayerAsPosition(player, position);
      }
      return;
    }

    if (args0) {
      const selectedPlayerId: number | false = Util.parseNumericInput(args0, true);
      if (selectedPlayerId === false) {
        this.chatService.sendNormalAnnouncement('Jogador inválido!', 0, player.id);
        return;
      }
      const selectedPlayer = this.room.getPlayer(selectedPlayerId);
      if (selectedPlayer.team !== player.team) {
        this.chatService.sendNormalAnnouncement('Jogador inválido!', 0, player.id);
        return;
      }
      if (currentPlayer && currentPlayer.id === selectedPlayerId) {
        this.chatService.sendNormalAnnouncement(
          `${selectedPlayer.name} já é o ${positionString} do ${team.name}!`,
          0,
          player.id,
        );
      } else {
        this.gameService.roomUtil.setPlayerAsPosition(selectedPlayer, position);
      }
      return;
    }

    if (currentPlayer) {
      if (currentPlayer.id !== player.id) {
        this.chatService.sendNormalAnnouncement(
          `${currentPlayer.name} é o ${positionString} do ${team.name}.`,
          0,
          player.id,
        );
      } else {
        this.chatService.sendNormalAnnouncement(
          `Você é o ${positionString} do ${team.name}.`,
          0,
          player.id,
        );
      }
    } else {
      this.chatService.sendNormalAnnouncement(`O ${team.name} está sem ${positionString}!`);
      this.chatService.sendNormalAnnouncement(
        `O ${team.name} está sem ${positionString}! Use \`!gk me\` ou \`!gk <#jogador>\` para definir um ${positionString} para o time.`,
      );
    }
  }
}

export default CommandService;
