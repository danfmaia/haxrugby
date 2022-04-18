import { BALL_RADIUS } from '../../constants/constants';
import colors from '../../constants/style/colors';
import TraitEnum from '../../enums/stadium/TraitEnum';
import TTrait from './TTrait';

const traits = {
  // mandatory

  [TraitEnum.ball]: {
    vis: true,
    radius: BALL_RADIUS,
    bCoef: 0.5,
    invMass: 1,
    damping: 0.99,
    color: 'FFFFFF',
    cMask: ['all'],
    cGroup: ['ball', 'kick'],
  } as TTrait,

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

  [TraitEnum.pointDisc]: {
    cMask: [0],
    radius: 0,
    damping: 1,
  } as TTrait,

  [TraitEnum.ingoalCone]: {
    vis: true,
    cMask: [0],
    radius: 3,
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

  [TraitEnum.null]: {
    vis: false,
    bCoef: 0,
    cGroup: [0],
    cMask: [0],
  } as TTrait,

  [TraitEnum.playerArea]: {
    vis: false,
    bCoef: 0.1,
    cMask: ['red', 'blue'],
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

  [TraitEnum.powerBoost]: {
    vis: false,
    bCoef: -2.7, // old: -2.4
    cMask: ['ball'],
  },

  [TraitEnum.line]: {
    vis: true,
    bCoef: 0,
    cGroup: [0],
    cMask: [0],
    color: [199, 230, 189],
  } as TTrait,

  [TraitEnum.redLine]: {
    vis: true,
    bCoef: 0,
    cGroup: [0],
    cMask: [0],
    color: colors.playerRedRGB,
  } as TTrait,

  [TraitEnum.blueLine]: {
    vis: true,
    bCoef: 0,
    cGroup: [0],
    cMask: [0],
    color: colors.playerBlueRGB,
  } as TTrait,

  [TraitEnum.fadeLine]: {
    vis: true,
    bCoef: 0,
    cGroup: [0],
    cMask: [0],
    color: [150, 173, 142],
  } as TTrait,

  [TraitEnum.drawingLine]: {
    vis: true,
    bCoef: 0,
    cGroup: [0],
    cMask: [0],
    color: colors.haxRugbyBallRGB,
  } as TTrait,

  [TraitEnum.shadow]: {
    vis: true,
    bCoef: 0,
    cGroup: [0],
    cMask: [0],
    color: '587653',
    // color: '00000080',
  } as TTrait,

  [TraitEnum.score]: {
    vis: false,
    radius: 0,
    cGroup: ['score'],
    cMask: [0],
  } as TTrait,
};

export default traits;
