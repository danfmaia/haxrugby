import AbstractHaxRugbyStadium from './AbstractHaxRugbyStadium';

export default class HaxRugbyStadium extends AbstractHaxRugbyStadium {
  public map_red: string;
  public map_blue: string;

  constructor(
    goalLineX: number,
    goalPostY: number,
    miniAreaX: number,
    kickoffLineX: number,
    map_red: string,
    map_blue: string,
  ) {
    super(goalLineX, goalPostY, miniAreaX, kickoffLineX);

    this.map_red = map_red;
    this.map_blue = map_blue;
  }
}
