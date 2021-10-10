class MapDimensions {
  constructor(
    public outerWidth: number,
    public outerHeight: number,

    public width: number,
    public height: number,

    public goalLineX: number,
    public goalPostY: number,
    public miniArea: number,
    public kickoffLineX: number,
    public areaLineX: number,
  ) {}
}

export default MapDimensions;
