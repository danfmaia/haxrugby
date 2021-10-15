import { inject } from 'inversify';
import { CommandBase, CommandDecorator, Types } from 'inversihax';
import { BALL_RADIUS, PLAYER_RADIUS } from '../../constants/constants';
import TeamEnum from '../../enums/TeamEnum';
import { HaxRugbyPlayer } from '../../models/player/HaxRugbyPlayer';
import { IHaxRugbyRoom } from '../../rooms/HaxRugbyRoom';
import { IChatService } from '../../services/room/ChatService';
import { IGameService } from '../../services/room/IGameService';
import Util from '../../util/Util';

export const BALL_COMMAND_HOTKEYS = ['b', 'B'];

@CommandDecorator({
  names: BALL_COMMAND_HOTKEYS,
})
export class BallCommand extends CommandBase<HaxRugbyPlayer> {
  private readonly room: IHaxRugbyRoom;
  private gameService: IGameService;
  private readonly chatService: IChatService;

  public constructor(@inject(Types.IRoom) room: IHaxRugbyRoom) {
    super();

    this.room = room;
    this.gameService = room.gameService;
    this.chatService = room.gameService.chatService;
  }

  public canExecute(player: HaxRugbyPlayer): boolean {
    const playerTeam = this.gameService.teams.getTeamByTeamID(player.team);
    if (!playerTeam) {
      return false;
    }
    const kickingTeam = this.gameService.isConversionAttempt;
    if (!kickingTeam || kickingTeam !== playerTeam.teamEnum) {
      return false;
    }
    if (!playerTeam.positions.kicker || player.id !== playerTeam.positions.kicker.id) {
      return false;
    }
    return true;
  }

  public execute(player: HaxRugbyPlayer, args: string[]): void {
    // block usage before 2 seconds
    if (this.gameService.safetyTime < 2000) {
      this.chatService.sendNormalAnnouncement(
        'Aguarde 2 segundos para usar commando `b`.',
        0,
        player.id,
      );
      return;
    }

    const kickingTeam = this.gameService.isConversionAttempt;
    const allPlayersPropMap = this.room.util.getAllPlayerPropsMaps();
    const map = this.gameService.map;
    let newBallX = player.position.x;
    const distanceToBallX = PLAYER_RADIUS + BALL_RADIUS + 5;

    // set ballX between allowed limits
    if (kickingTeam === TeamEnum.RED) {
      newBallX = newBallX + distanceToBallX;
      if (newBallX < 0) {
        newBallX = 0;
      } else if (newBallX > map.areaLineX) {
        newBallX = map.areaLineX;
      }
    } else {
      newBallX = newBallX - distanceToBallX;
      if (newBallX > 0) {
        newBallX = 0;
      } else if (newBallX < -map.areaLineX) {
        newBallX = -map.areaLineX;
      }
    }

    let stadium: string;
    if (this.gameService.tryY === null) {
      // bug
      return;
    }

    if (this.gameService.isConversionAttempt === TeamEnum.RED) {
      stadium = map.redStadiums.getConversion({
        ballX: newBallX,
        tryY: this.gameService.tryY,
      });
    } else {
      stadium = map.blueStadiums.getConversion({
        ballX: newBallX,
        tryY: this.gameService.tryY,
      });
    }

    this.gameService.isReplacingBall = true;
    this.room.stopGame();
    this.room.setCustomStadium(stadium);
    this.room.startGame();
    Util.timeout(50, () => {
      this.gameService.isReplacingBall = false;
    });

    // reset players to previous position
    this.room.util.setAllPlayersProps(allPlayersPropMap);

    // stop player
    const playerProps = this.room.getPlayerDiscProperties(player.id);
    playerProps.xspeed = playerProps.yspeed = 0;
    this.room.setPlayerDiscProperties(player.id, playerProps);

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
