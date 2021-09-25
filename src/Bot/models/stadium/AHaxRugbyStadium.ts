import { IPosition } from 'inversihax';

import { BALL_RADIUS, GOAL_POST_RADIUS, TOUCH_EPSILON } from '../../constants/constants';
import TeamEnum from '../../enums/TeamEnum';
import { IHaxRugbyRoom } from '../../rooms/HaxRugbyRoom';
import Physics from '../../util/Physics';
import IPlayerCountByTeam from '../team/IPlayerCountByTeam';

interface IHaxRugbyStadium {
  kickoffLineX: number;

  getIsGoal(
    ballPosition: IPosition,
    ballXSpeed: number,
    lastBallPositionWhenTouched: IPosition,
  ): false | TeamEnum;

  getIsTryOnGoalPost(
    ballPosition: IPosition,
    toucherCountByTeam: IPlayerCountByTeam,
    room: IHaxRugbyRoom,
  ): false | TeamEnum;

  getIsTry(ballPosition: IPosition, driverCountByTeam: IPlayerCountByTeam): false | TeamEnum;
}

abstract class AHaxRugbyStadium implements IHaxRugbyStadium {
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
      if (ballXSpeed > 0 && this.getIsBallInsideGoalInXAxis(TeamEnum.RED, ballPosition)) {
        if (this.getWasBallBeforeMiniAreaX(lastBallPositionWhenTouched)) {
          return TeamEnum.RED;
        }
        if (this.getWasBallYGreaterThanGoalPostYAndOutsideMiniArea(lastBallPositionWhenTouched)) {
          return TeamEnum.RED;
        }
      } else if (ballXSpeed < 0 && this.getIsBallInsideGoalInXAxis(TeamEnum.BLUE, ballPosition)) {
        if (this.getWasBallBeforeMiniAreaX(lastBallPositionWhenTouched)) {
          return TeamEnum.BLUE;
        }
        if (this.getWasBallYGreaterThanGoalPostYAndOutsideMiniArea(lastBallPositionWhenTouched)) {
          return TeamEnum.BLUE;
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

    if (team === TeamEnum.RED) {
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

  public getIsTryOnGoalPost(
    ballPosition: IPosition,
    toucherCountByTeam: IPlayerCountByTeam,
  ): false | TeamEnum {
    if (
      Math.abs(Math.abs(ballPosition.x) - this.goalLineX) >
      BALL_RADIUS + GOAL_POST_RADIUS + 5 * TOUCH_EPSILON
    ) {
      return false;
    }

    const closestGoalPostPosition = this.getClosestGoalPostPosition(ballPosition);
    const triggerDistance = Physics.getTouchTriggerDistance(BALL_RADIUS, GOAL_POST_RADIUS);
    const isBallTouchingGoalPost = Physics.getIsTouching(
      triggerDistance,
      ballPosition,
      closestGoalPostPosition,
    );
    if (isBallTouchingGoalPost === false) {
      return false;
    }

    if (toucherCountByTeam.red > 0 && ballPosition.x > 0) {
      return TeamEnum.RED;
    } else if (toucherCountByTeam.blue > 0 && ballPosition.x < 0) {
      return TeamEnum.BLUE;
    }
    return false;
  }

  public getIsTry(
    ballPosition: IPosition,
    driverCountByTeam: IPlayerCountByTeam,
  ): false | TeamEnum {
    if (driverCountByTeam.red > 0) {
      if (ballPosition.x >= this.goalLineX - BALL_RADIUS) {
        return TeamEnum.RED;
      }
    } else if (driverCountByTeam.blue > 0) {
      if (ballPosition.x <= -(this.goalLineX - BALL_RADIUS)) {
        return TeamEnum.BLUE;
      }
    }
    return false;
  }
}

export default AHaxRugbyStadium;
