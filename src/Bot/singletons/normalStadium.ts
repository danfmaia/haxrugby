import normalMaps from '../maps/normal/normalMaps';
import HaxRugbyStadium from '../models/stadium/HaxRugbyStadium';

const goalLineX = 562;
const goalPostY = 60;
const miniAreaX = 65;
const kickoffLineX = 179;

const normalStadium = new HaxRugbyStadium(
  goalLineX,
  goalPostY,
  miniAreaX,
  kickoffLineX,
  normalMaps.red,
  normalMaps.blue,
);

export default normalStadium;
