import { MatchConfig } from '../../models/match/MatchConfig';
import { MINUTE_IN_MS } from '../general';

const TIME_LIMIT = 3;
const SCORE_LIMIT = 30;

export const smallConfig: MatchConfig = {
  TIME_LIMIT: TIME_LIMIT,
  TIME_LIMIT_IN_MS: TIME_LIMIT * MINUTE_IN_MS,
  SCORE_LIMIT: SCORE_LIMIT
};
