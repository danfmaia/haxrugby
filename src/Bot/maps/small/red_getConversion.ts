function red_getConversion(tryY: number): string {
  const map = {
    name: 'SmallRU 0.07 x3 by JP',

    width: 640,

    height: 200,

    spawnDistance: 150,

    bg: { type: 'grass', width: 590, height: 153, kickOffRadius: 0, cornerRadius: 0 },

    vertexes: [
      /* 0 */ { x: -590, y: 153, trait: 'ballArea' },

      /* 1 */ { x: -500, y: 153, trait: 'Line' },
      /* 2 */ { x: -500, y: -153, trait: 'Line' },

      /* 3 */ { x: -590, y: -153, trait: 'ballArea' },
      /* 4 */ { x: 190, y: 153, trait: 'ballArea' },

      /* 5 */ { x: 100, y: 153, trait: 'Line' },
      /* 6 */ { x: 100, y: -153, trait: 'Line' },

      /* 7 */ { x: 190, y: -153, trait: 'ballArea' },

      /* 8 */ { x: -200, y: 153, trait: 'Line' },
      /* 9 */ { x: -200, y: -153, trait: 'Line' },

      /* 10 */ { x: 100, y: -200, trait: 'Barrier' },
      /* 11 */ { x: 100, y: 200, trait: 'Barrier' },

      /* 12 */ { x: -640, y: -200, trait: 'Line' },
      /* 13 */ { x: -640, y: 200, trait: 'Line' },
      /* 14 */ { x: 240, y: -200, trait: 'Line' },
      /* 15 */ { x: 240, y: 200, trait: 'Line' },

      /* 16 */ { x: 100, y: -50, trait: 'Barrier' },
      /* 17 */ { x: 100, y: 50, trait: 'Barrier' },

      /* 18 */ { x: -300, y: 148, trait: 'Line' },
      /* 19 */ { x: -300, y: -148, trait: 'Line' },
      /* 20 */ { x: -100, y: 148, trait: 'Line' },
      /* 21 */ { x: -100, y: -148, trait: 'Line' },

      /* 22 */ { x: -300, y: 200, trait: 'BlueKOBarrier' },
      /* 23 */ { x: -300, y: -200, trait: 'BlueKOBarrier' },

      /* 24 */ { x: -100, y: 200, trait: 'RedKOBarrier' },
      /* 25 */ { x: -100, y: -200, trait: 'RedKOBarrier' },

      /* 26 */ { x: -590, y: -50, trait: 'Line' },
      /* 27 */ { x: -500, y: -50, trait: 'Line' },
      /* 28 */ { x: 100, y: -50, trait: 'Line' },
      /* 29 */ { x: 190, y: -50, trait: 'Line' },
      /* 30 */ { x: -590, y: 50, trait: 'Line' },
      /* 31 */ { x: -500, y: 50, trait: 'Line' },
      /* 32 */ { x: 100, y: 50, trait: 'Line' },
      /* 33 */ { x: 190, y: 50, trait: 'Line' },

      /* 34 */ { x: 0, y: tryY - 12, trait: 'Line' },
      /* 35 */ { x: 0, y: tryY + 12, trait: 'Line' },

      /* 36 */ { x: -500, y: -95, trait: 'Line' },
      /* 37 */ { x: -455, y: -50, trait: 'Line' },
      /* 38 */ { x: -455, y: 50, trait: 'Line' },
      /* 39 */ { x: -500, y: 95, trait: 'Line' },
      /* 40 */ { x: 100, y: -95, trait: 'Line' },
      /* 41 */ { x: 55, y: -50, trait: 'Line' },
      /* 42 */ { x: 55, y: 50, trait: 'Line' },
      /* 43 */ { x: 100, y: 95, trait: 'Line' },
      /* 44 */ { x: -400, y: -153, trait: 'Line' },
      /* 45 */ { x: -400, y: 153, trait: 'Line' },
      /* 46 */ { x: 0, y: -153, trait: 'Line' },
      /* 47 */ { x: 0, y: 153, trait: 'Line' },

      /* 48 */ { x: 15, y: -200, trait: 'Barrier' },
      /* 49 */ { x: 15, y: 200, trait: 'Barrier' },
    ],

    segments: [
      { v0: 0, v1: 3, trait: 'ballArea' },
      { v0: 4, v1: 7, trait: 'ballArea' },
      { v0: 0, v1: 4, trait: 'ballArea' },
      { v0: 3, v1: 7, trait: 'ballArea' },

      { v0: 1, v1: 2, trait: 'Line' },
      { v0: 5, v1: 6, trait: 'Line' },
      { v0: 8, v1: 9, trait: 'Line' },

      { v0: 16, v1: 17, trait: 'kickOffBarrier' },

      { v0: 10, v1: 16, trait: 'Barrier' },
      { v0: 17, v1: 11, trait: 'Barrier' },

      { v0: 18, v1: 19, trait: 'fadeLine' },
      { v0: 20, v1: 21, trait: 'fadeLine' },

      { v0: 26, v1: 27, trait: 'Line' },
      { v0: 28, v1: 29, trait: 'Line' },
      { v0: 30, v1: 31, trait: 'Line' },
      { v0: 32, v1: 33, trait: 'Line' },

      { v0: 48, v1: 49, trait: 'Barrier' },

      { v0: 34, v1: 35, trait: 'powerboost', curve: 180 },

      { v0: 36, v1: 37, trait: 'Line', curve: 90 },
      { v0: 37, v1: 38, trait: 'Line' },
      { v0: 38, v1: 39, trait: 'Line', curve: 90 },
      { v0: 40, v1: 41, trait: 'Line', curve: -90 },
      { v0: 41, v1: 42, trait: 'Line' },
      { v0: 42, v1: 43, trait: 'Line', curve: -90 },
      { v0: 44, v1: 45, trait: 'Line' },
      { v0: 46, v1: 47, trait: 'Line' },

      { v0: 14, v1: 15 },
      { v0: 13, v1: 15 },
    ],

    goals: [{ team: 'red', p0: [100, -50], p1: [100, 50] }],

    discs: [
      { pos: [-500, 50], trait: 'goalPost', color: 'FFCCCC', cMask: ['ball'] },
      { pos: [-500, -50], trait: 'goalPost', color: 'FFCCCC', cMask: ['ball'] },
      { pos: [100, 50], trait: 'goalPost', color: 'CCCCFF', cMask: ['ball'] },
      { pos: [100, -50], trait: 'goalPost', color: 'CCCCFF', cMask: ['ball'] },
    ],

    planes: [
      { normal: [0, 1], dist: -153, trait: 'ballArea' },
      { normal: [0, -1], dist: -153, trait: 'ballArea' },

      { normal: [0, 1], dist: -200, bCoef: 0.1 },
      { normal: [0, -1], dist: -200, bCoef: 0.1 },
      { normal: [1, 0], dist: -640, bCoef: 0.1 },
      { normal: [-1, 0], dist: -240, bCoef: 0.1 },
    ],

    traits: {
      Line: { vis: true, bCoef: 0, cGroup: [0], cMask: [0], color: [199, 230, 189] },
      fadeLine: { vis: true, bCoef: 0, cGroup: [0], cMask: [0], color: [150, 173, 142] },
      ballArea: { vis: true, bCoef: 1, cMask: ['ball'], color: [199, 230, 189] },
      goalPost: { radius: 2, invMass: 0, bCoef: 0.5 },
      goalNet: { vis: true, bCoef: 0.1, cMask: [0] },
      kickOffBarrier: {
        vis: false,
        bCoef: 0.1,
        cGroup: ['redKO', 'blueKO'],
        cMask: ['red', 'blue'],
      },
      Barrier: { vis: false, bCoef: 0.1, cMask: ['red', 'blue'] },
      powerboost: { vis: false, bCoef: -2.4, cMask: ['ball'] },
    },
  };

  return JSON.stringify(map);
}

export default red_getConversion;
