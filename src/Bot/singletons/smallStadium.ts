import HaxRugbyStadium from '../models/stadium/HaxRugbyStadium';

import map_red from '../stadiums/small/map_red';
import map_blue from '../stadiums/small/map_blue';

const goalLineX = 300;
const goalPostY = 50;
const miniAreaX = 45;
const kickoffLineX = 100;

const maps = {
  red: map_red,
  blue: map_blue,
};

const smallStadium = new HaxRugbyStadium(
  goalLineX,
  goalPostY,
  miniAreaX,
  kickoffLineX,
  maps.red,
  maps.blue,
);

export default smallStadium;
