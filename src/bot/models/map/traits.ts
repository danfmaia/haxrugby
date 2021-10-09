import TraitEnum from '../../enums/stadium/TraitEnum';
import Trait from './Trait';

const traits = {
  // mandatory

  ballArea: {
    name: TraitEnum.ballArea,
    vis: true,
    bCoef: 1,
    cGroup: [],
    cMask: ['ball'],
  } as Trait,

  goalPost: {
    name: TraitEnum.goalPost,
    vis: true,
    bCoef: 0.5,
    cGroup: [],
    cMask: ['ball'],
    color: '000000',
    radius: 2,
  } as Trait,

  goalNet: {
    name: TraitEnum.goalNet,
    vis: true,
    bCoef: 0.1,
    cGroup: [],
    cMask: [],
  } as Trait,

  kickOffBarrier: {
    name: TraitEnum.kickOffBarrier,
    vis: false,
    bCoef: 0.1,
    cGroup: ['redKO', 'blueKO'],
    cMask: ['red', 'blue'],
  } as Trait,

  // custom

  playerArea: {
    name: TraitEnum.playerArea,
    vis: false,
    bCoef: 0.1,
    cGroup: [],
    cMask: ['all'],
  } as Trait,

  line: {
    name: TraitEnum.line,
    vis: true,
    bCoef: 0,
    cGroup: [],
    cMask: [],
    color: [199, 230, 189],
  } as Trait,

  fadeLine: {
    name: TraitEnum.fadeLine,
    vis: true,
    bCoef: 0,
    cGroup: [],
    cMask: [],
    color: [150, 173, 142],
  } as Trait,

  redKickOffBarrier: {
    name: TraitEnum.redKickOffBarrier,
    vis: false,
    bCoef: 0.1,
    cGroup: ['redKO'],
    cMask: ['red', 'blue'],
  } as Trait,

  blueKickOffBarrier: {
    name: TraitEnum.blueKickOffBarrier,
    vis: false,
    bCoef: 0.1,
    cGroup: ['blueKO'],
    cMask: ['red', 'blue'],
  } as Trait,
};

export default traits;
