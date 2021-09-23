import HaxRugbyStadium from './HaxRugbyStadium';

export default class SmallStadium extends HaxRugbyStadium {
  public map_A: string;
  public map_B: string;

  constructor(
    goalLineX: number,
    goalPostY: number,
    miniAreaX: number,
    kickoffLineX: number,
    map_A: string,
    map_B: string,
  ) {
    super(goalLineX, goalPostY, miniAreaX, kickoffLineX);

    this.map_A = map_A;
    this.map_B = map_B;
  }
}
