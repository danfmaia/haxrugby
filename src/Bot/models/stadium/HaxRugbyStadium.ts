import AHaxRugbyStadium from './AHaxRugbyStadium';
import THaxRugbyMaps from './HaxRugbyMaps';

export default class HaxRugbyStadium extends AHaxRugbyStadium {
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
