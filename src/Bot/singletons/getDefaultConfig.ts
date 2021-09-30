import MatchConfig from '../models/match/MatchConfig';
import Teams, { ITeams } from '../models/team/Team';
import { IChatService } from '../services/room/ChatService';

const TIME_LIMIT = 2;
const SCORE_LIMIT = 30;

function getDefaultConfig(chatService: IChatService): MatchConfig {
  const teams: ITeams = new Teams(chatService);

  return new MatchConfig(teams, TIME_LIMIT, SCORE_LIMIT);
}

export default getDefaultConfig;
