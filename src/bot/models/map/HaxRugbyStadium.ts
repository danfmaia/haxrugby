/* eslint-disable @typescript-eslint/no-explicit-any */

import { BALL_RADIUS, PLAYER_RADIUS } from '../../constants/constants';
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
  private isConversion: boolean;

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
    team: TeamEnum,
    convProps: TConversionProps | null,

    dimensions: MapDimensions,

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
    this.isConversion = convProps ? true : false;
    this.serv = new StadiumService(dimensions, team, convProps);

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

      getVertex(-kickoffLineX, -(height - 5), TraitEnum.fadeLine), // 20
      getVertex(-kickoffLineX, height - 5, TraitEnum.fadeLine), // 21
      getVertex(kickoffLineX, -(height - 5), TraitEnum.fadeLine), // 22
      getVertex(kickoffLineX, height - 5, TraitEnum.fadeLine), // 23

      getVertex(-kickoffLineX, -outerHeight, this.serv.getLeftKOBarrierTrait()), // 24
      getVertex(-kickoffLineX, outerHeight, this.serv.getLeftKOBarrierTrait()), // 25
      getVertex(kickoffLineX, -outerHeight, this.serv.getRightKOBarrierTrait()), // 26
      getVertex(kickoffLineX, outerHeight, this.serv.getRightKOBarrierTrait()), // 27

      getVertex(0, -outerHeight, TraitEnum.kickOffBarrier), // 28
      getVertex(0, outerHeight, TraitEnum.kickOffBarrier), // 29

      this.serv.getTopBallVertex(), // 30
      this.serv.getBottomBallVertex(), // 31

      getVertex(
        this.serv.getSignal() * (areaLineX + PLAYER_RADIUS),
        -outerHeight,
        TraitEnum.playerArea,
      ), // 32
      getVertex(
        this.serv.getSignal() * (areaLineX + PLAYER_RADIUS),
        outerHeight,
        TraitEnum.playerArea,
      ), // 33

      getVertex(this.serv.getSignal() * goalLineX, -outerHeight, TraitEnum.kickOffBarrier), // 34
      getVertex(this.serv.getSignal() * goalLineX, -goalPostY, TraitEnum.kickOffBarrier), // 35
      getVertex(this.serv.getSignal() * goalLineX, goalPostY, TraitEnum.kickOffBarrier), // 36
      getVertex(this.serv.getSignal() * goalLineX, outerHeight, TraitEnum.kickOffBarrier), // 37

      getVertex(this.serv.getSignal() * width, -outerHeight, TraitEnum.playerArea), // 38
      getVertex(this.serv.getSignal() * width, outerHeight, TraitEnum.playerArea), // 39
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

      this.serv.getConversionSegment(32, 33, TraitEnum.playerArea),
      this.serv.getConversionSegment(34, 37, TraitEnum.playerArea),
      this.serv.getConversionSegment(38, 39, TraitEnum.playerArea),
    ];

    if (this.isConversion === null) {
      this.goals = [];
    } else {
      this.goals = [this.serv.getConversionGoal()];
    }

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

  public static getNewStadium(
    name: string,
    dimensions: MapDimensions,
    team: TeamEnum,
    convProps: TConversionProps | null = null,
  ): string {
    return JSON.stringify(
      new HaxRugbyStadium(
        name,
        team,
        convProps,
        dimensions,
        dimensions.outerWidth,
        dimensions.outerHeight,
        dimensions.width,
        dimensions.height,
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
