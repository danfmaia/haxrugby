import HaxRugbyStadium from '../models/stadium/HaxRugbyStadium';

import map_red from '../stadiums/normal/map_red';
import map_blue from '../stadiums/normal/map_blue';

const goalLineX = 562;
const goalPostY = 60;
const miniAreaX = 65;
const kickoffLineX = 179;

const maps = {
  red: map_red,
  blue: map_blue,
};

const normalStadium = new HaxRugbyStadium(
  goalLineX,
  goalPostY,
  miniAreaX,
  kickoffLineX,
  maps.red,
  maps.blue,
);

export default normalStadium;
