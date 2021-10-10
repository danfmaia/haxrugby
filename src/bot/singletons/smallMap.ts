import smallMaps, { DIMENSIONS } from '../stadiums/small/smallStadiums';
import HaxRugbyMap from '../models/map/HaxRugbyMaps';

const smallMap = new HaxRugbyMap(
  smallMaps.red,
  smallMaps.blue,
  DIMENSIONS.spawnDistance,
  DIMENSIONS.goalLineX,
  DIMENSIONS.goalPostY,
  DIMENSIONS.miniArea,
  DIMENSIONS.kickoffLineX,
  DIMENSIONS.areaLineX,
);

export default smallMap;
