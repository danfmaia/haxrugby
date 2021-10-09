import TraitEnum from '../../enums/stadium/TraitEnum';

class Trait {
  name: TraitEnum;
  vis: boolean;
  bCoef: number;
  cGroup: string[];
  cMask: string[];
  radius?: number;

  constructor(
    name: TraitEnum,
    vis: boolean,
    bCoef: number,
    cGroup: string[],
    cMask: string[],
    radius?: number,
  ) {
    this.name = name;
    this.vis = vis;
    this.bCoef = bCoef;
    this.cGroup = cGroup;
    this.cMask = cMask;
    this.radius = radius;
  }
}

export default Trait;
