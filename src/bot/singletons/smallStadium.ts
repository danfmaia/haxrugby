import smallMaps, { dimensions } from '../maps/small/smallStadiums';
import HaxRugbyMaps from '../models/stadium/HaxRugbyMaps';

const smallStadium = new HaxRugbyMaps(
  smallMaps.red,
  smallMaps.blue,
  dimensions.goalLineX,
  dimensions.goalPostY,
  dimensions.miniArea,
  dimensions.kickoffLineX,
  dimensions.areaLineX,
);

export default smallStadium;
