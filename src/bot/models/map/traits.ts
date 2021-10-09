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
    vis: false,
    bCoef: 0.1,
    cGroup: ['redKO', 'blueKO'],
    cMask: ['red', 'blue'],
  } as TTrait,

  // custom

  [TraitEnum.playerArea]: {
    vis: false,
    bCoef: 0.1,
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
    vis: false,
    bCoef: 0.1,
    cGroup: ['redKO'],
    cMask: ['red', 'blue'],
  } as TTrait,

  [TraitEnum.blueKOBarrier]: {
    vis: false,
    bCoef: 0.1,
    cGroup: ['blueKO'],
    cMask: ['red', 'blue'],
  } as TTrait,
};

export default traits;
