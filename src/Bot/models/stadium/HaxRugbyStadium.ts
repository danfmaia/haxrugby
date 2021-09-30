import AHaxRugbyStadium from './AHaxRugbyStadium';
import HaxRugbyMaps from './HaxRugbyMaps';

export default class HaxRugbyStadium extends AHaxRugbyStadium {
  public redMaps: HaxRugbyMaps;
  public blueMaps: HaxRugbyMaps;

  constructor(
    goalLineX: number,
    goalPostY: number,
    miniAreaX: number,
    kickoffLineX: number,
    redMaps: HaxRugbyMaps,
    blueMaps: HaxRugbyMaps,
  ) {
    super(goalLineX, goalPostY, miniAreaX, kickoffLineX);

    this.redMaps = redMaps;
    this.blueMaps = blueMaps;
  }
}
