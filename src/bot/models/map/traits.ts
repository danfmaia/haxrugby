import TraitEnum from '../../enums/stadium/TraitEnum';
import TTrait from './TTrait';

const traits = {
  // mandatory

  [TraitEnum.ballArea]: {
    vis: false,
    bCoef: 1,
    cMask: ['ball'],
  } as TTrait,

  [TraitEnum.goalPost]: {
    vis: true,
    bCoef: 0.5,
    cMask: ['ball'],
    radius: 2,
    invMass: 0,
    color: '000000',
  } as TTrait,

  [TraitEnum.goalNet]: {
    vis: true,
    bCoef: 0.1,
    cMask: [0],
  } as TTrait,

  [TraitEnum.kickOffBarrier]: {
    vis: true,
    bCoef: 0.1,
    cGroup: ['redKO', 'blueKO'],
    cMask: ['red', 'blue'],
  } as TTrait,

  // custom

  [TraitEnum.null]: {
    vis: true,
    bCoef: 0,
    cGroup: [0],
    cMask: [0],
    color: 'ffff00',
  } as TTrait,

  [TraitEnum.playerArea]: {
    vis: false,
    bCoef: 0.1,
    cMask: ['red', 'blue'],
  } as TTrait,

  [TraitEnum.line]: {
    vis: true,
    bCoef: 0,
    cGroup: [0],
    cMask: [0],
    color: [199, 230, 189],
  } as TTrait,

  [TraitEnum.fadeLine]: {
    vis: true,
    bCoef: 0,
    cGroup: [0],
    cMask: [0],
    color: [150, 173, 142],
  } as TTrait,

  [TraitEnum.redKOBarrier]: {
    vis: true,
    bCoef: 0.1,
    cGroup: ['redKO'],
    cMask: ['red', 'blue'],
    color: 'ff0000',
  } as TTrait,

  [TraitEnum.blueKOBarrier]: {
    vis: true,
    bCoef: 0.1,
    cGroup: ['blueKO'],
    cMask: ['red', 'blue'],
    color: '0000ff',
  } as TTrait,

  [TraitEnum.powerBoost]: {
    vis: false,
    bCoef: -2.4,
    cMask: ['ball'],
  },
};

export default traits;
