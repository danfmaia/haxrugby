import HaxRugbyStadium from '../models/stadium/HaxRugbyStadium';

import map_red from '../stadiums/small/map_red';
import map_blue from '../stadiums/small/map_blue';
import HaxRugbyMaps from '../models/stadium/HaxRugbyMaps';

const goalLineX = 300;
const goalPostY = 50;
const miniAreaX = 45;
const kickoffLineX = 100;

const redMaps: HaxRugbyMaps = {
  kickoff: map_red,
  conversion: 'pending',
};

const blueMaps: HaxRugbyMaps = {
  kickoff: map_blue,
  conversion: 'pending',
};

const smallStadium = new HaxRugbyStadium(
  goalLineX,
  goalPostY,
  miniAreaX,
  kickoffLineX,
  redMaps,
  blueMaps,
);

export default smallStadium;
