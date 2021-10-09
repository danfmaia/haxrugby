/* eslint-disable @typescript-eslint/no-explicit-any */

import { BALL_RADIUS } from '../../constants/constants';
import TraitEnum from '../../enums/stadium/TraitEnum';
import TeamEnum from '../../enums/TeamEnum';
import StadiumService, {
  getBallPhysics,
  getDisc,
  getPlane,
  getSegment,
  getVertex,
} from '../../services/StadiumService';
import traits from './traits';

class HaxRugbyStadium {
  public name: string;
  public team: TeamEnum;

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

  private service: StadiumService;

  constructor(
    name: string,
    team: TeamEnum,

    outerWidth: number,
    outerHeight: number,

    width: number,
    height: number,

    goalLineX: number,
    goalPostY: number,
    miniArea: number,
    kickoffLineX: number,
    areaLineX: number,
  ) {
    this.name = name;
    this.team = team;
    this.service = new StadiumService(team);

    this.width = outerWidth;
    this.height = outerHeight;

    this.spawnDistance = 150;

    this.bg = {
      type: 'grass',
      width: width,
      height: height,
      kickOffRadius: 0,
      cornerRadius: 0,
    };

    this.traits = {
      ballArea: traits.ballArea,
      goalPost: traits.goalPost,
      goalNet: traits.goalNet,
      kickOffBarrier: traits.kickOffBarrier,

      playerArea: traits.playerArea,
      line: traits.line,
      fadeLine: traits.fadeLine,
      redKOBarrier: traits.redKOBarrier,
      blueKOBarrier: traits.blueKOBarrier,
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

      getVertex(-kickoffLineX, -(height - 5), TraitEnum.fadeLine), // 20
      getVertex(-kickoffLineX, height - 5, TraitEnum.fadeLine), // 21
      getVertex(kickoffLineX, -(height - 5), TraitEnum.fadeLine), // 22
      getVertex(kickoffLineX, height - 5, TraitEnum.fadeLine), // 23

      getVertex(-kickoffLineX, -outerHeight, this.service.getLeftKOBarrierTrait()), // 24
      getVertex(-kickoffLineX, outerHeight, this.service.getLeftKOBarrierTrait()), // 25
      getVertex(kickoffLineX, -outerHeight, this.service.getRightKOBarrierTrait()), // 26
      getVertex(kickoffLineX, outerHeight, this.service.getRightKOBarrierTrait()), // 27

      getVertex(0, -outerHeight, TraitEnum.kickOffBarrier), // 28
      getVertex(0, outerHeight, TraitEnum.kickOffBarrier), // 29
      getVertex(0, -(BALL_RADIUS + 2.3), TraitEnum.kickOffBarrier), // 30
      getVertex(0, BALL_RADIUS + 2.3, TraitEnum.kickOffBarrier), // 31
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

      getSegment(24, 25, this.service.getLeftKOBarrierTrait()),
      getSegment(26, 27, this.service.getRightKOBarrierTrait()),

      getSegment(28, 29, TraitEnum.kickOffBarrier),
      getSegment(30, 31, TraitEnum.kickOffBarrier, this.service.getKickOffCurve()),
    ];

    this.goals = [];

    this.discs = [
      getDisc([-goalLineX, -goalPostY], TraitEnum.goalPost),
      getDisc([-goalLineX, goalPostY], TraitEnum.goalPost),
      getDisc([goalLineX, -goalPostY], TraitEnum.goalPost),
      getDisc([goalLineX, goalPostY], TraitEnum.goalPost),
    ];

    this.planes = [
      getPlane([0, 1], -height, TraitEnum.ballArea),
      getPlane([0, -1], -height, TraitEnum.ballArea),
      getPlane([0, 1], -outerHeight, TraitEnum.playerArea),
      getPlane([0, -1], -outerHeight, TraitEnum.playerArea),
      getPlane([1, 0], -outerWidth, TraitEnum.playerArea),
      getPlane([-1, 0], -outerWidth, TraitEnum.playerArea),
    ];

    this.ballPhysics = getBallPhysics(BALL_RADIUS);
  }

  public static getBaseStadium(
    name: string,
    team: TeamEnum,

    outerWidth: number,
    outerHeight: number,

    width: number,
    height: number,

    goalLineX: number,
    goalPostY: number,
    miniArea: number,
    kickoffLineX: number,
    areaLineX: number,
  ): HaxRugbyStadium {
    return new this(
      name,
      team,
      outerWidth,
      outerHeight,
      width,
      height,
      goalLineX,
      goalPostY,
      miniArea,
      kickoffLineX,
      areaLineX,
    );
  }

  public static getStadium(
    stadium: HaxRugbyStadium,
    name: string,
    team: TeamEnum,
  ): HaxRugbyStadium {
    stadium.name = name;
    stadium.team = team;
    stadium.service = new StadiumService(team);
    return stadium;
  }
}

export default HaxRugbyStadium;
