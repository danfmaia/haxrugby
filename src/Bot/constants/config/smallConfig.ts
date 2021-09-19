import { MatchConfig } from '../../models/match/MatchConfig';

const TIME_LIMIT = 3;
const SCORE_LIMIT = 30;

export const smallConfig = new MatchConfig(TIME_LIMIT, SCORE_LIMIT);
