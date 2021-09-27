type DictionaryKeys = {
  MSG_GREETING_1: string;
  MSG_GREETING_2: string;
  MSG_GREETING_3: string;
  MSG_GREETING_4: string;
  MSG_GREETING_5: string;

  MSG_RULES: {
    TITLE: string;
    TRY: [string, string, string, string];
    GOAL: [string, string];
    SAFETY: [string, string, string];
    LINK_FOR_COMPLETE_RULES: string;
  };

  MSG_HELP: {
    TITLE: string;
    HELP: string;
    HELP_DESCRIPTION: string;
    RULES: string;
    RULES_DESCRIPTION: string;
    NEW_MATCH: string;
    NEW_MATCH_DESCRIPTION: string;
    SCORE: string;
    SCORE_DESCRIPTION: string;
    LINKS: string;
    LINKS_DESCRIPTION: string;
    ADMIN: string;
    ADMIN_DESCRIPTION: string;
    PASSWORD: string;
    PASSWORD_DESCRIPTION: string;
  };

  MSG_DEF_REC: [string, string];
  MSG_BALL_LEAVE_INGOAL: string;
  MSG_SAFETY_ALLOWED: string;
};

export default DictionaryKeys;
