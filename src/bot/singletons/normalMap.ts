import normalStadiums, { DIMENSIONS } from '../stadiums/normalStadiums';
import HaxRugbyMap from '../models/map/HaxRugbyMaps';

const normalMap = new HaxRugbyMap(
  normalStadiums.red,
  normalStadiums.blue,
  DIMENSIONS.goalLineX,
  DIMENSIONS.goalPostY,
  DIMENSIONS.miniArea,
  DIMENSIONS.kickoffLineX,
  DIMENSIONS.areaLineX,
  DIMENSIONS.penaltyBoundaryY,
);

export default normalMap;
