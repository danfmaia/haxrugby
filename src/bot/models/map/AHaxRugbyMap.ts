import { IDiscPropertiesObject, IPosition } from 'inversihax';

import { BALL_RADIUS, GOAL_POST_RADIUS, TOUCH_EPSILON } from '../../constants/constants';
import TeamEnum from '../../enums/TeamEnum';
import { IHaxRugbyRoom } from '../../rooms/HaxRugbyRoom';
import Physics from '../../util/Physics';
import TPlayerCountByTeam from '../team/TPlayerCountByTeam';

export type IBallEnterOrLeaveIngoal = 'enter' | 'leave' | false;

interface IHaxRugbyMap {
  miniAreaX: number;
  kickoffLineX: number;
  areaLineX: number;

  tryLineX: number;

  getIsFieldGoal(
    ballPosition: IPosition,
    ballXSpeed: number,
    lastBallPositionWhenTouched: IPosition,
  ): false | TeamEnum;

  getDidBallEnterOrLeaveIngoal(
    ballPosition: IPosition,
    lastBallPosition: IPosition,
  ): IBallEnterOrLeaveIngoal;

  getIsSafety(
    ballPosition: IPosition,
    driverCountByTeam: TPlayerCountByTeam,
    isDefRec: boolean,
  ): false | TeamEnum;

  getIsSafetyOnGoalPost(
    ballPosition: IPosition,
    toucherCountByTeam: TPlayerCountByTeam,
    isDefRec: boolean,
  ): false | TeamEnum;

  getIsTry(ballPosition: IPosition, driverCountByTeam: TPlayerCountByTeam): false | TeamEnum;

  getIsTryOnGoalPost(
    ballPosition: IPosition,
    toucherCountByTeam: TPlayerCountByTeam,
    room: IHaxRugbyRoom,
  ): false | TeamEnum;

  getIsTryOnGoalLine(
    didBallEnterOrLeaveIngoal: IBallEnterOrLeaveIngoal,
    ballPosition: IPosition,
    driverCountByTeam: TPlayerCountByTeam,
  ): boolean;

  moveDiscInXAxis(disc: IDiscPropertiesObject, team: TeamEnum, deltaX: number): number;
}

abstract class AHaxRugbyMap implements IHaxRugbyMap {
  private goalLineX: number;
  private goalPostY: number;
  public miniAreaX: number;
  public kickoffLineX: number;
  public areaLineX: number;

  public get tryLineX(): number {
    return this.goalLineX - BALL_RADIUS;
  }

  constructor(
    goalLineX: number,
    goalPostY: number,
    miniAreaX: number,
    kickoffLineX: number,
    areaLineX: number,
  ) {
    this.goalLineX = goalLineX;
    this.goalPostY = goalPostY;
    this.miniAreaX = miniAreaX;
    this.kickoffLineX = kickoffLineX;
    this.areaLineX = areaLineX;
  }

  public getIsFieldGoal(
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

  public getDidBallEnterOrLeaveIngoal(
    ballPosition: IPosition,
    lastBallPosition: IPosition,
  ): IBallEnterOrLeaveIngoal {
    if (Math.abs(lastBallPosition.x) < this.tryLineX && Math.abs(ballPosition.x) >= this.tryLineX) {
      return 'enter';
    }

    if (Math.abs(lastBallPosition.x) >= this.tryLineX && Math.abs(ballPosition.x) < this.tryLineX) {
      return 'leave';
    }

    return false;
  }

  private getIsBallInsideGoalInYAxis(ballPosition: IPosition): boolean {
    return Math.abs(ballPosition.y) + BALL_RADIUS < this.goalPostY;
  }

  private getIsBallOutsideGoalInYAxis(ballPosition: IPosition): boolean {
    return Math.abs(ballPosition.y) - BALL_RADIUS > this.goalPostY;
  }

  private getIsBallInsideGoalInXAxis(team: TeamEnum, ballPosition: IPosition): boolean {
    const goalEndX = this.goalLineX + 0.45 * BALL_RADIUS;

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

  public getIsSafety(
    ballPosition: IPosition,
    driverCountByTeam: TPlayerCountByTeam,
  ): false | TeamEnum {
    if (ballPosition.x <= -this.tryLineX && driverCountByTeam.red > 0) {
      return TeamEnum.RED;
    } else if (ballPosition.x >= this.tryLineX && driverCountByTeam.blue > 0) {
      return TeamEnum.BLUE;
    }
    return false;
  }

  public getIsSafetyOnGoalPost(
    ballPosition: IPosition,
    toucherCountByTeam: TPlayerCountByTeam,
  ): false | TeamEnum {
    // TODO: This logic can be improved. At least for safety on goal post.
    if (
      Math.abs(Math.abs(ballPosition.x) - this.goalLineX) >
      BALL_RADIUS + GOAL_POST_RADIUS + 5 * TOUCH_EPSILON
    ) {
      return false;
    }

    const redCondition = ballPosition.x <= -this.tryLineX && toucherCountByTeam.red > 0;
    const blueCondition = ballPosition.x >= this.tryLineX && toucherCountByTeam.blue > 0;

    if (redCondition === false && blueCondition === false) {
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

    if (redCondition) {
      return TeamEnum.RED;
    } else if (blueCondition) {
      return TeamEnum.BLUE;
    }
    return false;
  }

  public getIsTry(
    ballPosition: IPosition,
    driverCountByTeam: TPlayerCountByTeam,
  ): false | TeamEnum {
    if (ballPosition.x >= this.tryLineX && driverCountByTeam.red > 0) {
      return TeamEnum.RED;
    } else if (ballPosition.x <= -this.tryLineX && driverCountByTeam.blue > 0) {
      return TeamEnum.BLUE;
    }
    return false;
  }

  public getIsTryOnGoalPost(
    ballPosition: IPosition,
    toucherCountByTeam: TPlayerCountByTeam,
  ): false | TeamEnum {
    if (
      Math.abs(Math.abs(ballPosition.x) - this.goalLineX) >
      BALL_RADIUS + GOAL_POST_RADIUS + 5 * TOUCH_EPSILON
    ) {
      return false;
    }

    const redCondition = ballPosition.x > 0 && toucherCountByTeam.red > 0;
    const blueCondition = ballPosition.x < 0 && toucherCountByTeam.blue > 0;

    if (redCondition === false && blueCondition === false) {
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

    if (redCondition) {
      return TeamEnum.RED;
    } else if (blueCondition) {
      return TeamEnum.BLUE;
    }
    return false;
  }

  public getIsTryOnGoalLine(
    didBallEnterOrLeaveIngoal: IBallEnterOrLeaveIngoal,
    ballPosition: IPosition,
    driverCountByTeam: TPlayerCountByTeam,
  ): boolean {
    if (didBallEnterOrLeaveIngoal !== 'enter') {
      return false;
    }

    if (ballPosition.x > 0 && driverCountByTeam.red > 0) {
      return true;
    }
    if (ballPosition.x < 0 && driverCountByTeam.blue > 0) {
      return true;
    }
    return false;
  }

  public getIsMissedConversion(ballPosition: IPosition, ballXSpeed: number): boolean {
    if (this.getIsBallOutsideGoalInYAxis(ballPosition)) {
      if (ballXSpeed > 0 && this.getIsBallInsideGoalInXAxis(TeamEnum.RED, ballPosition)) {
        return true;
      } else if (ballXSpeed < 0 && this.getIsBallInsideGoalInXAxis(TeamEnum.BLUE, ballPosition)) {
        return true;
      }
    }
    return false;
  }

  public moveDiscInXAxis(disc: IDiscPropertiesObject, direction: TeamEnum, deltaX: number): number {
    if (direction === TeamEnum.RED) {
      return disc.x + deltaX;
    }
    return disc.x - deltaX;
  }
}

export default AHaxRugbyMap;
