/* eslint-disable @typescript-eslint/no-explicit-any */

import { Color } from 'inversihax';
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

export function getDisc(pos: [number, number], trait: TraitEnum, color?: Color): any {
  return {
    pos,
    trait,
    color,
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
    private dims: MapDimensions,
    private size: MapSizeEnum,
    private team: TeamEnum,
    private convProps: TConversionProps | null,
  ) {}

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

  getKickOffSegment(v0: number, v1: number): any {
    if (!this.convProps) {
      return getSegment(v0, v1, TraitEnum.kickOffBarrier);
    } else {
      return getSegment(v0, v1, TraitEnum.null);
    }
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

  getSignal(): number {
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
      return getVertex(0, -(BALL_RADIUS + 2.3), TraitEnum.kickOffBarrier);
    }
    return getVertex(
      this.convProps.ballX,
      this.convProps.tryY - (BALL_RADIUS + 2),
      TraitEnum.powerBoost,
    );
  }

  getBottomBallVertex(): any {
    if (!this.convProps) {
      return getVertex(0, BALL_RADIUS + 2.3, TraitEnum.kickOffBarrier);
    }
    return getVertex(
      this.convProps.ballX,
      this.convProps.tryY + (BALL_RADIUS + 2),
      TraitEnum.powerBoost,
    );
  }

  getBallSegment(v0: number, v1: number): any {
    let curve: number;

    if (this.convProps === null) {
      if (this.team === TeamEnum.RED) {
        curve = -180;
      } else {
        curve = 180;
      }
      return getSegment(v0, v1, TraitEnum.kickOffBarrier, curve);
    } else {
      if (this.team === TeamEnum.RED) {
        curve = 180;
      } else {
        curve = -180;
      }
      return getSegment(v0, v1, TraitEnum.powerBoost, curve);
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
}

export default StadiumService;
