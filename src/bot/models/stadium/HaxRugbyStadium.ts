/* eslint-disable @typescript-eslint/no-explicit-any */

import { IPosition } from 'inversihax';
import { BALL_RADIUS, PLAYER_RADIUS } from '../../constants/constants';
import MapSizeEnum from '../../enums/stadium/MapSizeEnum';
import TraitEnum from '../../enums/stadium/TraitEnum';
import TeamEnum from '../../enums/TeamEnum';
import StadiumService, {
  getBallPhysics,
  getDisc,
  getJoint,
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
  public vertexes: any[];
  public segments: any[];
  public goals: any[];
  public discs: any[];
  public joints: any[];
  public planes: any[];
  public ballPhysics: any;

  private serv: StadiumService | null = null;

  constructor(
    name: string,
    tickCount: number,
    matchDuration: number,
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

    goalPostBottomZ: number,
    goalPostTopZ: number,
  ) {
    this.name = name;
    this.serv = new StadiumService(
      tickCount,
      matchDuration,
      dimensions,
      size,
      team,
      kickoffPosition,
      convProps,
      isPenalty,
    );

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
      [TraitEnum.pointDisc]: traits.pointDisc,
      [TraitEnum.ingoalCone]: traits.ingoalCone,
      [TraitEnum.goalNet]: traits.goalNet,
      [TraitEnum.kickOffBarrier]: traits.kickOffBarrier,

      [TraitEnum.null]: traits.null,
      [TraitEnum.playerArea]: traits.playerArea,
      [TraitEnum.redKOBarrier]: traits.redKOBarrier,
      [TraitEnum.blueKOBarrier]: traits.blueKOBarrier,
      [TraitEnum.powerBoost]: traits.powerBoost,

      [TraitEnum.line]: traits.line,
      [TraitEnum.redLine]: traits.redLine,
      [TraitEnum.blueLine]: traits.blueLine,
      [TraitEnum.fadeLine]: traits.fadeLine,
      [TraitEnum.drawingLine]: traits.drawingLine,
      [TraitEnum.shadow]: traits.shadow,
    };

    this.vertexes = [
      getVertex(-width, -height, TraitEnum.ballArea), // 0
      getVertex(-width, height, TraitEnum.ballArea), // 1
      getVertex(width, -height, TraitEnum.ballArea), // 2
      getVertex(width, height, TraitEnum.ballArea), // 3

      getVertex(-goalLineX, -height, TraitEnum.redLine), // 4
      getVertex(-goalLineX, height, TraitEnum.redLine), // 5
      getVertex(goalLineX, -height, TraitEnum.blueLine), // 6
      getVertex(goalLineX, height, TraitEnum.blueLine), // 7

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

      // [REMOVED] Red's non-small in-goal lines

      getVertex(-(width - 1.5), (-4 / 5) * height, TraitEnum.null), // 40
      getVertex(-(goalLineX + 1.5), (-4 / 5) * height, TraitEnum.null), // 41

      getVertex(-width, (-3 / 5) * height, TraitEnum.null), // 42
      getVertex(-goalLineX, (-3 / 5) * height, TraitEnum.null), // 43

      getVertex(-(width - 1.5), (-2 / 5) * height, TraitEnum.null), // 44
      getVertex(-(goalLineX + 1.5), (-2 / 5) * height, TraitEnum.null), // 45

      getVertex(-width, (-1 / 5) * height, TraitEnum.null), // 46
      getVertex(-goalLineX, (-1 / 5) * height, TraitEnum.null), // 47

      getVertex(-width, (1 / 5) * height, TraitEnum.null), // 48
      getVertex(-goalLineX, (1 / 5) * height, TraitEnum.null), // 49

      getVertex(-(width - 1.5), (2 / 5) * height, TraitEnum.null), // 50
      getVertex(-(goalLineX + 1.5), (2 / 5) * height, TraitEnum.null), // 51

      getVertex(-width, (3 / 5) * height, TraitEnum.null), // 52
      getVertex(-goalLineX, (3 / 5) * height, TraitEnum.null), // 53

      getVertex(-(width - 1.5), (4 / 5) * height, TraitEnum.null), // 54
      getVertex(-(goalLineX + 1.5), (4 / 5) * height, TraitEnum.null), // 55

      // [REMOVED] Blue's non-small in-goal lines

      getVertex(width - 1.5, (-4 / 5) * height, TraitEnum.null), // 56
      getVertex(goalLineX + 1.5, (-4 / 5) * height, TraitEnum.null), // 57

      getVertex(width, (-3 / 5) * height, TraitEnum.null), // 58
      getVertex(goalLineX, (-3 / 5) * height, TraitEnum.null), // 59

      getVertex(width - 1.5, (-2 / 5) * height, TraitEnum.null), // 60
      getVertex(goalLineX + 1.5, (-2 / 5) * height, TraitEnum.null), // 61

      getVertex(width, (-1 / 5) * height, TraitEnum.null), // 62
      getVertex(goalLineX, (-1 / 5) * height, TraitEnum.null), // 63

      getVertex(width, (1 / 5) * height, TraitEnum.null), // 64
      getVertex(goalLineX, (1 / 5) * height, TraitEnum.null), // 65

      getVertex(width - 1.5, (2 / 5) * height, TraitEnum.null), // 66
      getVertex(goalLineX + 1.5, (2 / 5) * height, TraitEnum.null), // 67

      getVertex(width, (3 / 5) * height, TraitEnum.null), // 68
      getVertex(goalLineX, (3 / 5) * height, TraitEnum.null), // 69

      getVertex(width - 1.5, (4 / 5) * height, TraitEnum.null), // 70
      getVertex(goalLineX + 1.5, (4 / 5) * height, TraitEnum.null), // 71

      // [REMOVED] small in-goal lines

      /* 72 */ getVertex(-width, -goalPostY, TraitEnum.null),
      /* 73 */ getVertex(-goalLineX, -goalPostY, TraitEnum.null),

      /* 74 */ getVertex(-width, goalPostY, TraitEnum.null),
      /* 75 */ getVertex(-goalLineX, goalPostY, TraitEnum.null),

      /* 76 */ getVertex(width, -goalPostY, TraitEnum.null),
      /* 77 */ getVertex(goalLineX, -goalPostY, TraitEnum.null),

      /* 78 */ getVertex(width, goalPostY, TraitEnum.null),
      /* 79 */ getVertex(goalLineX, goalPostY, TraitEnum.null),

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
       *  TODO 3: [DONE] bring drawings closer to field in small
       *  TODO 4: add rugby H post effect to H in HaxRugby
       *  TODO 5: [doing] add light team colors to in-goal
       *  TODO 6: [DONE] add goal posts shadows
       *  TODO 7: add intense team colors to the line between goal posts
       */

      // "JP's" drawing lines

      /* 140 */ { x: -15, y: -this.serv.dHeight - 40, trait: 'drawingLine' },
      /* 141 */ { x: -15, y: -this.serv.dHeight - 16, trait: 'drawingLine' },
      /* 142 */ { x: -27, y: -this.serv.dHeight - 5, trait: 'drawingLine' },
      /* 143 */ { x: -10, y: -this.serv.dHeight - 10, trait: 'drawingLine' },
      /* 144 */ { x: -10, y: -this.serv.dHeight - 40, curve: 230, trait: 'drawingLine' },
      /* 145 */ { x: -10, y: -this.serv.dHeight - 25, curve: 230, trait: 'drawingLine' },
      /* 146 */ { x: 7, y: -this.serv.dHeight - 45, curve: 0, trait: 'drawingLine' },
      /* 147 */ { x: 7, y: -this.serv.dHeight - 35, curve: 0, trait: 'drawingLine' },
      /* 148 */ { x: 25, y: -this.serv.dHeight - 26, curve: -120, trait: 'drawingLine' },
      /* 149 */ { x: 10, y: -this.serv.dHeight - 24, curve: -120, trait: 'drawingLine' },
      /* 150 */ { x: 17.5, y: -this.serv.dHeight - 20, curve: 0, trait: 'drawingLine' },
      /* 151 */ { x: 25, y: -this.serv.dHeight - 16, curve: 120, trait: 'drawingLine' },
      /* 152 */ { x: 10, y: -this.serv.dHeight - 14, curve: 120, trait: 'drawingLine' },

      // empty drawing vertexes

      /* 153 */ { x: 0, y: 0, trait: 'null' },
      /* 154 */ { x: 0, y: 0, trait: 'null' },
      /* 155 */ { x: 0, y: 0, trait: 'null' },
      /* 156 */ { x: 0, y: 0, trait: 'null' },
      /* 157 */ { x: 0, y: 0, trait: 'null' },
      /* 158 */ { x: 0, y: 0, trait: 'null' },
      /* 159 */ { x: 0, y: 0, trait: 'null' },

      // "Rugby" drawing vertexes - part 1

      /* 160 */ { x: -17, y: this.serv.dHeight + 10, curve: 230, trait: 'drawingLine' },
      /* 161 */ { x: -17, y: this.serv.dHeight + 40, trait: 'drawingLine' },
      /* 162 */ { x: -17, y: this.serv.dHeight + 25, curve: 230, trait: 'drawingLine' },
      /* 163 */ { x: -8, y: this.serv.dHeight + 24, curve: 0, trait: 'drawingLine' },
      /* 164 */ { x: -2, y: this.serv.dHeight + 40, curve: 0, trait: 'drawingLine' },
      /* 165 */ { x: 3, y: this.serv.dHeight + 35, curve: -110, trait: 'drawingLine' },
      /* 166 */ { x: 18, y: this.serv.dHeight + 35, trait: 'drawingLine', curve: -110 },
      /* 167 */ { x: 18, y: this.serv.dHeight + 40, trait: 'drawingLine' },
      /* 168 */ { x: 38, y: this.serv.dHeight + 20, trait: 'drawingLine' },
      /* 169 */ { x: 38, y: this.serv.dHeight + 43, trait: 'drawingLine', curve: -110 },
      /* 170 */ { x: 23, y: this.serv.dHeight + 43, trait: 'drawingLine', curve: -110 },
      /* 171 */ { x: 43, y: this.serv.dHeight + 40, curve: 0, trait: 'drawingLine' },
      /* 172 */ { x: 43, y: this.serv.dHeight + 5, curve: 0, trait: 'drawingLine' },
      /* 173 */ { x: 43, y: this.serv.dHeight + 25, curve: 290, trait: 'drawingLine' },
      /* 174 */ { x: 63, y: this.serv.dHeight + 20, curve: 0, trait: 'drawingLine' },
      /* 175 */ { x: 70.5, y: this.serv.dHeight + 35, curve: 0, trait: 'drawingLine' },
      /* 176 */ { x: 78, y: this.serv.dHeight + 20, trait: 'drawingLine' },
      /* 177 */ { x: 63, y: this.serv.dHeight + 50, trait: 'drawingLine' },

      // empty drawing vertexes

      /* 178 */ { x: 10, y: 310, trait: 'null' },
      /* 179 */ { x: 10, y: 335, trait: 'null', curve: -110 },
      /* 180 */ { x: 25, y: 335, trait: 'null', curve: -110 },
      /* 181 */ { x: 25, y: 310, trait: 'null' },
      /* 182 */ { x: 30, y: 320, trait: 'null' },
      /* 183 */ { x: 30, y: 340, trait: 'null' },

      // "Rugby" drawing vertexes - part 2

      /* 184 */ { x: 38, y: this.serv.dHeight + 25, curve: -290, trait: 'drawingLine' },
      /* 185 */ { x: 43, y: this.serv.dHeight + 35, curve: 290, trait: 'drawingLine' },

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

      /* 200 */ { x: 3, y: this.serv.dHeight + 20, curve: 0, trait: 'drawingLine' },
      /* 201 */ { x: 18, y: this.serv.dHeight + 20, trait: 'drawingLine' },
      /* 202 */ { x: 38, y: this.serv.dHeight + 35, curve: -290, trait: 'drawingLine' },

      // "Hax" drawing vertexes

      /* 203 */ { bCoef: 0, trait: 'drawingLine', x: -77, y: this.serv.dHeight + 10 },
      /* 204 */ { bCoef: 0, trait: 'drawingLine', x: -77, y: this.serv.dHeight + 25 },
      /* 205 */ { bCoef: 0, trait: 'drawingLine', x: -77, y: this.serv.dHeight + 40 },
      /* 206 */ { bCoef: 0, trait: 'drawingLine', x: -62, y: this.serv.dHeight + 10 },
      /* 207 */ { bCoef: 0, trait: 'drawingLine', x: -62, y: this.serv.dHeight + 25 },
      /* 208 */ { bCoef: 0, trait: 'drawingLine', x: -62, y: this.serv.dHeight + 40 },
      /* 209 */ {
        bCoef: 0,
        trait: 'drawingLine',
        x: -57,
        y: this.serv.dHeight + 25,
        curve: 110,
      },
      /* 210 */ { bCoef: 0, trait: 'drawingLine', x: -44, y: this.serv.dHeight + 25, curve: 0 },
      /* 211 */ { bCoef: 0, trait: 'drawingLine', x: -44, y: this.serv.dHeight + 28, curve: 0 },
      /* 212 */ { bCoef: 0, trait: 'drawingLine', x: -54, y: this.serv.dHeight + 30, curve: 0 },
      /* 213 */ { bCoef: 0, trait: 'drawingLine', x: -49, y: this.serv.dHeight + 38 },
      /* 214 */ {
        bCoef: 0,
        trait: 'drawingLine',
        x: -44,
        y: this.serv.dHeight + 36,
        curve: -100,
      },
      /* 215 */ {
        bCoef: 0,
        trait: 'drawingLine',
        x: -41,
        y: this.serv.dHeight + 38,
        curve: -100,
      },
      /* 216 */ { bCoef: 0, trait: 'drawingLine', x: -37, y: this.serv.dHeight + 20 },
      /* 217 */ { bCoef: 0, trait: 'drawingLine', x: -22, y: this.serv.dHeight + 40 },
      /* 218 */ { bCoef: 0, trait: 'drawingLine', x: -37, y: this.serv.dHeight + 40 },
      /* 219 */ { bCoef: 0, trait: 'drawingLine', x: -22, y: this.serv.dHeight + 20 },

      // empty drawing vertexes

      // // 220s
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },

      // // 230s
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },

      // // 240s
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },

      // // 250s
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },

      // // 260s
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },

      // // 270s
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },

      // // 280s
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },

      // // 290s
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
      // { x: 0, y: 0, trait: 'null' },
    ];

    this.segments = [
      getSegment(0, 1, TraitEnum.ballArea),
      getSegment(2, 3, TraitEnum.ballArea),

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

      // in-goal segments
      getSegment(4, 5, TraitEnum.line),
      getSegment(6, 7, TraitEnum.line),

      // colored in-goal segments
      // getSegment(0, 1, TraitEnum.redLine),
      // getSegment(0, 4, TraitEnum.redLine),
      // getSegment(1, 5, TraitEnum.redLine),
      // getSegment(4, 5, TraitEnum.redLine),
      // getSegment(2, 3, TraitEnum.blueLine),
      // getSegment(2, 6, TraitEnum.blueLine),
      // getSegment(3, 7, TraitEnum.blueLine),
      // getSegment(6, 7, TraitEnum.blueLine),

      this.serv.getLeftKOSegment(24, 25),
      this.serv.getRightKOSegment(26, 27),

      this.serv.getKickOffSegment(28, 29),

      this.serv.getBallSegment(30, 31),

      // TODO: improve these 3 lines
      this.serv.getConversionSegment(32, 33, TraitEnum.playerArea),
      this.serv.getConversionSegment(34, 37, TraitEnum.kickOffBarrier),
      this.serv.getConversionSegment(38, 39, TraitEnum.playerArea),

      // [REMOVED] Red's non-small in-goal lines

      // getSegment(40, 41, this.serv.getNonSmallTrait(TraitEnum.fadeLine)),
      // getSegment(42, 43, this.serv.getNonSmallTrait(TraitEnum.line)),
      // getSegment(44, 45, this.serv.getNonSmallTrait(TraitEnum.fadeLine)),
      // getSegment(46, 47, this.serv.getNonSmallTrait(TraitEnum.line)),
      // getSegment(48, 49, this.serv.getNonSmallTrait(TraitEnum.line)),
      // getSegment(50, 51, this.serv.getNonSmallTrait(TraitEnum.fadeLine)),
      // getSegment(52, 53, this.serv.getNonSmallTrait(TraitEnum.line)),
      // getSegment(54, 55, this.serv.getNonSmallTrait(TraitEnum.fadeLine)),

      // [REMOVED] Blue's non-small in-goal lines

      // getSegment(56, 57, this.serv.getNonSmallTrait(TraitEnum.fadeLine)),
      // getSegment(58, 59, this.serv.getNonSmallTrait(TraitEnum.line)),
      // getSegment(60, 61, this.serv.getNonSmallTrait(TraitEnum.fadeLine)),
      // getSegment(62, 63, this.serv.getNonSmallTrait(TraitEnum.line)),
      // getSegment(64, 65, this.serv.getNonSmallTrait(TraitEnum.line)),
      // getSegment(66, 67, this.serv.getNonSmallTrait(TraitEnum.fadeLine)),
      // getSegment(68, 69, this.serv.getNonSmallTrait(TraitEnum.line)),
      // getSegment(70, 71, this.serv.getNonSmallTrait(TraitEnum.fadeLine)),

      // [REMOVED] small in-goal lines

      // getSegment(72, 73, this.serv.getSmallTrait(TraitEnum.line)),
      // getSegment(74, 75, this.serv.getSmallTrait(TraitEnum.line)),
      // getSegment(76, 77, this.serv.getSmallTrait(TraitEnum.line)),
      // getSegment(78, 79, this.serv.getSmallTrait(TraitEnum.line)),

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

      { vis: true, v0: 140, v1: 141, trait: 'drawingLine' },
      { vis: true, v0: 141, v1: 142, curve: 106.99711775898741, trait: 'drawingLine' },
      { vis: true, v0: 144, v1: 143, trait: 'drawingLine' },
      { vis: true, v0: 144, v1: 145, curve: 230, trait: 'drawingLine' },
      { curve: 0, vis: true, v0: 146, v1: 147, trait: 'drawingLine' },
      { curve: -120, vis: true, v0: 148, v1: 149, trait: 'drawingLine' },
      { curve: -80, vis: true, v0: 149, v1: 150, trait: 'drawingLine' },
      { curve: 80, vis: true, v0: 150, v1: 151, trait: 'drawingLine' },
      { curve: 120, vis: true, v0: 151, v1: 152, trait: 'drawingLine' },

      // "Rugby" drawing lines

      { vis: true, v0: 160, v1: 161, trait: 'drawingLine' },
      { vis: true, v0: 160, v1: 162, curve: 230, trait: 'drawingLine' },
      { curve: 0, vis: true, v0: 164, v1: 163, trait: 'drawingLine' },
      { curve: -110, vis: true, v0: 165, v1: 166, trait: 'drawingLine' },
      { curve: 0, vis: true, v0: 200, v1: 165, trait: 'drawingLine' },
      { curve: 0, vis: true, v0: 201, v1: 167, trait: 'drawingLine' },
      { curve: 0, vis: true, v0: 168, v1: 169, trait: 'drawingLine' },
      { curve: -110, vis: true, v0: 170, v1: 169, trait: 'drawingLine' },
      { vis: true, v0: 184, v1: 169, x: -45, trait: 'drawingLine' },
      { curve: -290, vis: true, v0: 184, v1: 202, trait: 'drawingLine' },
      { curve: 0, vis: true, v0: 171, v1: 172, trait: 'drawingLine' },
      { curve: 290, vis: true, v0: 173, v1: 185, trait: 'drawingLine' },
      { curve: 0, vis: true, v0: 174, v1: 175, trait: 'drawingLine' },
      { curve: 0, vis: true, v0: 176, v1: 177, trait: 'drawingLine' },

      // "Hax" drawing lines

      { vis: true, trait: 'drawingLine', v0: 203, v1: 205 },
      { vis: true, trait: 'drawingLine', v0: 204, v1: 207 },
      { vis: true, trait: 'drawingLine', v0: 206, v1: 208 },
      { vis: true, trait: 'drawingLine', v0: 209, v1: 210, curve: 110 },
      { curve: 0, vis: true, trait: 'drawingLine', v0: 211, v1: 212 },
      { curve: -175, vis: true, trait: 'drawingLine', v0: 212, v1: 213 },
      { curve: -20, vis: true, trait: 'drawingLine', v0: 213, v1: 214 },
      { curve: 0, vis: true, trait: 'drawingLine', v0: 210, v1: 214 },
      { curve: -100, vis: true, trait: 'drawingLine', v0: 214, v1: 215 },
      { vis: true, trait: 'drawingLine', v0: 216, v1: 217 },
      { vis: true, trait: 'drawingLine', v0: 218, v1: 219 },
    ];

    if (!convProps) {
      this.goals = [];
    } else {
      this.goals = [this.serv.getConversionGoal()];
    }

    this.discs = [
      // goal post discs

      /* 1 */ getDisc([-goalLineX, -goalPostY], TraitEnum.goalPost),
      /* 2 */ getDisc([-goalLineX, goalPostY], TraitEnum.goalPost),
      /* 3 */ getDisc([goalLineX, -goalPostY], TraitEnum.goalPost),
      /* 4 */ getDisc([goalLineX, goalPostY], TraitEnum.goalPost),

      // goal post shadow discs

      /* 5 */ getDisc(
        [-goalLineX + this.serv.getShadowFactor() * goalPostBottomZ, -goalPostY + goalPostBottomZ],
        TraitEnum.pointDisc,
        this.serv.getBottomPostXSpeed(),
      ),
      /* 6 */ getDisc(
        [-goalLineX + this.serv.getShadowFactor() * goalPostBottomZ, goalPostY + goalPostBottomZ],
        TraitEnum.pointDisc,
        this.serv.getBottomPostXSpeed(),
      ),
      /* 7 */ getDisc(
        [-goalLineX + this.serv.getShadowFactor() * goalPostTopZ, -goalPostY + goalPostTopZ],
        TraitEnum.pointDisc,
        this.serv.getTopPostXSpeed(),
      ),
      /* 8 */ getDisc(
        [-goalLineX + this.serv.getShadowFactor() * goalPostTopZ, goalPostY + goalPostTopZ],
        TraitEnum.pointDisc,
        this.serv.getTopPostXSpeed(),
      ),

      /* 9 */ getDisc(
        [goalLineX + this.serv.getShadowFactor() * goalPostBottomZ, -goalPostY + goalPostBottomZ],
        TraitEnum.pointDisc,
        this.serv.getBottomPostXSpeed(),
      ),
      /* 10 */ getDisc(
        [goalLineX + this.serv.getShadowFactor() * goalPostBottomZ, goalPostY + goalPostBottomZ],
        TraitEnum.pointDisc,
        this.serv.getBottomPostXSpeed(),
      ),
      /* 11 */ getDisc(
        [goalLineX + this.serv.getShadowFactor() * goalPostTopZ, -goalPostY + goalPostTopZ],
        TraitEnum.pointDisc,
        this.serv.getTopPostXSpeed(),
      ),
      /* 12 */ getDisc(
        [goalLineX + this.serv.getShadowFactor() * goalPostTopZ, goalPostY + goalPostTopZ],
        TraitEnum.pointDisc,
        this.serv.getTopPostXSpeed(),
      ),

      // in-goal cones

      // getDisc([-width, -height], TraitEnum.ingoalCone, colors.redRGB),
      // getDisc([-width, height], TraitEnum.ingoalCone, colors.redRGB),
      // getDisc([-goalLineX, -height], TraitEnum.ingoalCone, colors.redRGB),
      // getDisc([-goalLineX, height], TraitEnum.ingoalCone, colors.redRGB),

      // getDisc([width, -height], TraitEnum.ingoalCone, colors.blueRGB),
      // getDisc([width, height], TraitEnum.ingoalCone, colors.blueRGB),
      // getDisc([goalLineX, -height], TraitEnum.ingoalCone, colors.blueRGB),
      // getDisc([goalLineX, height], TraitEnum.ingoalCone, colors.blueRGB),
    ];

    this.joints = [
      // goal post shadow joints

      getJoint(1, 7, TraitEnum.shadow),
      getJoint(2, 8, TraitEnum.shadow),
      getJoint(5, 6, TraitEnum.shadow),

      getJoint(3, 11, TraitEnum.shadow),
      getJoint(4, 12, TraitEnum.shadow),
      getJoint(9, 10, TraitEnum.shadow),
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
    tickCount: number,
    matchDuration: number,
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
        tickCount,
        matchDuration,
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
        dimensions.goalPostBottomZ,
        dimensions.goalPostTopZ,
      ),
    );
  }
}

export default HaxRugbyStadium;
