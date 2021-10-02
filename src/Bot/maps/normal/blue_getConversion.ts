import { BALL_RADIUS } from '../../constants/constants';

function blue_getConversion(tryY: number): string {
  const map = {
    name: 'HaxRugby v19 BC by JP',

    width: 720,

    height: 350,

    spawnDistance: 227,

    bg: { type: 'grass', width: 674, height: 300, kickOffRadius: 0, cornerRadius: 0 },

    vertexes: [
      /* 0 */ { x: -674, y: 300, trait: 'ballArea' },

      /* 1 */ { x: -562, y: 300, trait: 'Line' },
      /* 2 */ { x: -562, y: -300, trait: 'Line' },

      /* 3 */ { x: -674, y: -300, trait: 'ballArea' },
      /* 4 */ { x: 674, y: 300, trait: 'ballArea' },

      /* 5 */ { x: 562, y: 300, trait: 'Line' },
      /* 6 */ { x: 562, y: -300, trait: 'Line' },

      /* 7 */ { x: 674, y: -300, trait: 'ballArea' },

      /* 8 */ { x: -427, y: 350, trait: 'Barrier' },
      /* 9 */ { x: -427, y: -350, trait: 'Barrier' },

      /* 10 */ { x: -179, y: 298, trait: 'fadeLine' },
      /* 11 */ { x: -179, y: -298, trait: 'fadeLine' },
      /* 12 */ { x: 179, y: 298, trait: 'fadeLine' },
      /* 13 */ { x: 179, y: -298, trait: 'fadeLine' },

      /* 14 */ { x: -674, y: -180, trait: 'Line' },
      /* 15 */ { x: -562, y: -180, trait: 'Line' },
      /* 16 */ { x: 562, y: -180, trait: 'Line' },
      /* 17 */ { x: 674, y: -180, trait: 'Line' },
      /* 18 */ { x: -674, y: -60, trait: 'Line' },

      /* 19 */ { x: -562, y: -60, trait: 'kickOffBarrier' },

      /* 20 */ { x: 562, y: -60, trait: 'Barrier' },

      /* 21 */ { x: 674, y: -60, trait: 'Line' },
      /* 22 */ { x: -674, y: 60, trait: 'Line' },

      /* 23 */ { x: -562, y: 60, trait: 'kickOffBarrier' },

      /* 24 */ { x: 562, y: 60, trait: 'Barrier' },

      /* 25 */ { x: 674, y: 60, trait: 'Line' },
      /* 26 */ { x: -674, y: 180, trait: 'Line' },
      /* 27 */ { x: -562, y: 180, trait: 'Line' },
      /* 28 */ { x: 562, y: 180, trait: 'Line' },
      /* 29 */ { x: 674, y: 180, trait: 'Line' },
      /* 30 */ { x: -412, y: tryY - (BALL_RADIUS + 2), trait: 'Line', curve: -180 },
      /* 31 */ { x: -412, y: tryY + (BALL_RADIUS + 2), trait: 'Line', curve: -180 },
      /* 32 */ { x: -562, y: -131, trait: 'Line' },
      /* 33 */ { x: -497, y: -60, trait: 'Line' },
      /* 34 */ { x: -497, y: 60, trait: 'Line' },
      /* 35 */ { x: -562, y: 131, trait: 'Line' },
      /* 36 */ { x: 562, y: -131, trait: 'Line' },
      /* 37 */ { x: 497, y: -60, trait: 'Line' },
      /* 38 */ { x: 497, y: 60, trait: 'Line' },
      /* 39 */ { x: 562, y: 131, trait: 'Line' },
      /* 40 */ { x: -412, y: -300, trait: 'Line' },
      /* 41 */ { x: -412, y: 300, trait: 'Line' },
      /* 42 */ { x: 412, y: -300, trait: 'Line' },
      /* 43 */ { x: 412, y: 300, trait: 'Line' },
      /* 44 */ { x: -407, y: -180, trait: 'Line' },
      /* 45 */ { x: -417, y: -180, trait: 'Line' },
      /* 46 */ { x: -407, y: -60, trait: 'Line' },
      /* 47 */ { x: -417, y: -60, trait: 'Line' },
      /* 48 */ { x: -407, y: 60, trait: 'Line' },
      /* 49 */ { x: -417, y: 60, trait: 'Line' },
      /* 50 */ { x: -407, y: 180, trait: 'Line' },
      /* 51 */ { x: -417, y: 180, trait: 'Line' },
      /* 52 */ { x: 407, y: -180, trait: 'Line' },
      /* 53 */ { x: 417, y: -180, trait: 'Line' },
      /* 54 */ { x: 407, y: -60, trait: 'Line' },
      /* 55 */ { x: 417, y: -60, trait: 'Line' },
      /* 56 */ { x: 407, y: 60, trait: 'Line' },
      /* 57 */ { x: 417, y: 60, trait: 'Line' },
      /* 58 */ { x: 407, y: 180, trait: 'Line' },
      /* 59 */ { x: 417, y: 180, trait: 'Line' },

      /* 60 */ { x: -174, y: -180, trait: 'fadeLine' },
      /* 61 */ { x: -184, y: -180, trait: 'fadeLine' },
      /* 62 */ { x: -174, y: -60, trait: 'fadeLine' },
      /* 63 */ { x: -184, y: -60, trait: 'fadeLine' },
      /* 64 */ { x: -174, y: 60, trait: 'fadeLine' },
      /* 65 */ { x: -184, y: 60, trait: 'fadeLine' },
      /* 66 */ { x: -174, y: 180, trait: 'fadeLine' },
      /* 67 */ { x: -184, y: 180, trait: 'fadeLine' },
      /* 68 */ { x: 174, y: -180, trait: 'fadeLine' },
      /* 69 */ { x: 184, y: -180, trait: 'fadeLine' },
      /* 70 */ { x: 174, y: -60, trait: 'fadeLine' },
      /* 71 */ { x: 184, y: -60, trait: 'fadeLine' },
      /* 72 */ { x: 174, y: 60, trait: 'fadeLine' },
      /* 73 */ { x: 184, y: 60, trait: 'fadeLine' },
      /* 74 */ { x: 174, y: 180, trait: 'fadeLine' },
      /* 75 */ { x: 184, y: 180, trait: 'fadeLine' },

      /* 76 */ { x: -5, y: -180, trait: 'Line' },
      /* 77 */ { x: 5, y: -180, trait: 'Line' },
      /* 78 */ { x: -5, y: -60, trait: 'Line' },
      /* 79 */ { x: 5, y: -60, trait: 'Line' },
      /* 80 */ { x: -5, y: 60, trait: 'Line' },
      /* 81 */ { x: 5, y: 60, trait: 'Line' },
      /* 82 */ { x: -5, y: 180, trait: 'Line' },
      /* 83 */ { x: 5, y: 180, trait: 'Line' },

      /* 84 */ { x: -15, y: -340, trait: 'fadeLine' },
      /* 85 */ { x: -15, y: -316, trait: 'fadeLine' },
      /* 86 */ { x: -27, y: -305, trait: 'fadeLine' },
      /* 87 */ { x: -10, y: -310, trait: 'fadeLine' },
      /* 88 */ { x: -10, y: -340, curve: 230, trait: 'fadeLine' },
      /* 89 */ { x: -10, y: -325, curve: 230, trait: 'fadeLine' },
      /* 90 */ { x: 5, y: -345, curve: 0, trait: 'fadeLine' },
      /* 91 */ { x: 5, y: -335, curve: 0, trait: 'fadeLine' },
      /* 92 */ { x: 25, y: -326, curve: -120, trait: 'fadeLine' },
      /* 93 */ { x: 10, y: -324, curve: -120, trait: 'fadeLine' },
      /* 94 */ { x: 17.5, y: -320, curve: 0, trait: 'fadeLine' },
      /* 95 */ { x: 25, y: -316, curve: 120, trait: 'fadeLine' },
      /* 96 */ { x: 10, y: -314, curve: 120, trait: 'fadeLine' },
      /* 97 */ { x: -95, y: 310, curve: 230, trait: 'fadeLine' },
      /* 98 */ { x: -95, y: 340, trait: 'fadeLine' },
      /* 99 */ { x: -95, y: 325, curve: 230, trait: 'fadeLine' },
      /* 100 */ { x: -86, y: 324, curve: 0, trait: 'fadeLine' },
      /* 101 */ { x: -80, y: 340, curve: 0, trait: 'fadeLine' },
      /* 102 */ { x: -75, y: 335, curve: -110, trait: 'fadeLine' },
      /* 103 */ { x: -60, y: 335, trait: 'fadeLine', curve: -110 },
      /* 104 */ { x: -60, y: 340, trait: 'fadeLine' },
      /* 105 */ { x: -40, y: 320, trait: 'fadeLine' },
      /* 106 */ { x: -40, y: 343, trait: 'fadeLine', curve: -110 },
      /* 107 */ { x: -55, y: 343, trait: 'fadeLine', curve: -110 },
      /* 108 */ { x: -35, y: 340, curve: 0, trait: 'fadeLine' },
      /* 109 */ { x: -35, y: 305, curve: 0, trait: 'fadeLine' },
      /* 110 */ { x: -35, y: 325, curve: 290, trait: 'fadeLine' },
      /* 111 */ { x: -15, y: 320, curve: 0, trait: 'fadeLine' },
      /* 112 */ { x: -7.5, y: 335, curve: 0, trait: 'fadeLine' },
      /* 113 */ { x: 0, y: 320, trait: 'fadeLine' },
      /* 114 */ { x: -15, y: 350, trait: 'fadeLine' },
      /* 115 */ { x: 10, y: 310, trait: 'fadeLine' },
      /* 116 */ { x: 10, y: 335, trait: 'fadeLine', curve: -110 },
      /* 117 */ { x: 25, y: 335, trait: 'fadeLine', curve: -110 },
      /* 118 */ { x: 25, y: 310, trait: 'fadeLine' },
      /* 119 */ { x: 30, y: 320, trait: 'fadeLine' },
      /* 120 */ { x: 30, y: 340, trait: 'fadeLine' },
      /* 121 */ { x: -40, y: 325, curve: -290, trait: 'fadeLine' },
      /* 122 */ { x: -35, y: 335, curve: 290, trait: 'fadeLine' },
      /* 123 */ { x: 30, y: 325, trait: 'fadeLine', curve: 110 },
      /* 124 */ { x: 45, y: 325, trait: 'fadeLine', curve: 110 },
      /* 125 */ { x: 45, y: 340, trait: 'fadeLine' },
      /* 126 */ { x: 50, y: 320, trait: 'fadeLine' },
      /* 127 */ { x: 50, y: 340, trait: 'fadeLine' },
      /* 128 */ { x: 49, y: 314, trait: 'fadeLine' },
      /* 129 */ { x: 51, y: 314, trait: 'fadeLine' },
      /* 130 */ { x: 65, y: 320, curve: 180, trait: 'fadeLine' },
      /* 131 */ { x: 65, y: 340, curve: 180, trait: 'fadeLine' },
      /* 132 */ { x: 80, y: 320, trait: 'fadeLine' },
      /* 133 */ { x: 80, y: 340, trait: 'fadeLine' },
      /* 134 */ { x: 80, y: 325, trait: 'fadeLine', curve: 110 },
      /* 135 */ { x: 95, y: 325, trait: 'fadeLine', curve: 110 },
      /* 136 */ { x: 95, y: 340, trait: 'fadeLine' },
      /* 137 */ { x: -75, y: 320, curve: 0, trait: 'fadeLine' },
      /* 138 */ { x: -60, y: 320, trait: 'fadeLine' },
      /* 139 */ { x: -40, y: 335, curve: -290, trait: 'fadeLine' },

      /* 140 */ { bCoef: 0, trait: 'Line', x: 0, y: -300 },
      /* 141 */ { bCoef: 0, trait: 'Line', x: 0, y: 300 },

      /* 142 */ { trait: 'Barrier', x: -562, y: -350 },
      /* 143 */ { trait: 'Barrier', x: -562, y: 350 },
      /* 144 */ { bCoef: 0.1, cMask: ['red', 'blue'], trait: 'Barrier', x: -720, y: -350 },
      /* 145 */ { bCoef: 0.1, cMask: ['red', 'blue'], trait: 'Barrier', x: -720, y: 350 },

      /* 146 */ { trait: 'fadeLine', x: -672, y: -240 },
      /* 147 */ { trait: 'fadeLine', x: -564, y: -240 },
      /* 148 */ { trait: 'fadeLine', x: 564, y: -240 },
      /* 149 */ { trait: 'fadeLine', x: 672, y: -240 },
      /* 150 */ { trait: 'fadeLine', x: -672, y: -120 },
      /* 151 */ { trait: 'fadeLine', x: -564, y: -120 },
      /* 152 */ { trait: 'fadeLine', x: 564, y: -120 },
      /* 153 */ { trait: 'fadeLine', x: 672, y: -120 },
      /* 154 */ { trait: 'fadeLine', x: -672, y: 120 },
      /* 155 */ { trait: 'fadeLine', x: -564, y: 120 },
      /* 156 */ { trait: 'fadeLine', x: 564, y: 120 },
      /* 157 */ { trait: 'fadeLine', x: 672, y: 120 },
      /* 158 */ { trait: 'fadeLine', x: -672, y: 240 },
      /* 159 */ { trait: 'fadeLine', x: -564, y: 240 },
      /* 160 */ { trait: 'fadeLine', x: 564, y: 240 },
      /* 161 */ { trait: 'fadeLine', x: 672, y: 240 },

      /* 162 */ { x: 179, y: 350, trait: 'Barrier' },
      /* 163 */ { x: 179, y: -350, trait: 'Barrier' },
      /* 164 */ { x: -674, y: 350, trait: 'Barrier' },
      /* 165 */ { x: -674, y: -350, trait: 'Barrier' },
    ],

    segments: [
      { v0: 0, v1: 3, trait: 'ballArea', x: -674 },
      { v0: 4, v1: 7, trait: 'ballArea', x: 674 },

      { v0: 1, v1: 2, trait: 'Line' },
      { v0: 5, v1: 6, trait: 'Line' },

      { v0: 8, v1: 9, trait: 'Barrier', x: -15 },

      { v0: 10, v1: 11, trait: 'fadeLine', x: -179 },
      { v0: 12, v1: 13, trait: 'fadeLine', x: 179 },

      { v0: 14, v1: 15, trait: 'Line' },
      { v0: 16, v1: 17, trait: 'Line', y: -180 },
      { v0: 18, v1: 19, trait: 'Line' },
      { v0: 20, v1: 21, trait: 'Line' },
      { v0: 22, v1: 23, trait: 'Line' },
      { v0: 24, v1: 25, trait: 'Line' },
      { v0: 26, v1: 27, trait: 'Line', y: 180 },
      { v0: 28, v1: 29, trait: 'Line', y: 180 },

      { v0: 30, v1: 31, trait: 'powerboost', curve: -180 },

      { v0: 32, v1: 33, trait: 'Line', curve: 90 },
      { v0: 33, v1: 34, trait: 'Line' },
      { v0: 34, v1: 35, trait: 'Line', curve: 90 },
      { v0: 36, v1: 37, trait: 'Line', curve: -90 },
      { v0: 37, v1: 38, trait: 'Line' },
      { v0: 38, v1: 39, trait: 'Line', curve: -90 },
      { v0: 40, v1: 41, trait: 'Line' },
      { v0: 42, v1: 43, trait: 'Line' },
      { v0: 44, v1: 45, trait: 'Line', y: -180 },
      { v0: 46, v1: 47, trait: 'Line', y: -60 },
      { v0: 48, v1: 49, trait: 'Line', y: 60 },
      { v0: 50, v1: 51, trait: 'Line', y: 180 },
      { v0: 52, v1: 53, trait: 'Line', y: -180 },
      { v0: 54, v1: 55, trait: 'Line', y: -60 },
      { v0: 56, v1: 57, trait: 'Line', y: 60 },
      { v0: 58, v1: 59, trait: 'Line', y: 180 },

      { v0: 60, v1: 61, trait: 'fadeLine', y: -180 },
      { v0: 62, v1: 63, trait: 'fadeLine', y: -60 },
      { v0: 64, v1: 65, trait: 'fadeLine', y: 60 },
      { v0: 66, v1: 67, trait: 'fadeLine', y: 180 },
      { v0: 68, v1: 69, trait: 'fadeLine', y: -180 },
      { v0: 70, v1: 71, trait: 'fadeLine', y: -60 },
      { v0: 72, v1: 73, trait: 'fadeLine', y: 60 },
      { v0: 74, v1: 75, trait: 'fadeLine', y: 180 },

      { v0: 76, v1: 77, trait: 'Line', y: -180 },
      { v0: 78, v1: 79, trait: 'Line', y: -60 },
      { v0: 80, v1: 81, trait: 'Line', y: 60 },
      { v0: 82, v1: 83, trait: 'Line', y: 180 },

      { vis: true, v0: 84, v1: 85, trait: 'fadeLine' },
      { vis: true, v0: 85, v1: 86, curve: 106.99711775898741, trait: 'fadeLine' },
      { vis: true, v0: 88, v1: 87, trait: 'fadeLine' },
      { vis: true, v0: 88, v1: 89, curve: 230, trait: 'fadeLine' },
      { curve: 0, vis: true, v0: 90, v1: 91, trait: 'fadeLine' },
      { curve: -120, vis: true, v0: 92, v1: 93, trait: 'fadeLine' },
      { curve: -80, vis: true, v0: 93, v1: 94, trait: 'fadeLine' },
      { curve: 80, vis: true, v0: 94, v1: 95, trait: 'fadeLine' },
      { curve: 120, vis: true, v0: 95, v1: 96, y: -312, trait: 'fadeLine' },
      { vis: true, v0: 97, v1: 98, trait: 'fadeLine' },
      { vis: true, v0: 97, v1: 99, curve: 230, trait: 'fadeLine' },
      { curve: 0, vis: true, v0: 101, v1: 100, trait: 'fadeLine' },
      { curve: -110, vis: true, v0: 102, v1: 103, trait: 'fadeLine' },
      { curve: 0, vis: true, v0: 137, v1: 102, trait: 'fadeLine' },
      { curve: 0, vis: true, v0: 138, v1: 104, trait: 'fadeLine' },
      { curve: 0, vis: true, v0: 105, v1: 106, trait: 'fadeLine' },
      { curve: -110, vis: true, v0: 107, v1: 106, trait: 'fadeLine' },
      { vis: true, v0: 121, v1: 106, x: -45, trait: 'fadeLine' },
      { curve: -290, vis: true, v0: 121, v1: 139, trait: 'fadeLine' },
      { curve: 0, vis: true, v0: 108, v1: 109, trait: 'fadeLine' },
      { curve: 290, vis: true, v0: 110, v1: 122, trait: 'fadeLine' },
      { curve: 0, vis: true, v0: 111, v1: 112, trait: 'fadeLine' },
      { curve: 0, vis: true, v0: 113, v1: 114, trait: 'fadeLine' },
      { vis: true, v0: 115, v1: 116, trait: 'fadeLine' },
      { vis: true, v0: 118, v1: 117, trait: 'fadeLine' },
      { vis: true, v0: 120, v1: 119, trait: 'fadeLine' },
      { vis: true, v0: 125, v1: 124, trait: 'fadeLine' },
      { vis: true, v0: 127, v1: 126, x: 50, trait: 'fadeLine' },
      { vis: true, v0: 130, v1: 131, curve: 180, trait: 'fadeLine' },
      { vis: true, v0: 133, v1: 132, x: 80, trait: 'fadeLine' },
      { vis: true, v0: 136, v1: 135, x: 95, trait: 'fadeLine' },
      { vis: true, v0: 116, v1: 117, curve: -110, trait: 'fadeLine' },
      { curve: 110, vis: true, v0: 123, v1: 124, trait: 'fadeLine' },
      { curve: 180, vis: true, v0: 128, v1: 129, trait: 'fadeLine' },
      { curve: -180, vis: true, v0: 128, v1: 129, trait: 'fadeLine' },
      { curve: -180, vis: true, v0: 130, v1: 131, trait: 'fadeLine' },
      { vis: true, v0: 134, v1: 135, curve: 110, trait: 'fadeLine' },

      { vis: true, color: 'c7e6bd', bCoef: 0, trait: 'Line', v0: 140, v1: 141 },
      { vis: true, color: 'c7e6bd', bCoef: 0, trait: 'Line', v0: 0, v1: 3 },

      { vis: false, bCoef: 0.1, trait: 'kickOffBarrier', v0: 142, v1: 19 },
      { vis: false, bCoef: 0.1, trait: 'kickOffBarrier', v0: 143, v1: 23 },
      { vis: false, trait: 'kickOffBarrier', v0: 19, v1: 23 },

      { trait: 'fadeLine', v0: 146, v1: 147 },
      { trait: 'fadeLine', v0: 148, v1: 149 },
      { trait: 'fadeLine', v0: 150, v1: 151 },
      { trait: 'fadeLine', v0: 152, v1: 153 },
      { trait: 'fadeLine', v0: 154, v1: 155 },
      { trait: 'fadeLine', v0: 156, v1: 157 },
      { trait: 'fadeLine', v0: 158, v1: 159 },
      { trait: 'fadeLine', v0: 160, v1: 161 },

      { v0: 162, v1: 163, trait: 'Barrier' },
      { v0: 164, v1: 165, trait: 'Barrier' },
    ],

    goals: [{ p0: [-562, -60], p1: [-562, 60], team: 'red' }],

    discs: [
      { pos: [-562, 60], trait: 'goalPost', color: 'FFCCCC', cMask: ['ball'] },
      { pos: [-562, -60], trait: 'goalPost', color: 'FFCCCC', cMask: ['ball'] },
      { pos: [562, 60], trait: 'goalPost', color: 'CCCCFF', cMask: ['ball'] },
      { pos: [562, -60], trait: 'goalPost', color: 'CCCCFF', cMask: ['ball'] },
    ],

    planes: [
      { normal: [0, 1], dist: -300, trait: 'ballArea' },
      { normal: [0, -1], dist: -300, trait: 'ballArea' },

      { normal: [0, 1], dist: -350, bCoef: 0.1 },
      { normal: [0, -1], dist: -350, bCoef: 0.1 },
      { normal: [1, 0], dist: -720, bCoef: 0.1 },
      { normal: [-1, 0], dist: -720, bCoef: 0.1 },
    ],

    traits: {
      Line: { vis: true, bCoef: 0, cGroup: [0], cMask: [0], color: [199, 230, 189] },
      fadeLine: { vis: true, bCoef: 0, cGroup: [0], cMask: [0], color: [150, 173, 142] },
      ballArea: { vis: false, bCoef: 1, cMask: ['ball'] },
      goalPost: { radius: 2, invMass: 0, bCoef: 0.5 },
      goalNet: { vis: true, bCoef: 0.1, cMask: [0] },
      kickOffBarrier: {
        vis: false,
        bCoef: 0.1,
        cGroup: ['redKO', 'blueKO'],
        cMask: ['red', 'blue'],
      },
      RedKOBarrier: { vis: false, bCoef: 0.1, cGroup: ['redKO'], cMask: ['red', 'blue'] },
      BlueKOBarrier: { vis: false, bCoef: 0.1, cGroup: ['blueKO'], cMask: ['red', 'blue'] },
      Barrier: { vis: false, bCoef: 0.1, cMask: ['red', 'blue'] },
      powerboost: { vis: false, bCoef: -2.4, cMask: ['ball'] },
    },

    ballPhysics: {
      radius: BALL_RADIUS,
    },
  };

  return JSON.stringify(map);
}

export default blue_getConversion;
