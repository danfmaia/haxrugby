import TeamEnum from '../enums/TeamEnum';
import HaxRugbyStadium from '../models/stadium/HaxRugbyStadium';
import MapDimensions from '../models/stadium/MapDimensions';
import TConversionProps from '../models/stadium/TConversionProps';
import THaxRugbyStadiums from '../models/map/THaxRugbyStadiums';
import MapSizeEnum from '../enums/stadium/MapSizeEnum';
import { IPosition } from 'inversihax';

export const DIMENSIONS = {
  outerWidth: 514,
  outerHeight: 233.6,
  width: 468,
  height: 183.6,

  spawnDistance: 150,
  goalLineX: 360,
  goalPostY: 50,
  miniArea: 54,
  kickoffLineX: 120,
  areaLineX: 240,
  penaltyBoundaryY: 110.1,

  goalPostBottomZ: 12,
  goalPostTopZ: 64,

  // outerWidth: 440,
  // outerHeight: 200,

  // width: 390,
  // height: 153,

  // goalLineX: 300,
  // goalPostY: 50,
  // miniArea: 45,
  // kickoffLineX: 100,
  // areaLineX: 200,
};

const dimensions = new MapDimensions(
  DIMENSIONS.outerWidth,
  DIMENSIONS.outerHeight,
  DIMENSIONS.width,
  DIMENSIONS.height,
  DIMENSIONS.spawnDistance,
  DIMENSIONS.goalLineX,
  DIMENSIONS.goalPostY,
  DIMENSIONS.miniArea,
  DIMENSIONS.kickoffLineX,
  DIMENSIONS.areaLineX,
  DIMENSIONS.penaltyBoundaryY,
  DIMENSIONS.goalPostBottomZ,
  DIMENSIONS.goalPostTopZ,
);

function red_getKickoff(
  tickCount: number,
  matchDuration: number,
  kickoffPosition?: IPosition,
): string {
  return HaxRugbyStadium.getNewStadium(
    'S-HaxRugby v9 R by JP',
    tickCount,
    matchDuration,
    MapSizeEnum.SMALL,
    dimensions,
    TeamEnum.RED,
    kickoffPosition,
  );
}

function red_getConversion(
  tickCount: number,
  matchDuration: number,
  conversionProps: TConversionProps,
): string {
  return HaxRugbyStadium.getNewStadium(
    'S-HaxRugby v9 RC by JP',
    tickCount,
    matchDuration,
    MapSizeEnum.SMALL,
    dimensions,
    TeamEnum.RED,
    undefined,
    conversionProps,
  );
}

function red_getPenaltyKick(
  tickCount: number,
  matchDuration: number,
  kickoffPosition: IPosition,
  isPenalty: boolean,
): string {
  return HaxRugbyStadium.getNewStadium(
    'S-HaxRugby v9 RP by JP',
    tickCount,
    matchDuration,
    MapSizeEnum.SMALL,
    dimensions,
    TeamEnum.RED,
    kickoffPosition,
    undefined,
    isPenalty,
  );
}

function blue_getKickoff(
  tickCount: number,
  matchDuration: number,
  kickoffPosition?: IPosition,
): string {
  return HaxRugbyStadium.getNewStadium(
    'S-HaxRugby v9 B by JP',
    tickCount,
    matchDuration,
    MapSizeEnum.SMALL,
    dimensions,
    TeamEnum.BLUE,
    kickoffPosition,
  );
}

function blue_getConversion(
  tickCount: number,
  matchDuration: number,
  conversionProps: TConversionProps,
): string {
  return HaxRugbyStadium.getNewStadium(
    'S-HaxRugby v9 BC by JP',
    tickCount,
    matchDuration,
    MapSizeEnum.SMALL,
    dimensions,
    TeamEnum.BLUE,
    undefined,
    conversionProps,
  );
}

function blue_getPenaltyKick(
  tickCount: number,
  matchDuration: number,
  kickoffPosition: IPosition,
  isPenalty: boolean,
): string {
  return HaxRugbyStadium.getNewStadium(
    'S-HaxRugby v9 BP by JP',
    tickCount,
    matchDuration,
    MapSizeEnum.SMALL,
    dimensions,
    TeamEnum.BLUE,
    kickoffPosition,
    undefined,
    isPenalty,
  );
}

const redStadiums: THaxRugbyStadiums = {
  getKickoff: red_getKickoff,
  getConversion: red_getConversion,
  getPenaltyKick: red_getPenaltyKick,
};

const blueStadiums: THaxRugbyStadiums = {
  getKickoff: blue_getKickoff,
  getConversion: blue_getConversion,
  getPenaltyKick: blue_getPenaltyKick,
};

const smallStadiums = {
  red: redStadiums,
  blue: blueStadiums,
};

export default smallStadiums;
