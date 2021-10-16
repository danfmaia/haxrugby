import { IPosition } from 'inversihax';
import MapSizeEnum from '../../enums/stadium/MapSizeEnum';
import TeamEnum from '../../enums/TeamEnum';
import THaxRugbyStadiums from '../../models/map/THaxRugbyStadiums';
import HaxRugbyStadium from '../../models/stadium/HaxRugbyStadium';
import MapDimensions from '../../models/stadium/MapDimensions';
import TConversionProps from '../../models/stadium/TConversionProps';

export const DIMENSIONS = {
  outerWidth: 720,
  outerHeight: 350,
  width: 674,
  height: 300,

  spawnDistance: 227,
  goalLineX: 562,
  goalPostY: 60,
  miniArea: 65,
  kickoffLineX: 179,
  areaLineX: 412,
  penaltyBoundaryY: 180,
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
);

function red_getKickoff(kickoffPosition?: IPosition): string {
  return HaxRugbyStadium.getNewStadium(
    'HaxRugby v20 R by JP',
    MapSizeEnum.NORMAL,
    dimensions,
    TeamEnum.RED,
    kickoffPosition,
  );
}

function red_getConversion(conversionProps: TConversionProps): string {
  return HaxRugbyStadium.getNewStadium(
    'HaxRugby v20 RC by JP',
    MapSizeEnum.NORMAL,
    dimensions,
    TeamEnum.RED,
    undefined,
    conversionProps,
  );
}

function red_getPenaltyKick(kickoffPosition: IPosition, isPenalty: boolean): string {
  return HaxRugbyStadium.getNewStadium(
    'HaxRugby v9 RP by JP',
    MapSizeEnum.NORMAL,
    dimensions,
    TeamEnum.RED,
    kickoffPosition,
    undefined,
    isPenalty,
  );
}

function blue_getKickoff(kickoffPosition?: IPosition): string {
  return HaxRugbyStadium.getNewStadium(
    'HaxRugby v20 B by JP',
    MapSizeEnum.NORMAL,
    dimensions,
    TeamEnum.BLUE,
    kickoffPosition,
  );
}

function blue_getConversion(conversionProps: TConversionProps): string {
  return HaxRugbyStadium.getNewStadium(
    'HaxRugby v20 BC by JP',
    MapSizeEnum.NORMAL,
    dimensions,
    TeamEnum.BLUE,
    undefined,
    conversionProps,
  );
}

function blue_getPenaltyKick(kickoffPosition: IPosition, isPenalty: boolean): string {
  return HaxRugbyStadium.getNewStadium(
    'HaxRugby v9 BP by JP',
    MapSizeEnum.NORMAL,
    dimensions,
    TeamEnum.BLUE,
    kickoffPosition,
    undefined,
    isPenalty,
  );
}

const redMaps: THaxRugbyStadiums = {
  getKickoff: red_getKickoff,
  getConversion: red_getConversion,
  getPenaltyKick: red_getPenaltyKick,
};

const blueMaps: THaxRugbyStadiums = {
  getKickoff: blue_getKickoff,
  getConversion: blue_getConversion,
  getPenaltyKick: blue_getPenaltyKick,
};

const normalMaps = {
  red: redMaps,
  blue: blueMaps,
};

export default normalMaps;
