import { IPosition } from 'inversihax';
import MapSizeEnum from '../enums/stadium/MapSizeEnum';
import TeamEnum from '../enums/TeamEnum';
import THaxRugbyStadiums from '../models/map/THaxRugbyStadiums';
import HaxRugbyStadium from '../models/stadium/HaxRugbyStadium';
import MapDimensions from '../models/stadium/MapDimensions';
import TConversionProps from '../models/stadium/TConversionProps';

export const DIMENSIONS = {
  outerWidth: 1008,
  outerHeight: 490,
  width: 943.6,
  height: 420,

  spawnDistance: 317.8,
  goalLineX: 786.8,
  goalPostY: 84,
  miniArea: 91,
  kickoffLineX: 250.6,
  areaLineX: 576.8,
  penaltyBoundaryY: 252,

  goalPostBottomZ: 20.16,
  goalPostTopZ: 107.52,
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
    'Big HaxRugby R by JP',
    tickCount,
    matchDuration,
    MapSizeEnum.BIG,
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
    'Big HaxRugby RC by JP',
    tickCount,
    matchDuration,
    MapSizeEnum.BIG,
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
    'Big HaxRugby RP by JP',
    tickCount,
    matchDuration,
    MapSizeEnum.BIG,
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
    'Big HaxRugby B by JP',
    tickCount,
    matchDuration,
    MapSizeEnum.BIG,
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
    'Big HaxRugby BC by JP',
    tickCount,
    matchDuration,
    MapSizeEnum.BIG,
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
    'Big HaxRugby BP by JP',
    tickCount,
    matchDuration,
    MapSizeEnum.BIG,
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

const bigStadiums = {
  red: redStadiums,
  blue: blueStadiums,
};

export default bigStadiums;
