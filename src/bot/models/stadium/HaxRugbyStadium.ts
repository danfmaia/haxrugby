/* eslint-disable @typescript-eslint/no-explicit-any */

import { IPosition } from 'inversihax';
import { BALL_RADIUS, PLAYER_RADIUS } from '../../constants/constants';
import MapSizeEnum from '../../enums/stadium/MapSizeEnum';
import TraitEnum from '../../enums/stadium/TraitEnum';
import TeamEnum from '../../enums/TeamEnum';
import StadiumService, {
  getBallPhysics,
  getDisc,
  getPlane,
  getSegment,
  getVertex,
} from '../../services/StadiumService';
import MapDimensions from './MapDimensions';
import TConversionProps from './TConversionProps';
import traits from './traits';

class HaxRugbyStadium {
  public name: string;

  public width: number;
  public height: number;

  public spawnDistance: number;

  public bg: any;
  public traits: any;
  public vertexes: any;
  public segments: any;
  public goals: any;
  public discs: any;
  public planes: any;
  public ballPhysics: any;

  private serv: StadiumService | null = null;

  constructor(
    name: string,
    size: MapSizeEnum,
    team: TeamEnum,
    kickoffPosition: IPosition = { x: 0, y: 0 },
    convProps: TConversionProps | null = null,
    isPenalty: boolean = false,

    dimensions: MapDimensions,

    outerWidth: number,
    outerHeight: number,
    width: number,
    height: number,

    spawnDistance: number,

    goalLineX: number,
    goalPostY: number,
    miniArea: number,
    kickoffLineX: number,
    areaLineX: number,
  ) {
    this.name = name;
    this.serv = new StadiumService(dimensions, size, team, kickoffPosition, convProps, isPenalty);

    this.width = outerWidth;
    this.height = size === MapSizeEnum.NORMAL ? outerHeight : outerHeight - 15;

    this.spawnDistance = spawnDistance;

    this.bg = {
      type: 'grass',
      width: width,
      height: height,
      kickOffRadius: 0,
      cornerRadius: 0,
    };

    this.traits = {
      [TraitEnum.ballArea]: traits.ballArea,
      [TraitEnum.goalPost]: traits.goalPost,
      [TraitEnum.goalNet]: traits.goalNet,
      [TraitEnum.kickOffBarrier]: traits.kickOffBarrier,

      [TraitEnum.null]: traits.null,
      [TraitEnum.playerArea]: traits.playerArea,
      [TraitEnum.line]: traits.line,
      [TraitEnum.fadeLine]: traits.fadeLine,
      [TraitEnum.redKOBarrier]: traits.redKOBarrier,
      [TraitEnum.blueKOBarrier]: traits.blueKOBarrier,
      [TraitEnum.powerBoost]: traits.powerBoost,
    };

    this.vertexes = [
      getVertex(-width, -height, TraitEnum.ballArea), // 0
      getVertex(-width, height, TraitEnum.ballArea), // 1
      getVertex(width, -height, TraitEnum.ballArea), // 2
      getVertex(width, height, TraitEnum.ballArea), // 3

      getVertex(-goalLineX, -height, TraitEnum.line), // 4
      getVertex(-goalLineX, height, TraitEnum.line), // 5
      getVertex(goalLineX, -height, TraitEnum.line), // 6
      getVertex(goalLineX, height, TraitEnum.line), // 7

      getVertex(-goalLineX, -(goalPostY + miniArea), TraitEnum.line), // 8
      getVertex(-(goalLineX - miniArea), -goalPostY, TraitEnum.line), // 9
      getVertex(-(goalLineX - miniArea), goalPostY, TraitEnum.line), // 10
      getVertex(-goalLineX, goalPostY + miniArea, TraitEnum.line), // 11
      getVertex(goalLineX, -(goalPostY + miniArea), TraitEnum.line), // 12
      getVertex(goalLineX - miniArea, -goalPostY, TraitEnum.line), // 13
      getVertex(goalLineX - miniArea, goalPostY, TraitEnum.line), // 14
      getVertex(goalLineX, goalPostY + miniArea, TraitEnum.line), // 15

      getVertex(-areaLineX, -height, TraitEnum.line), // 16
      getVertex(-areaLineX, height, TraitEnum.line), // 17
      getVertex(areaLineX, -height, TraitEnum.line), // 18
      getVertex(areaLineX, height, TraitEnum.line), // 19

      getVertex(-kickoffLineX, -(height - 1.5), TraitEnum.fadeLine), // 20
      getVertex(-kickoffLineX, height - 1.5, TraitEnum.fadeLine), // 21
      getVertex(kickoffLineX, -(height - 1.5), TraitEnum.fadeLine), // 22
      getVertex(kickoffLineX, height - 1.5, TraitEnum.fadeLine), // 23

      getVertex(this.serv.getLeftKickoffX(), -outerHeight, this.serv.getLeftKOBarrierTrait()), // 24
      getVertex(this.serv.getLeftKickoffX(), outerHeight, this.serv.getLeftKOBarrierTrait()), // 25
      getVertex(this.serv.getRightKickoffX(), -outerHeight, this.serv.getRightKOBarrierTrait()), // 26
      getVertex(this.serv.getRightKickoffX(), outerHeight, this.serv.getRightKOBarrierTrait()), // 27

      getVertex(kickoffPosition.x, -outerHeight, TraitEnum.kickOffBarrier), // 28
      getVertex(kickoffPosition.x, outerHeight, TraitEnum.kickOffBarrier), // 29

      this.serv.getTopBallVertex(), // 30
      this.serv.getBottomBallVertex(), // 31

      getVertex(
        this.serv.getSign() * (areaLineX + PLAYER_RADIUS),
        -outerHeight,
        TraitEnum.playerArea,
      ), // 32
      getVertex(
        this.serv.getSign() * (areaLineX + PLAYER_RADIUS),
        outerHeight,
        TraitEnum.playerArea,
      ), // 33

      // TODO: improve these lines
      getVertex(this.serv.getSign() * goalLineX, -outerHeight, TraitEnum.kickOffBarrier), // 34
      getVertex(this.serv.getSign() * goalLineX, -goalPostY, TraitEnum.null), // 35
      getVertex(this.serv.getSign() * goalLineX, goalPostY, TraitEnum.null), // 36
      getVertex(this.serv.getSign() * goalLineX, outerHeight, TraitEnum.kickOffBarrier), // 37

      getVertex(this.serv.getSign() * width, -outerHeight, TraitEnum.playerArea), // 38
      getVertex(this.serv.getSign() * width, outerHeight, TraitEnum.playerArea), // 39

      // Red's non-small in-goal lines

      getVertex(-(width - 1.5), (-4 / 5) * height, TraitEnum.fadeLine), // 40
      getVertex(-(goalLineX + 1.5), (-4 / 5) * height, TraitEnum.fadeLine), // 41

      getVertex(-width, (-3 / 5) * height, TraitEnum.line), // 42
      getVertex(-goalLineX, (-3 / 5) * height, TraitEnum.line), // 43

      getVertex(-(width - 1.5), (-2 / 5) * height, TraitEnum.fadeLine), // 44
      getVertex(-(goalLineX + 1.5), (-2 / 5) * height, TraitEnum.fadeLine), // 45

      getVertex(-width, (-1 / 5) * height, TraitEnum.line), // 46
      getVertex(-goalLineX, (-1 / 5) * height, TraitEnum.line), // 47

      getVertex(-width, (1 / 5) * height, TraitEnum.line), // 48
      getVertex(-goalLineX, (1 / 5) * height, TraitEnum.line), // 49

      getVertex(-(width - 1.5), (2 / 5) * height, TraitEnum.fadeLine), // 50
      getVertex(-(goalLineX + 1.5), (2 / 5) * height, TraitEnum.fadeLine), // 51

      getVertex(-width, (3 / 5) * height, TraitEnum.line), // 52
      getVertex(-goalLineX, (3 / 5) * height, TraitEnum.line), // 53

      getVertex(-(width - 1.5), (4 / 5) * height, TraitEnum.fadeLine), // 54
      getVertex(-(goalLineX + 1.5), (4 / 5) * height, TraitEnum.fadeLine), // 55

      // Blue's non-small in-goal lines

      getVertex(width - 1.5, (-4 / 5) * height, TraitEnum.fadeLine), // 56
      getVertex(goalLineX + 1.5, (-4 / 5) * height, TraitEnum.fadeLine), // 57

      getVertex(width, (-3 / 5) * height, TraitEnum.line), // 58
      getVertex(goalLineX, (-3 / 5) * height, TraitEnum.line), // 59

      getVertex(width - 1.5, (-2 / 5) * height, TraitEnum.fadeLine), // 60
      getVertex(goalLineX + 1.5, (-2 / 5) * height, TraitEnum.fadeLine), // 61

      getVertex(width, (-1 / 5) * height, TraitEnum.line), // 62
      getVertex(goalLineX, (-1 / 5) * height, TraitEnum.line), // 63

      getVertex(width, (1 / 5) * height, TraitEnum.line), // 64
      getVertex(goalLineX, (1 / 5) * height, TraitEnum.line), // 65

      getVertex(width - 1.5, (2 / 5) * height, TraitEnum.fadeLine), // 66
      getVertex(goalLineX + 1.5, (2 / 5) * height, TraitEnum.fadeLine), // 67

      getVertex(width, (3 / 5) * height, TraitEnum.line), // 68
      getVertex(goalLineX, (3 / 5) * height, TraitEnum.line), // 69

      getVertex(width - 1.5, (4 / 5) * height, TraitEnum.fadeLine), // 70
      getVertex(goalLineX + 1.5, (4 / 5) * height, TraitEnum.fadeLine), // 71

      // small in-goal lines

      /* 72 */ getVertex(-width, -goalPostY, TraitEnum.line),
      /* 73 */ getVertex(-goalLineX, -goalPostY, TraitEnum.line),

      /* 74 */ getVertex(-width, goalPostY, TraitEnum.line),
      /* 75 */ getVertex(-goalLineX, goalPostY, TraitEnum.line),

      /* 76 */ getVertex(width, -goalPostY, TraitEnum.line),
      /* 77 */ getVertex(goalLineX, -goalPostY, TraitEnum.line),

      /* 78 */ getVertex(width, goalPostY, TraitEnum.line),
      /* 79 */ getVertex(goalLineX, goalPostY, TraitEnum.line),

      // non-small safe line orientation lines

      /* 80 */ getVertex(-(areaLineX + 5), (-3 / 5) * height, TraitEnum.line),
      /* 81 */ getVertex(-(areaLineX - 5), (-3 / 5) * height, TraitEnum.line),

      /* 82 */ getVertex(-(areaLineX + 10), (-1 / 5) * height, TraitEnum.line),
      /* 83 */ getVertex(-(areaLineX - 10), (-1 / 5) * height, TraitEnum.line),

      /* 84 */ getVertex(-(areaLineX + 10), (1 / 5) * height, TraitEnum.line),
      /* 85 */ getVertex(-(areaLineX - 10), (1 / 5) * height, TraitEnum.line),

      /* 86 */ getVertex(-(areaLineX + 5), (3 / 5) * height, TraitEnum.line),
      /* 87 */ getVertex(-(areaLineX - 5), (3 / 5) * height, TraitEnum.line),

      /* 88 */ getVertex(areaLineX + 5, (-3 / 5) * height, TraitEnum.line),
      /* 89 */ getVertex(areaLineX - 5, (-3 / 5) * height, TraitEnum.line),

      /* 90 */ getVertex(areaLineX + 10, (-1 / 5) * height, TraitEnum.line),
      /* 91 */ getVertex(areaLineX - 10, (-1 / 5) * height, TraitEnum.line),

      /* 92 */ getVertex(areaLineX + 10, (1 / 5) * height, TraitEnum.line),
      /* 93 */ getVertex(areaLineX - 10, (1 / 5) * height, TraitEnum.line),

      /* 94 */ getVertex(areaLineX + 5, (3 / 5) * height, TraitEnum.line),
      /* 95 */ getVertex(areaLineX - 5, (3 / 5) * height, TraitEnum.line),

      // non-small kickoff line orientation lines

      /* 96 */ getVertex(-(kickoffLineX + 5), (-3 / 5) * height, TraitEnum.fadeLine),
      /* 97 */ getVertex(-(kickoffLineX - 5), (-3 / 5) * height, TraitEnum.fadeLine),

      /* 98 */ getVertex(-(kickoffLineX + 10), (-1 / 5) * height, TraitEnum.fadeLine),
      /* 99 */ getVertex(-(kickoffLineX - 10), (-1 / 5) * height, TraitEnum.fadeLine),

      /* 100 */ getVertex(-(kickoffLineX + 10), (1 / 5) * height, TraitEnum.fadeLine),
      /* 101 */ getVertex(-(kickoffLineX - 10), (1 / 5) * height, TraitEnum.fadeLine),

      /* 102 */ getVertex(-(kickoffLineX + 5), (3 / 5) * height, TraitEnum.fadeLine),
      /* 103 */ getVertex(-(kickoffLineX - 5), (3 / 5) * height, TraitEnum.fadeLine),

      /* 104 */ getVertex(kickoffLineX + 5, (-3 / 5) * height, TraitEnum.fadeLine),
      /* 105 */ getVertex(kickoffLineX - 5, (-3 / 5) * height, TraitEnum.fadeLine),

      /* 106 */ getVertex(kickoffLineX + 10, (-1 / 5) * height, TraitEnum.fadeLine),
      /* 107 */ getVertex(kickoffLineX - 10, (-1 / 5) * height, TraitEnum.fadeLine),

      /* 108 */ getVertex(kickoffLineX + 10, (1 / 5) * height, TraitEnum.fadeLine),
      /* 109 */ getVertex(kickoffLineX - 10, (1 / 5) * height, TraitEnum.fadeLine),

      /* 110 */ getVertex(kickoffLineX + 5, (3 / 5) * height, TraitEnum.fadeLine),
      /* 111 */ getVertex(kickoffLineX - 5, (3 / 5) * height, TraitEnum.fadeLine),

      // non-small midline orientation lines

      /* 112 */ getVertex(-5, (-3 / 5) * height, TraitEnum.line),
      /* 113 */ getVertex(5, (-3 / 5) * height, TraitEnum.line),

      /* 114 */ getVertex(-10, (-1 / 5) * height, TraitEnum.line),
      /* 115 */ getVertex(10, (-1 / 5) * height, TraitEnum.line),

      /* 116 */ getVertex(-10, (1 / 5) * height, TraitEnum.line),
      /* 117 */ getVertex(10, (1 / 5) * height, TraitEnum.line),

      /* 118 */ getVertex(-5, (3 / 5) * height, TraitEnum.line),
      /* 119 */ getVertex(5, (3 / 5) * height, TraitEnum.line),

      // small safe line orientation lines

      /* 120 */ getVertex(-(areaLineX + 5), -goalPostY, TraitEnum.line),
      /* 121 */ getVertex(-(areaLineX - 5), -goalPostY, TraitEnum.line),

      /* 122 */ getVertex(-(areaLineX + 5), goalPostY, TraitEnum.line),
      /* 123 */ getVertex(-(areaLineX - 5), goalPostY, TraitEnum.line),

      /* 124 */ getVertex(areaLineX + 5, -goalPostY, TraitEnum.line),
      /* 125 */ getVertex(areaLineX - 5, -goalPostY, TraitEnum.line),

      /* 126 */ getVertex(areaLineX + 5, goalPostY, TraitEnum.line),
      /* 127 */ getVertex(areaLineX - 5, goalPostY, TraitEnum.line),

      // small kickoff line orientation lines

      /* 128 */ getVertex(-(kickoffLineX + 5), -goalPostY, TraitEnum.fadeLine),
      /* 129 */ getVertex(-(kickoffLineX - 5), -goalPostY, TraitEnum.fadeLine),

      /* 130 */ getVertex(-(kickoffLineX + 5), goalPostY, TraitEnum.fadeLine),
      /* 131 */ getVertex(-(kickoffLineX - 5), goalPostY, TraitEnum.fadeLine),

      /* 132 */ getVertex(kickoffLineX + 5, -goalPostY, TraitEnum.fadeLine),
      /* 133 */ getVertex(kickoffLineX - 5, -goalPostY, TraitEnum.fadeLine),

      /* 134 */ getVertex(kickoffLineX + 5, goalPostY, TraitEnum.fadeLine),
      /* 135 */ getVertex(kickoffLineX - 5, goalPostY, TraitEnum.fadeLine),

      // small midline orientation lines

      /* 136 */ getVertex(-5, -goalPostY, TraitEnum.line),
      /* 137 */ getVertex(5, -goalPostY, TraitEnum.line),

      /* 138 */ getVertex(-5, goalPostY, TraitEnum.line),
      /* 139 */ getVertex(5, goalPostY, TraitEnum.line),

      /**
       *  DRAWING LINES
       *
       *  TODO 1: soften the code
       *  TODO 2: [DONE] replace Rugby Union with HaxRugby
       *  TODO 3: bring drawings closer to field in small
       */

      // "JP's" drawing lines

      /* 140 */ { x: -15, y: -340, trait: 'fadeLine' },
      /* 141 */ { x: -15, y: -316, trait: 'fadeLine' },
      /* 142 */ { x: -27, y: -305, trait: 'fadeLine' },
      /* 143 */ { x: -10, y: -310, trait: 'fadeLine' },
      /* 144 */ { x: -10, y: -340, curve: 230, trait: 'fadeLine' },
      /* 145 */ { x: -10, y: -325, curve: 230, trait: 'fadeLine' },
      /* 146 */ { x: 7, y: -345, curve: 0, trait: 'fadeLine' },
      /* 147 */ { x: 7, y: -335, curve: 0, trait: 'fadeLine' },
      /* 148 */ { x: 25, y: -326, curve: -120, trait: 'fadeLine' },
      /* 149 */ { x: 10, y: -324, curve: -120, trait: 'fadeLine' },
      /* 150 */ { x: 17.5, y: -320, curve: 0, trait: 'fadeLine' },
      /* 151 */ { x: 25, y: -316, curve: 120, trait: 'fadeLine' },
      /* 152 */ { x: 10, y: -314, curve: 120, trait: 'fadeLine' },

      // empty drawing vertexes

      /* 153 */ { x: 0, y: 0, trait: 'null' },
      /* 154 */ { x: 0, y: 0, trait: 'null' },
      /* 155 */ { x: 0, y: 0, trait: 'null' },
      /* 156 */ { x: 0, y: 0, trait: 'null' },
      /* 157 */ { x: 0, y: 0, trait: 'null' },
      /* 158 */ { x: 0, y: 0, trait: 'null' },
      /* 159 */ { x: 0, y: 0, trait: 'null' },

      // "Rugby" drawing vertexes - part 1

      /* 160 */ { x: -17, y: 310, curve: 230, trait: 'fadeLine' },
      /* 161 */ { x: -17, y: 340, trait: 'fadeLine' },
      /* 162 */ { x: -17, y: 325, curve: 230, trait: 'fadeLine' },
      /* 163 */ { x: -8, y: 324, curve: 0, trait: 'fadeLine' },
      /* 164 */ { x: -2, y: 340, curve: 0, trait: 'fadeLine' },
      /* 165 */ { x: 3, y: 335, curve: -110, trait: 'fadeLine' },
      /* 166 */ { x: 18, y: 335, trait: 'fadeLine', curve: -110 },
      /* 167 */ { x: 18, y: 340, trait: 'fadeLine' },
      /* 168 */ { x: 38, y: 320, trait: 'fadeLine' },
      /* 169 */ { x: 38, y: 343, trait: 'fadeLine', curve: -110 },
      /* 170 */ { x: 23, y: 343, trait: 'fadeLine', curve: -110 },
      /* 171 */ { x: 43, y: 340, curve: 0, trait: 'fadeLine' },
      /* 172 */ { x: 43, y: 305, curve: 0, trait: 'fadeLine' },
      /* 173 */ { x: 43, y: 325, curve: 290, trait: 'fadeLine' },
      /* 174 */ { x: 63, y: 320, curve: 0, trait: 'fadeLine' },
      /* 175 */ { x: 70.5, y: 335, curve: 0, trait: 'fadeLine' },
      /* 176 */ { x: 78, y: 320, trait: 'fadeLine' },
      /* 177 */ { x: 63, y: 350, trait: 'fadeLine' },

      // empty drawing vertexes

      /* 178 */ { x: 10, y: 310, trait: 'null' },
      /* 179 */ { x: 10, y: 335, trait: 'null', curve: -110 },
      /* 180 */ { x: 25, y: 335, trait: 'null', curve: -110 },
      /* 181 */ { x: 25, y: 310, trait: 'null' },
      /* 182 */ { x: 30, y: 320, trait: 'null' },
      /* 183 */ { x: 30, y: 340, trait: 'null' },

      // "Rugby" drawing vertexes - part 2

      /* 184 */ { x: 38, y: 325, curve: -290, trait: 'fadeLine' },
      /* 185 */ { x: 43, y: 335, curve: 290, trait: 'fadeLine' },

      // empty drawing vertexes

      /* 186 */ { x: 30, y: 325, trait: 'null', curve: 110 },
      /* 187 */ { x: 45, y: 325, trait: 'null', curve: 110 },
      /* 188 */ { x: 45, y: 340, trait: 'null' },
      /* 189 */ { x: 50, y: 320, trait: 'null' },
      /* 190 */ { x: 50, y: 340, trait: 'null' },
      /* 191 */ { x: 49, y: 314, trait: 'null' },
      /* 192 */ { x: 51, y: 314, trait: 'null' },
      /* 193 */ { x: 65, y: 320, curve: 180, trait: 'null' },
      /* 194 */ { x: 65, y: 340, curve: 180, trait: 'null' },
      /* 195 */ { x: 80, y: 320, trait: 'null' },
      /* 196 */ { x: 80, y: 340, trait: 'null' },
      /* 197 */ { x: 80, y: 325, trait: 'null', curve: 110 },
      /* 198 */ { x: 95, y: 325, trait: 'null', curve: 110 },
      /* 199 */ { x: 95, y: 340, trait: 'null' },

      // "Rugby" drawing vertexes - part 3

      /* 200 */ { x: 3, y: 320, curve: 0, trait: 'fadeLine' },
      /* 201 */ { x: 18, y: 320, trait: 'fadeLine' },
      /* 202 */ { x: 38, y: 335, curve: -290, trait: 'fadeLine' },

      // "Hax" drawing vertexes

      /* 203 */ { bCoef: 0, trait: 'fadeLine', x: -77, y: 310 },
      /* 204 */ { bCoef: 0, trait: 'fadeLine', x: -77, y: 325 },
      /* 205 */ { bCoef: 0, trait: 'fadeLine', x: -77, y: 340 },
      /* 206 */ { bCoef: 0, trait: 'fadeLine', x: -62, y: 310 },
      /* 207 */ { bCoef: 0, trait: 'fadeLine', x: -62, y: 325 },
      /* 208 */ { bCoef: 0, trait: 'fadeLine', x: -62, y: 340 },
      /* 209 */ { bCoef: 0, trait: 'fadeLine', x: -56, y: 325, curve: 110 },
      /* 210 */ { bCoef: 0, trait: 'fadeLine', x: -43, y: 325, curve: 0 },
      /* 211 */ { bCoef: 0, trait: 'fadeLine', x: -43, y: 328, curve: 0 },
      /* 212 */ { bCoef: 0, trait: 'fadeLine', x: -53, y: 330, curve: 0 },
      /* 213 */ { bCoef: 0, trait: 'fadeLine', x: -48, y: 338 },
      /* 214 */ { bCoef: 0, trait: 'fadeLine', x: -43, y: 336, curve: -100 },
      /* 215 */ { bCoef: 0, trait: 'fadeLine', x: -40, y: 338, curve: -100 },
      /* 216 */ { bCoef: 0, trait: 'fadeLine', x: -37, y: 320 },
      /* 217 */ { bCoef: 0, trait: 'fadeLine', x: -22, y: 340 },
      /* 218 */ { bCoef: 0, trait: 'fadeLine', x: -37, y: 340 },
      /* 219 */ { bCoef: 0, trait: 'fadeLine', x: -22, y: 320 },
    ];

    this.segments = [
      getSegment(0, 1, TraitEnum.ballArea),
      getSegment(2, 3, TraitEnum.ballArea),

      getSegment(4, 5, TraitEnum.line),
      getSegment(6, 7, TraitEnum.line),

      getSegment(8, 9, TraitEnum.line, 90),
      getSegment(9, 10, TraitEnum.line),
      getSegment(10, 11, TraitEnum.line, 90),
      getSegment(12, 13, TraitEnum.line, -90),
      getSegment(13, 14, TraitEnum.line),
      getSegment(14, 15, TraitEnum.line, -90),

      getSegment(16, 17, TraitEnum.line),
      getSegment(18, 19, TraitEnum.line),

      getSegment(20, 21, TraitEnum.fadeLine),
      getSegment(22, 23, TraitEnum.fadeLine),

      this.serv.getLeftKOSegment(24, 25),
      this.serv.getRightKOSegment(26, 27),

      this.serv.getKickOffSegment(28, 29),

      this.serv.getBallSegment(30, 31),

      // TODO: improve these 3 lines
      this.serv.getConversionSegment(32, 33, TraitEnum.playerArea),
      this.serv.getConversionSegment(34, 37, TraitEnum.kickOffBarrier),
      this.serv.getConversionSegment(38, 39, TraitEnum.playerArea),

      // Red's non-small in-goal lines

      getSegment(40, 41, this.serv.getNonSmallTrait(TraitEnum.fadeLine)),
      getSegment(42, 43, this.serv.getNonSmallTrait(TraitEnum.line)),
      getSegment(44, 45, this.serv.getNonSmallTrait(TraitEnum.fadeLine)),
      getSegment(46, 47, this.serv.getNonSmallTrait(TraitEnum.line)),
      getSegment(48, 49, this.serv.getNonSmallTrait(TraitEnum.line)),
      getSegment(50, 51, this.serv.getNonSmallTrait(TraitEnum.fadeLine)),
      getSegment(52, 53, this.serv.getNonSmallTrait(TraitEnum.line)),
      getSegment(54, 55, this.serv.getNonSmallTrait(TraitEnum.fadeLine)),

      // Blue's non-small in-goal lines

      getSegment(56, 57, this.serv.getNonSmallTrait(TraitEnum.fadeLine)),
      getSegment(58, 59, this.serv.getNonSmallTrait(TraitEnum.line)),
      getSegment(60, 61, this.serv.getNonSmallTrait(TraitEnum.fadeLine)),
      getSegment(62, 63, this.serv.getNonSmallTrait(TraitEnum.line)),
      getSegment(64, 65, this.serv.getNonSmallTrait(TraitEnum.line)),
      getSegment(66, 67, this.serv.getNonSmallTrait(TraitEnum.fadeLine)),
      getSegment(68, 69, this.serv.getNonSmallTrait(TraitEnum.line)),
      getSegment(70, 71, this.serv.getNonSmallTrait(TraitEnum.fadeLine)),

      // small in-goal lines

      getSegment(72, 73, this.serv.getSmallTrait(TraitEnum.line)),
      getSegment(74, 75, this.serv.getSmallTrait(TraitEnum.line)),
      getSegment(76, 77, this.serv.getSmallTrait(TraitEnum.line)),
      getSegment(78, 79, this.serv.getSmallTrait(TraitEnum.line)),

      // non-small safe line orientation lines

      getSegment(80, 81, this.serv.getNonSmallTrait(TraitEnum.line)),
      getSegment(82, 83, this.serv.getNonSmallTrait(TraitEnum.line)),
      getSegment(84, 85, this.serv.getNonSmallTrait(TraitEnum.line)),
      getSegment(86, 87, this.serv.getNonSmallTrait(TraitEnum.line)),
      getSegment(88, 89, this.serv.getNonSmallTrait(TraitEnum.line)),
      getSegment(90, 91, this.serv.getNonSmallTrait(TraitEnum.line)),
      getSegment(92, 93, this.serv.getNonSmallTrait(TraitEnum.line)),
      getSegment(94, 95, this.serv.getNonSmallTrait(TraitEnum.line)),

      // non-small kickoff line orientation lines

      getSegment(96, 97, this.serv.getNonSmallTrait(TraitEnum.fadeLine)),
      getSegment(98, 99, this.serv.getNonSmallTrait(TraitEnum.fadeLine)),
      getSegment(100, 101, this.serv.getNonSmallTrait(TraitEnum.fadeLine)),
      getSegment(102, 103, this.serv.getNonSmallTrait(TraitEnum.fadeLine)),
      getSegment(104, 105, this.serv.getNonSmallTrait(TraitEnum.fadeLine)),
      getSegment(106, 107, this.serv.getNonSmallTrait(TraitEnum.fadeLine)),
      getSegment(108, 109, this.serv.getNonSmallTrait(TraitEnum.fadeLine)),
      getSegment(110, 111, this.serv.getNonSmallTrait(TraitEnum.fadeLine)),

      // non-small midline orientation lines

      getSegment(112, 113, this.serv.getNonSmallTrait(TraitEnum.line)),
      getSegment(114, 115, this.serv.getNonSmallTrait(TraitEnum.line)),
      getSegment(116, 117, this.serv.getNonSmallTrait(TraitEnum.line)),
      getSegment(118, 119, this.serv.getNonSmallTrait(TraitEnum.line)),

      // small safe line orientation lines

      getSegment(120, 121, this.serv.getSmallTrait(TraitEnum.line)),
      getSegment(122, 123, this.serv.getSmallTrait(TraitEnum.line)),
      getSegment(124, 125, this.serv.getSmallTrait(TraitEnum.line)),
      getSegment(126, 127, this.serv.getSmallTrait(TraitEnum.line)),

      // small kickoff line orientation lines

      getSegment(128, 129, this.serv.getSmallTrait(TraitEnum.fadeLine)),
      getSegment(130, 131, this.serv.getSmallTrait(TraitEnum.fadeLine)),
      getSegment(132, 133, this.serv.getSmallTrait(TraitEnum.fadeLine)),
      getSegment(134, 135, this.serv.getSmallTrait(TraitEnum.fadeLine)),

      // small midline orientation lines

      getSegment(136, 137, this.serv.getSmallTrait(TraitEnum.line)),
      getSegment(138, 139, this.serv.getSmallTrait(TraitEnum.line)),

      // "JP's" drawing lines

      { vis: true, v0: 140, v1: 141, trait: 'fadeLine' },
      { vis: true, v0: 141, v1: 142, curve: 106.99711775898741, trait: 'fadeLine' },
      { vis: true, v0: 144, v1: 143, trait: 'fadeLine' },
      { vis: true, v0: 144, v1: 145, curve: 230, trait: 'fadeLine' },
      { curve: 0, vis: true, v0: 146, v1: 147, trait: 'fadeLine' },
      { curve: -120, vis: true, v0: 148, v1: 149, trait: 'fadeLine' },
      { curve: -80, vis: true, v0: 149, v1: 150, trait: 'fadeLine' },
      { curve: 80, vis: true, v0: 150, v1: 151, trait: 'fadeLine' },
      { curve: 120, vis: true, v0: 151, v1: 152, y: -312, trait: 'fadeLine' },

      // "Rugby" drawing lines

      { vis: true, v0: 160, v1: 161, trait: 'fadeLine' },
      { vis: true, v0: 160, v1: 162, curve: 230, trait: 'fadeLine' },
      { curve: 0, vis: true, v0: 164, v1: 163, trait: 'fadeLine' },
      { curve: -110, vis: true, v0: 165, v1: 166, trait: 'fadeLine' },
      { curve: 0, vis: true, v0: 200, v1: 165, trait: 'fadeLine' },
      { curve: 0, vis: true, v0: 201, v1: 167, trait: 'fadeLine' },
      { curve: 0, vis: true, v0: 168, v1: 169, trait: 'fadeLine' },
      { curve: -110, vis: true, v0: 170, v1: 169, trait: 'fadeLine' },
      { vis: true, v0: 184, v1: 169, x: -45, trait: 'fadeLine' },
      { curve: -290, vis: true, v0: 184, v1: 202, trait: 'fadeLine' },
      { curve: 0, vis: true, v0: 171, v1: 172, trait: 'fadeLine' },
      { curve: 290, vis: true, v0: 173, v1: 185, trait: 'fadeLine' },
      { curve: 0, vis: true, v0: 174, v1: 175, trait: 'fadeLine' },
      { curve: 0, vis: true, v0: 176, v1: 177, trait: 'fadeLine' },

      // "Hax" drawing lines

      { vis: true, trait: 'fadeLine', v0: 203, v1: 205 },
      { vis: true, trait: 'fadeLine', v0: 204, v1: 207 },
      { vis: true, trait: 'fadeLine', v0: 206, v1: 208 },
      { vis: true, trait: 'fadeLine', v0: 209, v1: 210, curve: 110 },
      { curve: 0, vis: true, trait: 'fadeLine', v0: 211, v1: 212 },
      { curve: -175, vis: true, trait: 'fadeLine', v0: 212, v1: 213 },
      { curve: -20, vis: true, trait: 'fadeLine', v0: 213, v1: 214 },
      { curve: 0, vis: true, trait: 'fadeLine', v0: 210, v1: 214 },
      { curve: -100, vis: true, trait: 'fadeLine', v0: 214, v1: 215 },
      { vis: true, trait: 'fadeLine', v0: 216, v1: 217 },
      { vis: true, trait: 'fadeLine', v0: 218, v1: 219 },
    ];

    if (!convProps) {
      this.goals = [];
    } else {
      this.goals = [this.serv.getConversionGoal()];
    }

    this.discs = [
      // goal posts
      getDisc([-goalLineX, -goalPostY], TraitEnum.goalPost),
      getDisc([-goalLineX, goalPostY], TraitEnum.goalPost),
      getDisc([goalLineX, -goalPostY], TraitEnum.goalPost),
      getDisc([goalLineX, goalPostY], TraitEnum.goalPost),
    ];

    this.planes = [
      getPlane([0, 1], -height, TraitEnum.ballArea),
      getPlane([0, -1], -height, TraitEnum.ballArea),
      getPlane([1, 0], -width, TraitEnum.ballArea),
      getPlane([-1, 0], -width, TraitEnum.ballArea),
      getPlane([0, 1], -outerHeight, TraitEnum.playerArea),
      getPlane([0, -1], -outerHeight, TraitEnum.playerArea),
      getPlane([1, 0], -outerWidth, TraitEnum.playerArea),
      getPlane([-1, 0], -outerWidth, TraitEnum.playerArea),
    ];

    this.ballPhysics = getBallPhysics(BALL_RADIUS);
  }

  public static getNewStadium(
    name: string,
    size: MapSizeEnum,
    dimensions: MapDimensions,
    team: TeamEnum,
    kickoffPosition?: IPosition,
    convProps?: TConversionProps,
    isPenalty?: boolean,
  ): string {
    return JSON.stringify(
      new HaxRugbyStadium(
        name,
        size,
        team,
        kickoffPosition,
        convProps,
        isPenalty,
        dimensions,
        dimensions.outerWidth,
        dimensions.outerHeight,
        dimensions.width,
        dimensions.height,
        dimensions.spawnDistance,
        dimensions.goalLineX,
        dimensions.goalPostY,
        dimensions.miniArea,
        dimensions.kickoffLineX,
        dimensions.areaLineX,
      ),
    );
  }
}

export default HaxRugbyStadium;
