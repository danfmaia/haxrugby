import smallStadiums, { DIMENSIONS } from '../stadiums/smallStadiums';
import HaxRugbyMap from '../models/map/HaxRugbyMaps';

const smallMap = new HaxRugbyMap(
  smallStadiums.red,
  smallStadiums.blue,
  DIMENSIONS.goalLineX,
  DIMENSIONS.goalPostY,
  DIMENSIONS.miniArea,
  DIMENSIONS.kickoffLineX,
  DIMENSIONS.areaLineX,
  DIMENSIONS.penaltyBoundaryY,
);

export default smallMap;
