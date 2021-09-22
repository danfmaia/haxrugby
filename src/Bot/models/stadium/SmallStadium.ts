import HaxRUStadium from './HaxRUStadium';

export interface ISmallStadium {}

export default class SmallStadium extends HaxRUStadium {
  private _map_A: string;
  private _map_B: string;

  public get map_A(): string {
    return this._map_A;
  }
  public set map_A(value: string) {
    this._map_A = value;
  }

  public get map_B(): string {
    return this._map_B;
  }
  public set map_B(value: string) {
    this._map_B = value;
  }

  constructor(
    goalLineX: number,
    goalPostY: number,
    miniAreaX: number,
    kickoffLineX: number,
    map_A: string,
    map_B: string,
  ) {
    super(goalLineX, goalPostY, miniAreaX, kickoffLineX);

    this._map_A = map_A;
    this._map_B = map_B;
  }
}
