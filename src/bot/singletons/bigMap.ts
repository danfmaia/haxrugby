import bigStadiums, { DIMENSIONS } from '../stadiums/bigStadiums';
import HaxRugbyMap from '../models/map/HaxRugbyMaps';

const bigMap = new HaxRugbyMap(
  bigStadiums.red,
  bigStadiums.blue,
  DIMENSIONS.goalLineX,
  DIMENSIONS.goalPostY,
  DIMENSIONS.miniArea,
  DIMENSIONS.kickoffLineX,
  DIMENSIONS.areaLineX,
  DIMENSIONS.penaltyBoundaryY,
);

export default bigMap;
