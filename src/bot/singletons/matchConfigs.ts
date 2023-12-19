import MapSizeEnum from '../enums/stadium/MapSizeEnum';
import MatchConfig from '../models/match/MatchConfig';

export const matchConfigStrings: string[] = ['x1', 'x2', 'x3', 'x4', 'x5', 'x6'];

const x2: MatchConfig = new MatchConfig(2, 30, 20, MapSizeEnum.SMALL);
const x3: MatchConfig = new MatchConfig(3, 30, 20, MapSizeEnum.NORMAL);
const x4: MatchConfig = new MatchConfig(4, 30, 20, MapSizeEnum.NORMAL);
const x5: MatchConfig = new MatchConfig(5, 30, 20, MapSizeEnum.BIG);
const x6: MatchConfig = new MatchConfig(6, 30, 20, MapSizeEnum.BIG);

const matchConfigs = {
  x2,
  x3,
  x4,
  x5,
  x6,
};

export default matchConfigs;
