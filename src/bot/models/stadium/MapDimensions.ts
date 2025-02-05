class MapDimensions {
  constructor(
    public outerWidth: number,
    public outerHeight: number,
    public width: number,
    public height: number,

    public spawnDistance: number,

    public goalLineX: number,
    public goalPostY: number,
    public miniArea: number,
    public kickoffLineX: number,
    public areaLineX: number,
    public penaltyBoundaryY: number,

    public goalPostBottomZ: number,
    public goalPostTopZ: number,
  ) {}
}

export default MapDimensions;
