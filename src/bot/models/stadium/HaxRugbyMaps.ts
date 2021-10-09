import AHaxRugbyMap from './AHaxRugbyMap';
import THaxRugbyMaps from './THaxRugbyStadiums';

class HaxRugbyMaps extends AHaxRugbyMap {
  public redMaps: THaxRugbyMaps;
  public blueMaps: THaxRugbyMaps;

  constructor(
    redMaps: THaxRugbyMaps,
    blueMaps: THaxRugbyMaps,
    goalLineX: number,
    goalPostY: number,
    miniAreaX: number,
    kickoffLineX: number,
    areaLineX: number,
  ) {
    super(goalLineX, goalPostY, miniAreaX, kickoffLineX, areaLineX);

    this.redMaps = redMaps;
    this.blueMaps = blueMaps;
  }
}

export default HaxRugbyMaps;
