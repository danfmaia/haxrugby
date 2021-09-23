import { IPosition } from 'inversihax';
import { BALL_RADIUS } from '../../constants/general';
import TeamEnum from '../../enums/TeamEnum';
import Physics from '../../util/Physics';

interface IHaxRugbyStadium {
  kickoffLineX: number;

  getIsGoal(
    ballPosition: IPosition,
    ballXSpeed: number,
    lastBallPositionWhenTouched: IPosition,
  ): false | TeamEnum;
}

abstract class HaxRugbyStadium implements IHaxRugbyStadium {
  private goalLineX: number;
  private goalPostY: number;
  private miniAreaX: number;
  public kickoffLineX: number;

  constructor(goalLineX: number, goalPostY: number, miniAreaX: number, kickoffLineX: number) {
    this.goalLineX = goalLineX;
    this.goalPostY = goalPostY;
    this.miniAreaX = miniAreaX;
    this.kickoffLineX = kickoffLineX;
  }

  public getIsGoal(
    ballPosition: IPosition,
    ballXSpeed: number,
    lastBallPositionWhenTouched: IPosition,
  ): false | TeamEnum {
    if (this.getIsBallInsideGoalInYAxis(ballPosition)) {
      if (ballXSpeed > 0 && this.getIsBallInsideGoalInXAxis(TeamEnum.TEAM_A, ballPosition)) {
        if (this.getWasBallBeforeMiniAreaX(lastBallPositionWhenTouched)) {
          return TeamEnum.TEAM_A;
        }
        if (this.getWasBallYGreaterThanGoalPostYAndOutsideMiniArea(lastBallPositionWhenTouched)) {
          return TeamEnum.TEAM_A;
        }
      } else if (ballXSpeed < 0 && this.getIsBallInsideGoalInXAxis(TeamEnum.TEAM_B, ballPosition)) {
        if (this.getWasBallBeforeMiniAreaX(lastBallPositionWhenTouched)) {
          return TeamEnum.TEAM_B;
        }
        if (this.getWasBallYGreaterThanGoalPostYAndOutsideMiniArea(lastBallPositionWhenTouched)) {
          return TeamEnum.TEAM_B;
        }
      }
    }
    return false;
  }

  private getIsBallInsideGoalInYAxis(ballPosition: IPosition): boolean {
    return Math.abs(ballPosition.y) + BALL_RADIUS < this.goalPostY;
  }

  private getIsBallInsideGoalInXAxis(team: TeamEnum, ballPosition: IPosition): boolean {
    const goalEndX = this.goalLineX + 0.9 * BALL_RADIUS;

    if (team === TeamEnum.TEAM_A) {
      return ballPosition.x > this.goalLineX && ballPosition.x < goalEndX;
    }
    return ballPosition.x < -this.goalLineX && ballPosition.x > -goalEndX;
  }

  private getWasBallBeforeMiniAreaX(lastBallPositionWhenTouched: IPosition): boolean {
    const distanceBetweenBallAndGoalLine =
      this.goalLineX - (Math.abs(lastBallPositionWhenTouched.x) + BALL_RADIUS);
    return distanceBetweenBallAndGoalLine > this.miniAreaX;
  }

  private getWasBallYGreaterThanGoalPostYAndOutsideMiniArea(
    lastBallPositionWhenTouched: IPosition,
  ): boolean {
    if (Math.abs(lastBallPositionWhenTouched.y) - BALL_RADIUS <= this.goalPostY) {
      return false;
    }

    const distanceBetweenBallAndClosestGoalPost = Physics.calcDistanceBetweenPositions(
      lastBallPositionWhenTouched,
      this.getClosestGoalPostPosition(lastBallPositionWhenTouched),
    );

    if (distanceBetweenBallAndClosestGoalPost - BALL_RADIUS > this.miniAreaX) {
      return true;
    }
    return false;
  }

  private getClosestGoalPostPosition(position: IPosition): IPosition {
    const xSign = Math.sign(position.x);
    const ySign = Math.sign(position.y);

    return { x: xSign * this.goalLineX, y: ySign * this.goalPostY };
  }
}

export default HaxRugbyStadium;
