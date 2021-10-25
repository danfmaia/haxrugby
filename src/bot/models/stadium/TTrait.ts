import { Color } from 'inversihax';

type TTrait = {
  vis: boolean;
  bCoef?: number;
  cGroup?: [0] | string[];
  cMask?: [0] | string[];
  radius?: number;
  invMass?: number;
  damping?: number;
  color?: Color;
};

export default TTrait;
