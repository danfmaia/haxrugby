import smallMaps from '../maps/small/smallMaps';
import HaxRugbyStadium from '../models/stadium/HaxRugbyStadium';

const goalLineX = 300;
const goalPostY = 50;
const miniAreaX = 45;
const kickoffLineX = 100;
const areaLineX = 200;

const smallStadium = new HaxRugbyStadium(
  smallMaps.red,
  smallMaps.blue,
  goalLineX,
  goalPostY,
  miniAreaX,
  kickoffLineX,
  areaLineX,
);

export default smallStadium;
