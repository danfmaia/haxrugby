import smallMaps, { DIMENSIONS } from '../maps/small/smallStadiums';
import HaxRugbyMaps from '../models/stadium/HaxRugbyMaps';

const smallStadium = new HaxRugbyMaps(
  smallMaps.red,
  smallMaps.blue,
  DIMENSIONS.goalLineX,
  DIMENSIONS.goalPostY,
  DIMENSIONS.miniArea,
  DIMENSIONS.kickoffLineX,
  DIMENSIONS.areaLineX,
);

export default smallStadium;
