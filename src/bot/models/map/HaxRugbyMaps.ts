import AHaxRugbyMap from './AHaxRugbyMap';
import THaxRugbyStadiums from './THaxRugbyStadiums';

class HaxRugbyMap extends AHaxRugbyMap {
  public redStadiums: THaxRugbyStadiums;
  public blueStadiums: THaxRugbyStadiums;

  constructor(
    redStadiums: THaxRugbyStadiums,
    blueStadiums: THaxRugbyStadiums,
    goalLineX: number,
    goalPostY: number,
    miniAreaX: number,
    kickoffLineX: number,
    areaLineX: number,
  ) {
    super(goalLineX, goalPostY, miniAreaX, kickoffLineX, areaLineX);

    this.redStadiums = redStadiums;
    this.blueStadiums = blueStadiums;
  }
}

export default HaxRugbyMap;
