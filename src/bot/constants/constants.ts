export const GAME_TITLE = '𝖧𝖺𝗑𝗥𝘂𝗴𝗯𝘆®';
export const ROOM_TITLE = "🏉 𝓙𝓟'𝓼 𝖧𝖺𝗑𝗥𝘂𝗴𝗯𝘆®";
export const APP_MINOR_VERSION = '𝘃𝟬.𝟭𝟬';
const APP_PATCH_VERSION = '𝗰';
export const APP_VERSION = APP_MINOR_VERSION + APP_PATCH_VERSION;
// export const ROOM_SUBTITLE = '- 𝖭𝗈𝗏𝖺 𝖵𝖾𝗋𝗌𝖺𝗈!';
// export const ROOM_SUBTITLE = '- 𝖣𝖾𝗌𝖾𝗇𝗏𝗈𝗅𝗏𝖾𝗇𝖽𝗈…';

export const MINUTE_IN_MS = 60 * 1000;

export const BALL_RADIUS = 7.5;
export const PLAYER_RADIUS = 15;
export const GOAL_POST_RADIUS = 2;

// safety margin for touching
export const TOUCH_EPSILON = 0.01;
// minimal tick range for driving
export const DRIVE_MIN_TICKS = 10; // 10 ticks = 0.167s
export const AFTER_TRY_MAX_TICKS = 120;

// export const KICK_RATE_LIMIT = [10, 10, 15];
export const KICK_RATE_LIMIT = [10, 60, 3];

export const BALL_TEAM_COLOR_TICKS = 60;
export const AIR_KICK_TICKS = 90;
export const AIR_KICK_BLOCK_TICKS = 75;
export const SMALL_AIR_KICK_BOOST = 1.15;
export const NORMAL_AIR_KICK_BOOST = 1.3;
