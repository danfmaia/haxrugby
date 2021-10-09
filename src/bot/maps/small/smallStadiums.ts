import TeamEnum from '../../enums/TeamEnum';
import HaxRugbyStadium from '../../models/map/HaxRugbyStadium';
import THaxRugbyStadiums from '../../models/stadium/THaxRugbyStadiums';
import blue_getConversion from './blue_getConversion';
import red_getConversion from './red_getConversion';

export const dimensions = {
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

const baseStadium = HaxRugbyStadium.getBaseStadium(
  'S-HaxRugby v9 by JP',
  TeamEnum.RED,
  dimensions.outerWidth,
  dimensions.outerHeight,
  dimensions.width,
  dimensions.height,
  dimensions.goalLineX,
  dimensions.goalPostY,
  dimensions.miniArea,
  dimensions.kickoffLineX,
  dimensions.areaLineX,
);

const red_kickoff = JSON.stringify(
  HaxRugbyStadium.getStadium(baseStadium, 'S-HaxRugby v9 R by JP', TeamEnum.RED),
);

const blue_kickoff = JSON.stringify(
  HaxRugbyStadium.getStadium(baseStadium, 'S-HaxRugby v9 B by JP', TeamEnum.BLUE),
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
