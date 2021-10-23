/* eslint-disable @typescript-eslint/no-explicit-any */

import { IPosition } from 'inversihax';
import { BALL_RADIUS } from '../constants/constants';
import MapSizeEnum from '../enums/stadium/MapSizeEnum';
import TraitEnum from '../enums/stadium/TraitEnum';
import TeamEnum from '../enums/TeamEnum';
import MapDimensions from '../models/stadium/MapDimensions';
import TConversionProps from '../models/stadium/TConversionProps';

export function getVertex(x: number, y: number, trait: TraitEnum): any {
  return {
    x,
    y,
    trait,
  };
}

export function getSegment(v0: number, v1: number, trait: TraitEnum, curve?: number): any {
  return {
    v0,
    v1,
    trait,
    curve,
  };
}

export function getDisc(
  pos: [number, number],
  trait: TraitEnum,
  xSpeed: number = 0,
  ySpeed: number = 0,
): any {
  return {
    pos,
    trait,
    speed: [xSpeed, ySpeed],
  };
}

export function getJoint(d0: number, d1: number, trait: TraitEnum, length?: [number, number]): any {
  return {
    d0,
    d1,
    trait,
    length: length ? length : [0, 500],
  };
}

export function getPlane(normal: [number, number], dist: number, trait: TraitEnum): any {
  return {
    normal,
    dist,
    trait,
  };
}

export function getBallPhysics(radius: number): any {
  return {
    radius,
  };
}

class StadiumService {
  constructor(
    private tickCount: number,
    private matchDuration: number,
    private dims: MapDimensions,
    private size: MapSizeEnum,
    private team: TeamEnum,
    private kickoffPosition: IPosition,
    private convProps: TConversionProps | null,
    private isPenalty: boolean,
  ) {}

  // drawing height
  get dHeight(): number {
    if (this.size === MapSizeEnum.SMALL) {
      return this.dims.height - 50;
    }
    return this.dims.height;
  }

  getLeftKickoffX(): number {
    const leftKickoffX = this.kickoffPosition.x - this.dims.kickoffLineX;
    if (leftKickoffX < -this.dims.goalLineX) {
      return -this.dims.goalLineX;
    }
    return leftKickoffX;
  }

  getRightKickoffX(): number {
    const rightKickoffX = this.kickoffPosition.x + this.dims.kickoffLineX;
    if (rightKickoffX > this.dims.goalLineX) {
      return this.dims.goalLineX;
    }
    return rightKickoffX;
  }

  // getRightKOVertexes(): any {
  //   let kickoffX = this.kickoffPosition.x - this.dims.kickoffLineX;
  //   if (kickoffX < -this.dims.goalLineX) {
  //     kickoffX = -this.dims.goalLineX;
  //   } else if (kickoffX > this.dims.goalLineX) {
  //     kickoffX = this.dims.goalLineX;
  //   }
  //   return getVertex(kickoffX, -outerHeight, this.getLeftKOBarrierTrait());
  // }

  getLeftKOSegment(v0: number, v1: number): any {
    let trait: TraitEnum;

    if (!this.convProps) {
      trait = this.getLeftKOBarrierTrait();
    } else {
      if (this.team === TeamEnum.RED) {
        trait = TraitEnum.playerArea;
      } else {
        trait = TraitEnum.null;
      }
    }

    return getSegment(v0, v1, trait);
  }

  getKickOffSegment(v0: number, v1: number): any {
    if (this.convProps || this.isPenalty) {
      return getSegment(v0, v1, TraitEnum.null);
    } else {
      return getSegment(v0, v1, TraitEnum.kickOffBarrier);
    }
  }

  getRightKOSegment(v0: number, v1: number): any {
    let trait: TraitEnum;

    if (!this.convProps) {
      trait = this.getRightKOBarrierTrait();
    } else {
      if (this.team === TeamEnum.RED) {
        trait = TraitEnum.null;
      } else {
        trait = TraitEnum.playerArea;
      }
    }

    return getSegment(v0, v1, trait);
  }

  getLeftKOBarrierTrait(): TraitEnum {
    if (this.team === TeamEnum.RED) {
      return TraitEnum.blueKOBarrier;
    }
    return TraitEnum.redKOBarrier;
  }

  getRightKOBarrierTrait(): TraitEnum {
    if (this.team === TeamEnum.RED) {
      return TraitEnum.redKOBarrier;
    }
    return TraitEnum.blueKOBarrier;
  }

  getSign(): number {
    if (this.team === TeamEnum.RED) {
      return 1;
    }
    return -1;
  }

  getConversionSegment(v0: number, v1: number, trait: TraitEnum, curve?: number): any {
    if (!this.convProps) {
      return {
        v0,
        v1,
        trait: TraitEnum.null,
        curve,
      };
    }
    return {
      v0,
      v1,
      trait,
      curve,
    };
  }

  getTopBallVertex(): any {
    if (!this.convProps) {
      return getVertex(this.kickoffPosition.x, -(BALL_RADIUS + 2.3), TraitEnum.null);
    }
    return getVertex(
      this.convProps.ballX,
      this.convProps.tryY - (BALL_RADIUS + 2),
      TraitEnum.powerBoost,
    );
  }

  getBottomBallVertex(): any {
    if (!this.convProps) {
      return getVertex(this.kickoffPosition.x, BALL_RADIUS + 2.3, TraitEnum.null);
    }
    return getVertex(
      this.convProps.ballX,
      this.convProps.tryY + (BALL_RADIUS + 2),
      TraitEnum.powerBoost,
    );
  }

  getBallSegment(v0: number, v1: number): any {
    let curve: number;

    if (this.convProps) {
      if (this.team === TeamEnum.RED) {
        curve = 180;
      } else {
        curve = -180;
      }
      return getSegment(v0, v1, TraitEnum.powerBoost, curve);
    } else if (this.isPenalty) {
      return getSegment(v0, v1, TraitEnum.null);
    } else {
      if (this.team === TeamEnum.RED) {
        curve = -180;
      } else {
        curve = 180;
      }
      return getSegment(v0, v1, TraitEnum.kickOffBarrier, curve);
    }
  }

  getConversionGoal(): any {
    if (this.team === TeamEnum.RED) {
      return {
        team: 'blue',
        p0: [this.dims.goalLineX, -this.dims.goalPostY],
        p1: [this.dims.goalLineX, this.dims.goalPostY],
      };
    } else {
      return {
        team: 'red',
        p0: [-this.dims.goalLineX, -this.dims.goalPostY],
        p1: [-this.dims.goalLineX, this.dims.goalPostY],
      };
    }
  }

  getNonSmallTrait(trait: TraitEnum): TraitEnum {
    if (this.size !== MapSizeEnum.SMALL) {
      return trait;
    }
    return TraitEnum.null;
  }

  getSmallTrait(trait: TraitEnum): TraitEnum {
    if (this.size === MapSizeEnum.SMALL) {
      return trait;
    }
    return TraitEnum.null;
  }

  get approximateDurationInRunningTime(): number {
    return this.matchDuration * 1.5;
  }

  get tickCountInMinutes(): number {
    return this.tickCount / 60 / 60;
  }

  getShadowFactor(): number {
    return (
      (2 * this.tickCountInMinutes - this.approximateDurationInRunningTime) /
      this.approximateDurationInRunningTime
    );
  }

  getTopPostXSpeed(): number {
    // 1.81780 < speedFactor > 1.81800
    const speedFactor = 1.81785;
    return (
      (-speedFactor * this.dims.goalPostTopZ) / (60 * 60 * this.approximateDurationInRunningTime)
    );
  }

  getBottomPostXSpeed(): number {
    return (this.dims.goalPostBottomZ / this.dims.goalPostTopZ) * this.getTopPostXSpeed();
  }
}

export default StadiumService;
