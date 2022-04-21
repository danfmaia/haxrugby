enum MapSizeEnum {
  SMALL = 'SMALL',
  NORMAL = 'NORMAL',
  BIG = 'BIG',
}

export type MapSizeString = 'SMALL' | 'NORMAL' | 'BIG';
export const mapSizes: string[] = [
  MapSizeEnum.SMALL.toString(),
  MapSizeEnum.NORMAL.toString(),
  MapSizeEnum.BIG.toString(),
];

export default MapSizeEnum;
