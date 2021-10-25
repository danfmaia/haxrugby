import { RuleMessage } from './RuleMessage';

type DictionaryKeys = {
  MSG_GREETING: string;
  MSG_GAME_INFO_1: string;
  MSG_GAME_INFO_2: string;
  MSG_GAME_INFO_3: string;
  MSG_GAME_INFO_4: string;
  MSG_GAME_INFO_5: string;

  MSG_CLOSED_ROOM_1: string;
  MSG_CLOSED_ROOM_2: string;
  MSG_CLOSED_ROOM_3: string;

  MSG_RULES: {
    TITLE: string;
    TRY: RuleMessage;
    DROP_GOAL: RuleMessage;
    AIR_KICK: RuleMessage;
    SAFETY: RuleMessage;
    OFFSIDE: RuleMessage;
    PENALTY: RuleMessage;
    POST_RULES: string;
  };

  MSG_HELP: {
    TITLE: string;

    ADMIN_COMMANDS: string;

    NEW_MATCH: string;
    NEW_MATCH_DESCRIPTION: string;

    ADMIN: string;
    ADMIN_DESCRIPTION: string;

    PASSWORD: string;
    PASSWORD_DESCRIPTION: string;

    SET_SCORE: string;
    SET_SCORE_DESCRIPTION: string;

    OTHER_COMMANDS: string;

    SCORE: string;
    SCORE_DESCRIPTION: string;

    BALL_DESCRIPTION: string;
    KICKER_DESCRIPTION: string;
    GOALKEEPER_DESCRIPTION: string;

    RULES: string;
    RULES_DESCRIPTION: string;

    LINKS: string;
    LINKS_DESCRIPTION: string;

    HELP: string;
    HELP_DESCRIPTION: string;
  };

  MSG_DEF_REC: [string, string];
  MSG_BALL_LEAVE_INGOAL: string;
  MSG_SAFETY_ALLOWED: string;
};

export default DictionaryKeys;
