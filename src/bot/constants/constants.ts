export const GAME_TITLE = 'H𝖺𝗑𝗥𝘂𝗴𝗯𝘆';
export const ROOM_TITLE = '💥🏉 H𝖺𝗑𝗥𝗨𝗚𝗕𝗬 🏉💥';
// export const ROOM_TITLE = '🏉 H𝖺𝗑𝗥𝗨𝗚𝗕𝗬 𝖳𝖾𝗌𝗍𝖾𝗌';
export const CLOSED_ROOM_TITLE = '💥🏉 H𝖺𝗑𝗥𝗨𝗚𝗕𝗬 🏉💥 Sala às noites!';
export const CLOSED_PLAYER_NAME = 'Salas divulgadas no DC';

export const APP_MINOR_VERSION = '𝘃𝟬.𝟭𝟳';
export const APP_PREVIOUS_MINOR_VERSION = '𝘃𝟬.𝟭𝟲';
const APP_PATCH_VERSION = '';
export const ROOM_DESCRIPTION = 'v0.17 • x3/x4'; // 15 chars allowed
// export const ROOM_DESCRIPTION = 'CAMP x4 DRAFT'; // 15 chars allowed
export const APP_VERSION = APP_MINOR_VERSION + APP_PATCH_VERSION;

export const LINK_DISCORD = 'discord.gg/F962NBhRgy';
// 'discord.io/HaxRugby    𝐶𝑜𝑙𝑒 𝑜 𝑙𝑖𝑛𝑘 𝑛𝑜 𝑛𝑎𝑣𝑒𝑔𝑎𝑑𝑜𝑟. 𝑁ã𝑜 𝑢𝑠𝑒 𝑛𝑜 𝐷𝑖𝑠𝑐𝑜𝑟𝑑!';
// export const LINK_DISCORD = 'discord.gg/WBcmrk8G';
export const LINK_DISCORD_RULES =
  'discord.com/channels/888810050041303050/891749504938815538/898839813673877564';

export const MINUTE_IN_MS = 60 * 1000;

export const BALL_RADIUS = 6;
export const GOAL_POST_RADIUS = 2;

// player physics
export const PLAYER_RADIUS = 15;
export const BOUNCE_FACTOR = 1.5;

// safety margin for touching
export const TOUCH_EPSILON = 0.01;
// minimal tick range for driving
export const DRIVE_MIN_TICKS = 10; // 10 ticks = 0.167s
export const AFTER_TRY_MAX_TICKS = 180; // 3s

export const KICK_RATE_LIMIT = [10, 60, 3];

export const BALL_TEAM_COLOR_TICKS = 60;
export const AIR_KICK_TICKS = 105;
export const AIR_KICK_BLOCK_TICKS = 93;
export const AIR_KICK_BOOST = {
  SMALL: 1.2,
  NORMAL: 1.3,
  BIG: 1.42,
};
export const SMALL_AIR_KICK_BOOST = 1.2;
export const NORMAL_AIR_KICK_BOOST = 1.3;

export const SAFETY_MAX_TIME = 20000;

export const AHEAD_EMOJI = '👎';
export const AHEAD_PENALTY_EMOJI = '⚠️';
export const PENALTY_ADVANTAGE_TIME = 5000;
