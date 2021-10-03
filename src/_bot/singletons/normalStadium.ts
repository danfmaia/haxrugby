import normalMaps from '../maps/normal/normalMaps';
import HaxRugbyStadium from '../models/stadium/HaxRugbyStadium';

const goalLineX = 562;
const goalPostY = 60;
const miniAreaX = 65;
const kickoffLineX = 179;
const areaLineX = 412;

const normalStadium = new HaxRugbyStadium(
  normalMaps.red,
  normalMaps.blue,
  goalLineX,
  goalPostY,
  miniAreaX,
  kickoffLineX,
  areaLineX,
);

export default normalStadium;
