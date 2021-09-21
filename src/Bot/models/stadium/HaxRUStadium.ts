import { IPosition } from 'inversihax';
import { BALL_RADIUS } from '../../constants/general';
import TeamEnum from '../../enums/TeamEnum';
import Physics from '../../util/Physics';

interface IHaxRUStadium {
  kickoffLineX: number;

  getIsGoal(
    ballPosition: IPosition,
    ballXSpeed: number,
    lastBallPositionWhenTouched: IPosition,
  ): false | TeamEnum;
}

class HaxRUStadium implements IHaxRUStadium {
  private _goalLineX: number;
  private _goalPostY: number;
  private _miniAreaX: number;
  private _kickoffLineX: number;

  public get kickoffLineX(): number {
    return this._kickoffLineX;
  }

  constructor(goalLineX: number, goalPostY: number, miniAreaX: number, kickoffLineX: number) {
    this._goalLineX = goalLineX;
    this._goalPostY = goalPostY;
    this._miniAreaX = miniAreaX;
    this._kickoffLineX = kickoffLineX;
  }

  public getIsGoal(
    ballPosition: IPosition,
    ballXSpeed: number,
    lastBallPositionWhenTouched: IPosition,
  ): false | TeamEnum {
    const distanceBetweenBallAndGoalLine =
      this._goalLineX - (Math.abs(lastBallPositionWhenTouched.x) + BALL_RADIUS);

    if (Math.abs(ballPosition.y) < this._goalPostY - BALL_RADIUS) {
      const goalEndX = this._goalLineX + 0.9 * BALL_RADIUS;

      if (
        this.getIsBallInsideGoalInXAxis(TeamEnum.TEAM_A, ballPosition, goalEndX) &&
        ballXSpeed > 0
      ) {
        if (distanceBetweenBallAndGoalLine > this._miniAreaX) {
          return TeamEnum.TEAM_A;
        }
      } else if (
        this.getIsBallInsideGoalInXAxis(TeamEnum.TEAM_B, ballPosition, goalEndX) &&
        ballXSpeed < 0
      ) {
        if (distanceBetweenBallAndGoalLine > this._miniAreaX) {
          return TeamEnum.TEAM_B;
        }
      }
    }
    return false;
  }

  private getIsBallInsideGoalInXAxis(
    team: TeamEnum,
    ballPosition: IPosition,
    goalEndX: number,
  ): boolean {
    if (team === TeamEnum.TEAM_A) {
      return ballPosition.x > this._goalLineX && ballPosition.x < goalEndX;
    }
    return ballPosition.x < -this._goalLineX && ballPosition.x > -goalEndX;
  }

  // private isBallAfterMiniAreaXButOutsideMiniArea(
  //   team: TeamEnum,
  //   distanceBetweenBallAndGoalLine: number,
  //   ballPosition: IPosition,
  // ): boolean {
  //   const distanceBetweenBallAndClosestGoalPost = Physics.calcDistanceBetweenPositions(
  //     ballPosition,
  //     this.getClosestGoalPostPosition(ballPosition),
  //   );

  //   if (team === TeamEnum.TEAM_A) {
  //     if (distanceBetweenBallAndGoalLine < this._miniAreaX) {
  //       if (ballPosition.y > 0 && distanceBetweenBallAndClosestGoalPost > this._miniAreaX) {
  //         return true;
  //       }
  //     }
  //   }
  // }

  private getClosestGoalPostPosition(position: IPosition): IPosition {
    const xSign = Math.sign(position.x);
    const ySign = Math.sign(position.y);

    return { x: xSign * this._goalLineX, y: ySign * this._goalPostY };
  }
}

export default HaxRUStadium;
