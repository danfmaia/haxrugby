import { IPosition } from 'inversihax';
import { BALL_RADIUS } from '../../constants/general';
import TeamEnum from '../../enums/TeamEnum';

interface IHaxRUStadium {
  kickoffLineX: number;

  getIsGoal(
    ballPosition: IPosition,
    ballXSpeed: number,
    lastBallPositionWhenTouched: IPosition
  ): false | TeamEnum;
  getIsBallBetweenKickoffLines(ballPosition: IPosition): boolean;
}

class HaxRUStadium implements IHaxRUStadium {
  private _goalLineX: number;
  private _goalPostY: number;
  private _miniAreaX: number;
  private _kickoffLineX: number;

  public get kickoffLineX(): number {
    return this._kickoffLineX;
  }

  constructor(
    goalLineX: number,
    goalPostY: number,
    miniAreaX: number,
    kickoffLineX: number
  ) {
    this._goalLineX = goalLineX;
    this._goalPostY = goalPostY;
    this._miniAreaX = miniAreaX;
    this._kickoffLineX = kickoffLineX;
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
          distanceBetweenBallAndGoalLine >= this._miniAreaX &&
          ballXSpeed > 0
        ) {
          return TeamEnum.TEAM_A;
        }
      } else if (
        ballPosition.x < -this._goalLineX &&
        ballPosition.x > -goalEndX
      ) {
        if (
          distanceBetweenBallAndGoalLine >= this._miniAreaX &&
          ballXSpeed < 0
        ) {
          return TeamEnum.TEAM_B;
        }
      }
    }
    return false;
  }

  public getIsBallBetweenKickoffLines(ballPosition: IPosition): boolean {
    return Math.abs(ballPosition.x) < this._kickoffLineX;
  }
}

export default HaxRUStadium;
