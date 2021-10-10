import TeamEnum from '../../enums/TeamEnum';
import HaxRugbyStadium from '../../models/stadium/HaxRugbyStadium';
import MapDimensions from '../../models/stadium/MapDimensions';
import TConversionProps from '../../models/stadium/TConversionProps';
import THaxRugbyStadiums from '../../models/map/THaxRugbyStadiums';
import MapSizeEnum from '../../enums/stadium/MapSizeEnum';

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
);

function red_getKickoff(safetyX: number = 0): string {
  return HaxRugbyStadium.getNewStadium(
    'S-HaxRugby v9 R by JP',
    MapSizeEnum.SMALL,
    dimensions,
    TeamEnum.RED,
    safetyX,
  );
}

function red_getConversion(conversionProps: TConversionProps): string {
  return HaxRugbyStadium.getNewStadium(
    'S-HaxRugby v9 RC by JP',
    MapSizeEnum.SMALL,
    dimensions,
    TeamEnum.RED,
    undefined,
    conversionProps,
  );
}

function blue_getKickoff(safetyX: number = 0): string {
  return HaxRugbyStadium.getNewStadium(
    'S-HaxRugby v9 B by JP',
    MapSizeEnum.SMALL,
    dimensions,
    TeamEnum.BLUE,
    safetyX,
  );
}

function blue_getConversion(conversionProps: TConversionProps): string {
  return HaxRugbyStadium.getNewStadium(
    'S-HaxRugby v9 BC by JP',
    MapSizeEnum.SMALL,
    dimensions,
    TeamEnum.BLUE,
    undefined,
    conversionProps,
  );
}

const redMaps: THaxRugbyStadiums = {
  getKickoff: red_getKickoff,
  getConversion: red_getConversion,
};

const blueMaps: THaxRugbyStadiums = {
  getKickoff: blue_getKickoff,
  getConversion: blue_getConversion,
};

const smallMaps = {
  red: redMaps,
  blue: blueMaps,
};

export default smallMaps;
