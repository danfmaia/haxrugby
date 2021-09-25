import { IPosition } from 'inversihax';
import { IHaxRugbyRoom } from '../rooms/HaxRugbyRoom';
import { IGameService } from '../services/room/IGameService';

export class RoomUtil {
  room: IHaxRugbyRoom;
  gameService: IGameService;

  constructor(room: IHaxRugbyRoom, gameService: IGameService) {
    this.room = room;
    this.gameService = gameService;
  }

  public countPlayersByTeam(playerIds: (number | null)[]) {
    const playerCount = {
      red: 0,
      blue: 0,
    };

    playerIds.forEach((playerId) => {
      if (playerId) {
        if (this.room.getPlayer(playerId).team === 1) {
          playerCount.red = playerCount.red + 1;
        } else if (this.room.getPlayer(playerId).team === 2) {
          playerCount.blue = playerCount.blue + 1;
        }
      }
    });

    return playerCount;
  }

  public getCanLosingTeamTieOrTurn(ballPosition: IPosition): boolean {
    const blueMinusRed = this.gameService.score.blue - this.gameService.score.red;

    return (
      (-blueMinusRed <= 7 &&
        -blueMinusRed > 0 &&
        ballPosition.x < -this.gameService.stadium.kickoffLineX) ||
      (blueMinusRed <= 7 &&
        blueMinusRed > 0 &&
        ballPosition.x > this.gameService.stadium.kickoffLineX)
    );
  }
}
