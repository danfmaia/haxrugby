import MatchConfig from '../models/match/MatchConfig';
import redTeam from './team/redTeam';
import blueTeam from './team/blueTeam';

const TIME_LIMIT = 3;
const SCORE_LIMIT = 30;

const smallConfig = new MatchConfig(redTeam, blueTeam, TIME_LIMIT, SCORE_LIMIT);

export default smallConfig;
