import SmallStadium from '../models/stadium/SmallStadium';

import map_A from './small/map_A';
import map_B from './small/map_B';

const goalLineX = 300;
const goalPostY = 50;
const miniAreaDistance = 45;

const maps = {
  A: map_A,
  B: map_B
};

const smallStadium = new SmallStadium(
  goalLineX,
  goalPostY,
  miniAreaDistance,
  maps.A,
  maps.B
);

export default smallStadium;
