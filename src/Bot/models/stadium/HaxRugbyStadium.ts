import AHaxRugbyStadium from './AHaxRugbyStadium';
import THaxRugbyMaps from './HaxRugbyMaps';

export default class HaxRugbyStadium extends AHaxRugbyStadium {
  public redMaps: THaxRugbyMaps;
  public blueMaps: THaxRugbyMaps;

  constructor(
    goalLineX: number,
    goalPostY: number,
    miniAreaX: number,
    kickoffLineX: number,
    redMaps: THaxRugbyMaps,
    blueMaps: THaxRugbyMaps,
  ) {
    super(goalLineX, goalPostY, miniAreaX, kickoffLineX);

    this.redMaps = redMaps;
    this.blueMaps = blueMaps;
  }
}
