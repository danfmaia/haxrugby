import { BALL_RADIUS } from '../../constants/constants';

const map = {
  name: 'S-HaxRugby v9 R by JP',

  width: 420,
  height: 200,

  spawnDistance: 150,

  bg: { type: 'grass', width: 390, height: 153, kickOffRadius: 0, cornerRadius: 0 },

  vertexes: [
    { x: -390, y: 153, trait: 'ballArea' }, // 0
    { x: -300, y: 153, trait: 'Line' }, // 1
    { x: -300, y: -153, trait: 'Line' }, // 2
    { x: -390, y: -153, trait: 'ballArea' }, // 3

    { x: 390, y: 153, trait: 'ballArea' }, // 4
    { x: 300, y: 153, trait: 'Line' }, // 5
    { x: 300, y: -153, trait: 'Line' }, // 6
    { x: 390, y: -153, trait: 'ballArea' }, // 7

    { x: -300, y: 50, trait: 'goalNet' }, // 8
    { x: -325, y: 30, trait: 'goalNet' }, // 9
    { x: -325, y: -30, trait: 'goalNet' }, // 10
    { x: -300, y: -50, trait: 'goalNet' }, // 11

    { x: 300, y: 50, trait: 'goalNet' }, // 12
    { x: 325, y: 30, trait: 'goalNet' }, // 13
    { x: 325, y: -30, trait: 'goalNet' }, // 14
    { x: 300, y: -50, trait: 'goalNet' }, // 15

    { x: 0, y: 200, trait: 'kickOffBarrier' }, // 16
    { x: 0, y: -200, trait: 'kickOffBarrier' }, // 17

    { x: -100, y: 148, trait: 'Line' }, // 18
    { x: -100, y: -148, trait: 'Line' }, // 19
    { x: 100, y: 148, trait: 'Line' }, // 20
    { x: 100, y: -148, trait: 'Line' }, // 21

    { x: -100, y: 200, trait: 'BlueKOBarrier' }, // 22
    { x: -100, y: -200, trait: 'BlueKOBarrier' }, // 23
    { x: 100, y: 200, trait: 'RedKOBarrier' }, // 24
    { x: 100, y: -200, trait: 'RedKOBarrier' }, // 25

    { x: -390, y: -50, trait: 'Line' }, // 26
    { x: -300, y: -50, trait: 'Line' }, // 27
    { x: 300, y: -50, trait: 'Line' }, // 28
    { x: 390, y: -50, trait: 'Line' }, // 29

    { x: -390, y: 50, trait: 'Line' }, // 30
    { x: -300, y: 50, trait: 'Line' }, // 31
    { x: 300, y: 50, trait: 'Line' }, // 32
    { x: 390, y: 50, trait: 'Line' }, // 33

    { x: 0, y: -(BALL_RADIUS + 2.3), trait: 'kickOffBarrier' }, // 34
    { x: 0, y: BALL_RADIUS + 2.3, trait: 'kickOffBarrier' }, // 35

    { x: -300, y: -95, trait: 'Line' }, // 36
    { x: -255, y: -50, trait: 'Line' }, // 37
    { x: -255, y: 50, trait: 'Line' }, // 38
    { x: -300, y: 95, trait: 'Line' }, // 39
    { x: 300, y: -95, trait: 'Line' }, // 40
    { x: 255, y: -50, trait: 'Line' }, // 41
    { x: 255, y: 50, trait: 'Line' }, // 42
    { x: 300, y: 95, trait: 'Line' }, // 43

    { x: -200, y: -153, trait: 'Line' }, // 44
    { x: -200, y: 153, trait: 'Line' }, // 45
    { x: 200, y: -153, trait: 'Line' }, // 46
    { x: 200, y: 153, trait: 'Line' }, // 47
  ],

  segments: [
    { v0: 0, v1: 3, trait: 'ballArea' },
    { v0: 4, v1: 7, trait: 'ballArea' },
    { v0: 1, v1: 2, trait: 'Line' },
    { v0: 5, v1: 6, trait: 'Line' },
    { v0: 16, v1: 17, trait: 'kickOffBarrier' },
    { v0: 18, v1: 19, trait: 'fadeLine' },
    { v0: 20, v1: 21, trait: 'fadeLine' },
    { v0: 22, v1: 23, trait: 'BlueKOBarrier' },
    { v0: 24, v1: 25, trait: 'RedKOBarrier' },

    { v0: 26, v1: 27, trait: 'Line' },
    { v0: 28, v1: 29, trait: 'Line' },
    { v0: 30, v1: 31, trait: 'Line' },
    { v0: 32, v1: 33, trait: 'Line' },

    { v0: 34, v1: 35, trait: 'kickOffBarrier', curve: -180 },

    { v0: 36, v1: 37, trait: 'Line', curve: 90 },
    { v0: 37, v1: 38, trait: 'Line' },
    { v0: 38, v1: 39, trait: 'Line', curve: 90 },
    { v0: 40, v1: 41, trait: 'Line', curve: -90 },
    { v0: 41, v1: 42, trait: 'Line' },
    { v0: 42, v1: 43, trait: 'Line', curve: -90 },

    { v0: 44, v1: 45, trait: 'Line' },
    { v0: 46, v1: 47, trait: 'Line' },
  ],

  goals: [],

  discs: [
    { pos: [-300, 50], trait: 'goalPost', color: 'FFCCCC', cMask: ['ball'] },
    { pos: [-300, -50], trait: 'goalPost', color: 'FFCCCC', cMask: ['ball'] },
    { pos: [300, 50], trait: 'goalPost', color: 'CCCCFF', cMask: ['ball'] },
    { pos: [300, -50], trait: 'goalPost', color: 'CCCCFF', cMask: ['ball'] },
  ],

  planes: [
    { normal: [0, 1], dist: -153, trait: 'ballArea' },
    { normal: [0, -1], dist: -153, trait: 'ballArea' },
    { normal: [0, 1], dist: -200, bCoef: 0.1 },
    { normal: [0, -1], dist: -200, bCoef: 0.1 },
    { normal: [1, 0], dist: -440, bCoef: 0.1 },
    { normal: [-1, 0], dist: -440, bCoef: 0.1 },
  ],

  traits: {
    Line: { vis: true, bCoef: 0, cGroup: [0], cMask: [0], color: [199, 230, 189] },
    fadeLine: { vis: true, bCoef: 0, cGroup: [0], cMask: [0], color: [150, 173, 142] },
    ballArea: { vis: false, bCoef: 1, cMask: ['ball'] },
    goalPost: { radius: 2, invMass: 0, bCoef: 0.5 },
    goalNet: { vis: true, bCoef: 0.1, cMask: [0] },
    kickOffBarrier: { vis: false, bCoef: 0.1, cGroup: ['redKO', 'blueKO'], cMask: ['red', 'blue'] },
    RedKOBarrier: { vis: false, bCoef: 0.1, cGroup: ['redKO'], cMask: ['red', 'blue'] },
    BlueKOBarrier: { vis: false, bCoef: 0.1, cGroup: ['blueKO'], cMask: ['red', 'blue'] },
  },

  ballPhysics: {
    radius: BALL_RADIUS,
  },
};

const red_kickoff = JSON.stringify(map);

export default red_kickoff;
