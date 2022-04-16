import MapSizeEnum from '../enums/stadium/MapSizeEnum';
import MatchConfig from '../models/match/MatchConfig';

const x2Config: MatchConfig = new MatchConfig(2, 30, MapSizeEnum.SMALL);
const x3Config: MatchConfig = new MatchConfig(3, 30, MapSizeEnum.NORMAL);
const x4Config: MatchConfig = new MatchConfig(4, 30, MapSizeEnum.NORMAL);
const x5Config: MatchConfig = new MatchConfig(5, 30, MapSizeEnum.BIG);
const x6Config: MatchConfig = new MatchConfig(6, 30, MapSizeEnum.BIG);

function getMatchConfig(config: 'x1' | 'x2' | 'x3' | 'x4' | 'x5' | 'x6'): MatchConfig {
  switch (config) {
    case 'x1':
    case 'x2':
      return x2Config;
    case 'x3':
      return x3Config;
    case 'x4':
      return x4Config;
    case 'x5':
      return x5Config;
    case 'x6':
      return x6Config;
    default:
      return x2Config;
  }
}

export default getMatchConfig;
