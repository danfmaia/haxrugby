import { IPosition } from 'inversihax';

import { BALL_RADIUS, GOAL_POST_RADIUS, TOUCH_EPSILON } from '../../constants/constants';
import TeamEnum from '../../enums/TeamEnum';
import { IHaxRugbyRoom } from '../../rooms/HaxRugbyRoom';
import Physics from '../../util/Physics';
import IPlayerCountByTeam from '../team/IPlayerCountByTeam';

interface IHaxRugbyStadium {
  kickoffLineX: number;

  getDidBallEnterOrLeaveIngoal(
    ballPosition: IPosition,
    lastBallPosition: IPosition,
  ): 'enter' | 'leave' | false;

  getIsGoal(
    ballPosition: IPosition,
    ballXSpeed: number,
    lastBallPositionWhenTouched: IPosition,
  ): false | TeamEnum;

  getIsSafetyOnGoalPost(
    ballPosition: IPosition,
    toucherCountByTeam: IPlayerCountByTeam,
    isDefRec: boolean,
  ): false | TeamEnum;

  getIsSafety(
    ballPosition: IPosition,
    driverCountByTeam: IPlayerCountByTeam,
    isDefRec: boolean,
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

  private get goalLineForBall(): number {
    return this.goalLineX - BALL_RADIUS;
  }

  constructor(goalLineX: number, goalPostY: number, miniAreaX: number, kickoffLineX: number) {
    this.goalLineX = goalLineX;
    this.goalPostY = goalPostY;
    this.miniAreaX = miniAreaX;
    this.kickoffLineX = kickoffLineX;
  }

  public getDidBallEnterOrLeaveIngoal(
    ballPosition: IPosition,
    lastBallPosition: IPosition,
  ): 'enter' | 'leave' | false {
    if (
      Math.abs(lastBallPosition.x) < this.goalLineForBall &&
      Math.abs(ballPosition.x) >= this.goalLineForBall
    ) {
      return 'enter';
    }

    if (
      Math.abs(lastBallPosition.x) >= this.goalLineForBall &&
      Math.abs(ballPosition.x) < this.goalLineForBall
    ) {
      return 'leave';
    }

    return false;
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

  public getIsSafetyOnGoalPost(
    ballPosition: IPosition,
    toucherCountByTeam: IPlayerCountByTeam,
    isDefRec: boolean,
  ): false | TeamEnum {
    if (isDefRec) {
      return false;
    }

    // TODO: This logic can be improved. At least for safety on goal post.
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

    if (toucherCountByTeam.red > 0 && ballPosition.x <= -this.goalLineForBall) {
      return TeamEnum.RED;
    } else if (toucherCountByTeam.blue > 0 && ballPosition.x >= this.goalLineForBall) {
      return TeamEnum.BLUE;
    }
    return false;
  }

  public getIsSafety(
    ballPosition: IPosition,
    driverCountByTeam: IPlayerCountByTeam,
    isDefRec: boolean,
  ): false | TeamEnum {
    if (isDefRec) {
      return false;
    }

    if (driverCountByTeam.red > 0) {
      if (ballPosition.x <= -this.goalLineForBall) {
        return TeamEnum.RED;
      }
    } else if (driverCountByTeam.blue > 0) {
      if (ballPosition.x >= this.goalLineForBall) {
        return TeamEnum.BLUE;
      }
    }
    return false;
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
      if (ballPosition.x >= this.goalLineForBall) {
        return TeamEnum.RED;
      }
    } else if (driverCountByTeam.blue > 0) {
      if (ballPosition.x <= -this.goalLineForBall) {
        return TeamEnum.BLUE;
      }
    }
    return false;
  }
}

export default AHaxRugbyStadium;
