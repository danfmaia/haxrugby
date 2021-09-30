import smallMaps from '../maps/small/smallMaps';
import HaxRugbyStadium from '../models/stadium/HaxRugbyStadium';

const goalLineX = 300;
const goalPostY = 50;
const miniAreaX = 45;
const kickoffLineX = 100;

const smallStadium = new HaxRugbyStadium(
  goalLineX,
  goalPostY,
  miniAreaX,
  kickoffLineX,
  smallMaps.red,
  smallMaps.blue,
);

export default smallStadium;
