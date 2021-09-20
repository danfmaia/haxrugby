import MatchConfig from '../../models/match/MatchConfig';
import teamA from '../team/teamA';
import teamB from '../team/teamB';

const TIME_LIMIT = 3;
const SCORE_LIMIT = 30;

const smallConfig = new MatchConfig(teamA, teamB, TIME_LIMIT, SCORE_LIMIT);

export default smallConfig;
