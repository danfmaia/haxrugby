type DictionaryKeys = {
  MSG_GREETING_1: string;
  MSG_GREETING_2: string;
  MSG_GREETING_3: string;
  MSG_GREETING_4: string;
  MSG_GREETING_5: string;

  MSG_RULES: {
    TITLE: string;
    TRY_TITLE: string;
    TRY: [string, string, string, string];
    FIELD_GOAL_TITLE: string;
    FIELD_GOAL: [string, string];
    SAFETY_TITLE: string;
    SAFETY: [string, string, string];
    LINK_FOR_COMPLETE_RULES: string;
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

    HELP: string;
    HELP_DESCRIPTION: string;

    SCORE: string;
    SCORE_DESCRIPTION: string;

    KICKER: string;
    KICKER_DESCRIPTION: string;

    GOALKEEPER: string;
    GOALKEEPER_DESCRIPTION: string;

    RULES: string;
    RULES_DESCRIPTION: string;

    LINKS: string;
    LINKS_DESCRIPTION: string;
  };

  MSG_DEF_REC: [string, string];
  MSG_BALL_LEAVE_INGOAL: string;
  MSG_SAFETY_ALLOWED: string;
};

export default DictionaryKeys;
