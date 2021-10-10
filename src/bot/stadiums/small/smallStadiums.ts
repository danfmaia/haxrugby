import TeamEnum from '../../enums/TeamEnum';
import HaxRugbyStadium from '../../models/stadium/HaxRugbyStadium';
import MapDimensions from '../../models/stadium/MapDimensions';
import TConversionProps from '../../models/stadium/TConversionProps';
import THaxRugbyStadiums from '../../models/map/THaxRugbyStadiums';
import MapSizeEnum from '../../enums/stadium/MapSizeEnum';

export const DIMENSIONS = {
  outerWidth: 440,
  outerHeight: 200,

  width: 390,
  height: 153,

  goalLineX: 300,
  goalPostY: 50,
  miniArea: 45,
  kickoffLineX: 100,
  areaLineX: 200,
};

const dimensions = new MapDimensions(
  DIMENSIONS.outerWidth,
  DIMENSIONS.outerHeight,
  DIMENSIONS.width,
  DIMENSIONS.height,
  DIMENSIONS.goalLineX,
  DIMENSIONS.goalPostY,
  DIMENSIONS.miniArea,
  DIMENSIONS.kickoffLineX,
  DIMENSIONS.areaLineX,
);

const red_kickoff = HaxRugbyStadium.getNewStadium(
  'S-HaxRugby v9 R by JP',
  MapSizeEnum.SMALL,
  dimensions,
  TeamEnum.RED,
);

function red_getConversion(conversionProps: TConversionProps): string {
  return HaxRugbyStadium.getNewStadium(
    'S-HaxRugby v9 RC by JP',
    MapSizeEnum.SMALL,
    dimensions,
    TeamEnum.RED,
    conversionProps,
  );
}

const blue_kickoff = HaxRugbyStadium.getNewStadium(
  'S-HaxRugby v9 B by JP',
  MapSizeEnum.SMALL,
  dimensions,
  TeamEnum.BLUE,
);

function blue_getConversion(conversionProps: TConversionProps): string {
  return HaxRugbyStadium.getNewStadium(
    'S-HaxRugby v9 BC by JP',
    MapSizeEnum.SMALL,
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

const smallMaps = {
  red: redMaps,
  blue: blueMaps,
};

export default smallMaps;
