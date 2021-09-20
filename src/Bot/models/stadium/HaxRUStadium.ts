import { IPosition } from 'inversihax';
import { BALL_RADIUS } from '../../constants/general';
import TeamEnum from '../../enums/TeamEnum';

interface IStadium {
  getIsGoal: (
    ballPosition: IPosition,
    ballXSpeed: number,
    lastBallPositionWhenTouched: IPosition
  ) => false | TeamEnum;
}

class HaxRUStadium implements IStadium {
  private _goalLineX: number;
  private _goalPostY: number;
  private _miniAreaDistance: number;

  // public get goalLineX(): number {
  //   return this._goalLineX;
  // }
  // public get goalPostY(): number {
  //   return this._goalPostY;
  // }

  constructor(goalLineX: number, goalPostY: number, miniAreaDistance: number) {
    this._goalLineX = goalLineX;
    this._goalPostY = goalPostY;
    this._miniAreaDistance = miniAreaDistance;
  }

  public getIsGoal(
    ballPosition: IPosition,
    ballXSpeed: number,
    lastBallPositionWhenTouched: IPosition
  ): false | TeamEnum {
    const distanceBetweenBallAndGoalLine =
      this._goalLineX - (Math.abs(lastBallPositionWhenTouched.x) + BALL_RADIUS);

    if (Math.abs(ballPosition.y) < this._goalPostY - BALL_RADIUS) {
      const goalEndX = this._goalLineX + 0.9 * BALL_RADIUS;

      if (ballPosition.x > this._goalLineX && ballPosition.x < goalEndX) {
        if (
          distanceBetweenBallAndGoalLine >= this._miniAreaDistance &&
          ballXSpeed > 0
        ) {
          return TeamEnum.TEAM_A;
        }
      } else if (
        ballPosition.x < -this._goalLineX &&
        ballPosition.x > -goalEndX
      ) {
        if (
          distanceBetweenBallAndGoalLine >= this._miniAreaDistance &&
          ballXSpeed < 0
        ) {
          return TeamEnum.TEAM_B;
        }
      }
    }
    return false;
  }
}

export default HaxRUStadium;
