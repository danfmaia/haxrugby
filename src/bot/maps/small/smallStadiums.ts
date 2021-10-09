import HaxRugbyStadium from '../../models/map/HaxRugbyStadium';
import THaxRugbyStadiums from '../../models/stadium/THaxRugbyStadiums';
import blue_getConversion from './blue_getConversion';
import blue_kickoff from './blue_kickoff';
import red_getConversion from './red_getConversion';
// import red_kickoff from './red_kickoff';

export const dimensions = {
  outerWidth: 420,
  outerHeight: 200,

  width: 390,
  height: 153,

  goalLineX: 300,
  goalPostY: 50,
  miniArea: 45,
  kickoffLineX: 100,
  areaLineX: 200,
};

const red_kickoff = JSON.stringify(
  new HaxRugbyStadium(
    'S-HaxRugby v9 R by JP',
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
