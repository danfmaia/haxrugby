import HaxRugbyStadium from '../models/stadium/HaxRugbyStadium';

import map_red from '../stadiums/normal/map_red';
import map_blue from '../stadiums/normal/map_blue';
import map_redConv from '../stadiums/normal/map_redConv';
import HaxRugbyMaps from '../models/stadium/HaxRugbyMaps';

const goalLineX = 562;
const goalPostY = 60;
const miniAreaX = 65;
const kickoffLineX = 179;

const redMaps: HaxRugbyMaps = {
  kickoff: map_red,
  conversion: map_redConv,
};

const blueMaps: HaxRugbyMaps = {
  kickoff: map_blue,
  conversion: 'pending',
};

const normalStadium = new HaxRugbyStadium(
  goalLineX,
  goalPostY,
  miniAreaX,
  kickoffLineX,
  redMaps,
  blueMaps,
);

export default normalStadium;
