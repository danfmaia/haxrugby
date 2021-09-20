import HaxRUStadium from './HaxRUStadium';

class SmallStadium extends HaxRUStadium {
  _map_A: string;
  _map_B: string;

  constructor(
    goalLineX: number,
    goalPostY: number,
    miniAreaDistance: number,
    map_A: string,
    map_B: string
  ) {
    super(goalLineX, goalPostY, miniAreaDistance);
    this._map_A = map_A;
    this._map_B = map_B;
  }
}

export default SmallStadium;
