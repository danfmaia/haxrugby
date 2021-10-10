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

const red_kickoff = HaxRugbyStadium.getNewStadium(
  'HaxRugby v20 R by JP',
  MapSizeEnum.NORMAL,
  dimensions,
  TeamEnum.RED,
);

function red_getConversion(conversionProps: TConversionProps): string {
  return HaxRugbyStadium.getNewStadium(
    'HaxRugby v20 RC by JP',
    MapSizeEnum.NORMAL,
    dimensions,
    TeamEnum.RED,
    conversionProps,
  );
}

const blue_kickoff = HaxRugbyStadium.getNewStadium(
  'HaxRugby v20 B by JP',
  MapSizeEnum.NORMAL,
  dimensions,
  TeamEnum.BLUE,
);

function blue_getConversion(conversionProps: TConversionProps): string {
  return HaxRugbyStadium.getNewStadium(
    'HaxRugby v20 BC by JP',
    MapSizeEnum.NORMAL,
    dimensions,
    TeamEnum.BLUE,
    conversionProps,
  );
}

const redMaps: THaxRugbyStadiums = {
  kickoff: red_kickoff,
  getConversion: red_getConversion,
};

const blueMaps: THaxRugbyStadiums = {
  kickoff: blue_kickoff,
  getConversion: blue_getConversion,
};

const normalMaps = {
  red: redMaps,
  blue: blueMaps,
};

export default normalMaps;
