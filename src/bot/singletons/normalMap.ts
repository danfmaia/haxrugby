import normalMaps from '../stadiums/normal/normalStadiums';
import HaxRugbyMap from '../models/map/HaxRugbyMaps';

const goalLineX = 562;
const goalPostY = 60;
const miniAreaX = 65;
const kickoffLineX = 179;
const areaLineX = 412;

const normalMap = new HaxRugbyMap(
  normalMaps.red,
  normalMaps.blue,
  goalLineX,
  goalPostY,
  miniAreaX,
  kickoffLineX,
  areaLineX,
);

export default normalMap;
