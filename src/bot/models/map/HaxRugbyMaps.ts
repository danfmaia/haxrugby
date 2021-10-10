import AHaxRugbyMap from './AHaxRugbyMap';
import THaxRugbyStadiums from './THaxRugbyStadiums';

class HaxRugbyMap extends AHaxRugbyMap {
  public redMaps: THaxRugbyStadiums;
  public blueMaps: THaxRugbyStadiums;

  constructor(
    redMaps: THaxRugbyStadiums,
    blueMaps: THaxRugbyStadiums,
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

export default HaxRugbyMap;
