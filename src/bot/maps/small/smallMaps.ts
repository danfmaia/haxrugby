import THaxRugbyMaps from '../../models/stadium/HaxRugbyMaps';
import blue_getConversion from './blue_getConversion';
import blue_kickoff from './blue_kickoff';
import red_getConversion from './red_getConversion';
import red_kickoff from './red_kickoff';

const redMaps: THaxRugbyMaps = {
  kickoff: red_kickoff,
  getConversion: red_getConversion,
};

const blueMaps: THaxRugbyMaps = {
  kickoff: blue_kickoff,
  getConversion: blue_getConversion,
};

const smallMaps = {
  red: redMaps,
  blue: blueMaps,
};

export default smallMaps;
