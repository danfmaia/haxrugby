import normalMaps, { DIMENSIONS } from '../stadiums/normal/normalStadiums';
import HaxRugbyMap from '../models/map/HaxRugbyMaps';

const normalMap = new HaxRugbyMap(
  normalMaps.red,
  normalMaps.blue,
  DIMENSIONS.spawnDistance,
  DIMENSIONS.goalLineX,
  DIMENSIONS.goalPostY,
  DIMENSIONS.miniArea,
  DIMENSIONS.kickoffLineX,
  DIMENSIONS.areaLineX,
);

export default normalMap;
