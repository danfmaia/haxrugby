import THaxRugbyStadiums from '../../models/stadium/THaxRugbyStadiums';
import blue_getConversion from './blue_getConversion';
import blue_kickoff from './blue_kickoff';
import red_getConversion from './red_getConversion';
import red_kickoff from './red_kickoff';

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
