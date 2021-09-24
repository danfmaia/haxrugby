import SmallStadium from '../models/stadium/SmallStadium';

import map_A from '../stadiums/small/map_A';
import map_B from '../stadiums/small/map_B';

const goalLineX = 300;
const goalPostY = 50;
const miniAreaX = 45;
const kickoffLineX = 100;

const maps = {
  A: map_A,
  B: map_B,
};

const smallStadium = new SmallStadium(
  goalLineX,
  goalPostY,
  miniAreaX,
  kickoffLineX,
  maps.A,
  maps.B,
);

export default smallStadium;
