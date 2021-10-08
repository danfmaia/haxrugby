import StadiumEnum from '../enums/StadiumEnum';
import MatchConfig from '../models/match/MatchConfig';

const x2Config: MatchConfig = new MatchConfig(2, 30, StadiumEnum.SMALL);
const x3Config: MatchConfig = new MatchConfig(3, 30, StadiumEnum.NORMAL);
const x4Config: MatchConfig = new MatchConfig(4, 30, StadiumEnum.NORMAL);

function getMatchConfig(config: 'x1' | 'x2' | 'x3' | 'x4'): MatchConfig {
  switch (config) {
    case 'x1':
    case 'x2':
      return x2Config;
    case 'x3':
      return x3Config;
    case 'x4':
      return x4Config;
    default:
      return x2Config;
  }
}

export default getMatchConfig;
