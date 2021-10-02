import { inject } from 'inversify';
import { CommandBase, CommandDecorator, Types } from 'inversihax';
import { BALL_RADIUS, PLAYER_RADIUS } from '../../constants/constants';
import TeamEnum from '../../enums/TeamEnum';
import { CustomPlayer } from '../../models/player/CustomPlayer';
import { IHaxRugbyRoom } from '../../rooms/HaxRugbyRoom';
import { IChatService } from '../../services/room/ChatService';
import { IGameService } from '../../services/room/IGameService';
import Util from '../../util/Util';

@CommandDecorator({
  names: ['b', 'ball', 'bola', 'pl', 'place'],
})
export class PlaceBallCommand extends CommandBase<CustomPlayer> {
  private readonly room: IHaxRugbyRoom;
  private gameService: IGameService;
  private readonly chatService: IChatService;

  public constructor(@inject(Types.IRoom) room: IHaxRugbyRoom) {
    super();

    this.room = room;
    this.gameService = room.gameService;
    this.chatService = room.gameService.chatService;
  }

  public canExecute(player: CustomPlayer): boolean {
    return true;
  }

  public execute(player: CustomPlayer, args: string[]): void {
    // validate if player can execute
    const playerTeam = this.gameService.teams.getTeamByTeamID(player.team);
    if (!playerTeam) {
      return;
    }
    const kickingTeam = this.gameService.isConversionAttempt;
    if (!kickingTeam || kickingTeam !== playerTeam.teamEnum) {
      return;
    }
    if (!playerTeam.positions.kicker || player.id !== playerTeam.positions.kicker.id) {
      return;
    }

    const allPlayersPropMap = this.gameService.roomUtil.getAllPlayerPropsMaps();

    const stadium = this.gameService.stadium;
    let newBallX = player.position.x;
    const distanceToBallX = PLAYER_RADIUS + BALL_RADIUS + 5;

    // set ballX between allowed limits
    if (kickingTeam === TeamEnum.RED) {
      newBallX = newBallX + distanceToBallX;
      if (newBallX < 0) {
        newBallX = 0;
      } else if (newBallX > stadium.areaLineX) {
        newBallX = stadium.areaLineX;
      }
    } else {
      newBallX = newBallX - distanceToBallX;
      if (newBallX > 0) {
        newBallX = 0;
      } else if (newBallX < -stadium.areaLineX) {
        newBallX = -stadium.areaLineX;
      }
    }

    let map: string;
    if (this.gameService.tryY === null) {
      // bug
      return;
    }

    if (this.gameService.isConversionAttempt === TeamEnum.RED) {
      map = stadium.redMaps.getConversion(newBallX, this.gameService.tryY);
    } else {
      map = stadium.blueMaps.getConversion(-newBallX, this.gameService.tryY);
    }

    this.gameService.isReplacingBall = true;
    this.room.stopGame();
    this.room.setCustomStadium(map);
    this.room.startGame();
    Util.timeout(50, () => {
      this.gameService.isReplacingBall = false;
    });

    // reset players to previous position
    this.gameService.roomUtil.setAllPlayersProps(allPlayersPropMap);

    // place ball
    const updatedBallProps = this.room.getDiscProperties(0);
    updatedBallProps.x = newBallX;
    this.gameService.lastBallPosition = {
      x: updatedBallProps.x,
      y: updatedBallProps.y,
    };
    this.room.setDiscProperties(0, updatedBallProps);

    this.chatService.sendNormalAnnouncement(`${player.name} reposicionou a bola.`);
  }
}
