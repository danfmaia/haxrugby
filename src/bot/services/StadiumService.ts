/* eslint-disable @typescript-eslint/no-explicit-any */

import { Color } from 'inversihax';
import TraitEnum from '../enums/stadium/TraitEnum';
import TeamEnum from '../enums/TeamEnum';

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
  private team: TeamEnum;

  constructor(team: TeamEnum) {
    this.team = team;
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

  getKickOffCurve(): number {
    if (this.team === TeamEnum.RED) {
      return -180;
    }
    return 180;
  }
}

export default StadiumService;
