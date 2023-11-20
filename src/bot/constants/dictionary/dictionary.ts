import { LanguageEnum } from '../../enums/LanguageEnum';
import appConfig from '../appConfig';
import {
  APP_MINOR_VERSION,
  APP_PREVIOUS_MINOR_VERSION,
  APP_VERSION,
  GAME_TITLE,
  LINK_DISCORD,
  ROOM_TITLE,
} from '../constants';
import DictionaryKeys from './DictionaryKeys';

export const _1: string = '   ';
export const _2: string = '      ';
export const _3: string = '         ';

const ptBr: DictionaryKeys = {
  MSG_GREETING: `𝖡𝖾𝗆 𝗏𝗂𝗇𝖽𝗈(𝖺) 𝖺𝗈 ${ROOM_TITLE} ${APP_VERSION}!`,
  MSG_GAME_INFO_1: `𝖵𝗈𝖼ê 𝖾𝗌𝗍á 𝗇𝗈 ${ROOM_TITLE} ${APP_VERSION}!`,
  MSG_GAME_INFO_2:
    '𝖠𝗂𝗇𝖽𝖺 𝖾𝗌𝗍𝖺𝗆𝗈𝗌 𝖾𝗆 𝗱𝗲𝘀𝗲𝗻𝘃𝗼𝗹𝘃𝗶𝗺𝗲𝗻𝘁𝗼! 𝖲𝖾 𝖾𝗇𝖼𝗈𝗇𝗍𝗋𝖺𝗋 𝗯𝘂𝗴𝘀, 𝗋𝖾𝗅𝖺𝗍𝖾 𝗇𝗈 𝖼𝖺𝗇𝖺𝗅 #𝖻𝗎𝗀𝗌 𝖽𝗈 𝗇𝗈𝗌𝗌𝗈 𝗗𝗶𝘀𝗰𝗼𝗿𝗱 (!𝖽𝖼).',
  MSG_GAME_INFO_3: `𝖭𝖺 𝗏𝖾𝗋𝗌ã𝗈 𝖺𝗍𝗎𝖺𝗅 (${APP_MINOR_VERSION}) 𝗅𝖺𝗇ç𝖺𝗆𝗈𝗌 𝗈 𝖿𝗂𝗇𝖺𝗅 𝖽𝖾 𝗉𝖺𝗋𝗍𝗂𝖽𝖺 𝗉𝗈𝗋 𝖽𝗂𝖿𝖾𝗋𝖾𝗇ç𝖺 𝖽𝖾 𝗉𝗈𝗇𝗍𝗈𝗌! 𝘈𝘵𝘶𝘢𝘭𝘮𝘦𝘯𝘵𝘦 𝘧𝘪𝘹𝘰 𝘱𝘢𝘳𝘢 21, 𝘮𝘢𝘴 𝘦𝘮 𝘣𝘳𝘦𝘷𝘦 𝘱𝘰𝘥𝘦𝘳á 𝘴𝘦𝘳 𝘤𝘶𝘴𝘵𝘰𝘮𝘪𝘻𝘢𝘥𝘰.`,
  MSG_GAME_INFO_4: `𝖤 𝗇𝖺 𝗏𝖾𝗋𝗌ã𝗈 𝖺𝗇𝗍𝖾𝗋𝗂𝗈𝗋 (${APP_PREVIOUS_MINOR_VERSION}) 𝗅𝖺𝗇ç𝖺𝗆𝗈𝗌 𝗈 𝗆𝖺𝗉 𝗍𝖺𝗆𝖺𝗇𝗁𝗈 𝗕𝗶𝗴! 𝘈𝘪𝘯𝘥𝘢 𝘦𝘴𝘵á 𝘦𝘮 𝘧𝘢𝘴𝘦 𝘥𝘦 𝘵𝘦𝘴𝘵𝘦𝘴 𝘦 𝘢𝘫𝘶𝘴𝘵𝘦𝘴...`,
  // MSG_GAME_INFO_3: `𝖭𝖺𝗌 𝗏𝖾𝗋𝗌õ𝖾𝗌 𝘃𝟬.𝟭𝟭 𝖾 𝘃𝟬.𝟭𝟮 𝗂𝗇𝗍𝗋𝗈𝖽𝗎𝗓𝗂𝗆𝗈𝗌 𝗈 𝗜𝗺𝗽𝗲𝗱𝗶𝗺𝗲𝗻𝘁𝗼 (𝖼𝗈𝗆𝖺𝗇𝖽𝗈 !𝗶𝗺𝗽), 𝖺 𝗩𝗮𝗻𝘁𝗮𝗴𝗲𝗺 𝖾 𝗈 𝗣𝗲𝗻𝗮𝗹.`,
  // MSG_GAME_INFO_3: `𝖭𝖺 𝗏𝖾𝗋𝗌ã𝗈 ${APP_MINOR_VERSION} 𝗂𝗆𝗉𝗅𝖾𝗆𝖾𝗇𝗍𝖺𝗆𝗈𝗌 𝗈 𝗗𝗿𝗼𝗽 𝗚𝗼𝗮𝗹 (𝖼𝗈𝗆𝖺𝗇𝖽𝗈 !𝗱𝗿𝗼𝗽) 𝖾 𝗈 𝗖𝗵𝘂𝘁𝗲 𝗔𝗲𝗿𝗲𝗼 (𝖼𝗈𝗆𝖺𝗇𝖽𝗈 !𝗮𝗶𝗿).`,
  // MSG_GREETING_3: `𝖭𝖺 𝗏𝖾𝗋𝗌ã𝗈 ${APP_MINOR_VERSION} 𝗈 𝖼𝗈𝗇𝖼𝖾𝗂𝗍𝗈 𝖽𝗈 𝖥𝗂𝖾𝗅𝖽 𝖦𝗈𝖺𝗅 𝗆𝗎𝖽𝗈𝗎 𝖾 𝖺𝗀𝗈𝗋𝖺 𝖾𝗅𝖾 𝗌𝖾 𝖼𝗁𝖺𝗆𝖺 𝗗𝗿𝗼𝗽 𝗚𝗼𝗮𝗹. 𝖴𝗌𝖾 𝗈 𝖼𝗈𝗆𝖺𝗇𝖽𝗈 !𝗱𝗿𝗼𝗽 𝗉𝖺𝗋𝖺 𝗆𝖺𝗂𝗌 𝖽𝖾𝗍𝖺𝗅𝗁𝖾𝗌.`,
  MSG_GAME_INFO_5:
    '𝖴𝗌𝖾 𝗈 𝖼𝗈𝗆𝖺𝗇𝖽𝗈 !𝗿𝗲𝗴𝗿𝗮𝘀 𝗉𝖺𝗋𝖺 𝗏𝖾𝗋 𝖺𝗌 𝗿𝗲𝗴𝗿𝗮𝘀 𝗱𝗼 𝗷𝗼𝗴𝗼. 𝖤 𝗈 𝖼𝗈𝗆𝖺𝗇𝖽𝗈 !𝗵 𝗉𝖺𝗋𝖺 𝗏𝖾𝗋 𝖺 𝗹𝗶𝘀𝘁𝗮 𝗱𝗲 𝗰𝗼𝗺𝗮𝗻𝗱𝗼𝘀 𝖽𝗂𝗌𝗉𝗈𝗇í𝗏𝖾𝗂𝗌.',
  // MSG_GAME_INFO_6: '𝖴𝗌𝖾 𝗈 𝖼𝗈𝗆𝖺𝗇𝖽𝗈 !𝗵𝗲𝗹𝗽 𝗈𝗎 !𝗵 𝗉𝖺𝗋𝖺 𝗏𝖾𝗋 𝖺 𝗹𝗶𝘀𝘁𝗮 𝗱𝗲 𝗰𝗼𝗺𝗮𝗻𝗱𝗼𝘀 𝖽𝗂𝗌𝗉𝗈𝗇í𝗏𝖾𝗂𝗌.',

  MSG_CLOSED_ROOM_1: '𝖭𝗈𝗌𝗌𝖺 𝗦𝗔𝗟𝗔 𝗢𝗙𝗜𝗖𝗜𝗔𝗟 𝖺𝖻𝗋𝖾 𝗇𝖺𝗌 𝗇𝗈𝗂𝗍𝖾𝗌 𝖽𝖾 𝘁𝗲𝗿ç𝗮, 𝘀𝗲𝘅𝘁𝗮 𝖾 𝘀á𝗯𝗮𝗱𝗼.',
  MSG_CLOSED_ROOM_2: `𝖥𝗂𝗊𝗎𝖾 𝗉𝗈𝗋 𝖽𝖾𝗇𝗍𝗋𝗈 𝖽𝖾 𝗆𝖺𝗂𝗌 𝖽𝖾𝗍𝖺𝗅𝗁𝖾𝗌 𝖾𝗆 𝗇𝗈𝗌𝗌𝗈 𝗗𝗜𝗦𝗖𝗢𝗥𝗗 👉 ${LINK_DISCORD}`,
  MSG_CLOSED_ROOM_3: '𝙌𝙪𝙚𝙧 𝙨𝙖𝙡𝙖 𝗔𝗚𝗢𝗥𝗔? 𝘚𝘰𝘭𝘪𝘤𝘪𝘵𝘦 𝘯𝘰 𝘤𝘢𝘯𝘢𝘭 #𝚜𝚊𝚕𝚊𝚜 𝘥𝘰 𝘯𝘰𝘴𝘴𝘰 𝘋𝘪𝘴𝘤𝘰𝘳𝘥.',
  // MSG_CLOSED_ROOM_3:
  // '𝘛𝘢𝘮𝘣é𝘮 𝘢𝘣𝘳𝘪𝘮𝘰𝘴 𝘴𝘢𝘭𝘢𝘴 𝘦𝘮 𝘰𝘶𝘵𝘳𝘰𝘴 𝘥𝘪𝘢𝘴 𝘦 𝘩𝘰𝘳á𝘳𝘪𝘰𝘴 𝘤𝘰𝘯𝘧𝘰𝘳𝘮𝘦 𝘥𝘦𝘮𝘢𝘯𝘥𝘢, 𝘢𝘵𝘳𝘢𝘷é𝘴 𝘥𝘦 𝘶𝘮 𝘱𝘰𝘴𝘵 𝘭𝘢𝘯ç𝘢𝘥𝘰 𝙖 𝙦𝙪𝙖𝙡𝙦𝙪𝙚𝙧 𝙢𝙤𝙢𝙚𝙣𝙩𝙤 𝘯𝘰 𝘤𝘢𝘯𝘢𝘭 #𝚜𝚊𝚕𝚊𝚜 𝘥𝘰 𝘯𝘰𝘴𝘴𝘰 𝘋𝘪𝘴𝘤𝘰𝘳𝘥.',

  MSG_RULES: {
    TITLE: 'Resumo das REGRAS do jogo:',
    TRY: {
      shortDescription:
        '• 𝗧𝗥𝗬 - 𝖵𝖺𝗅𝖾 𝟱 𝗽𝗼𝗻𝘁𝗼𝘀 𝖾 é 𝖿𝖾𝗂𝗍𝗈 𝗖𝗢𝗡𝗗𝗨𝗭𝗜𝗡𝗗𝗢 𝖺 𝖻𝗈𝗅𝖺 𝗇𝗈 𝗂𝗇-𝗀𝗈𝖺𝗅 𝖺𝖽𝗏𝖾𝗋𝗌á𝗋𝗂𝗈. 𝘜𝘴𝘦 !𝚝𝚛𝚢 𝘱𝘢𝘳𝘢 𝘮𝘢𝘪𝘴 𝘥𝘦𝘵𝘢𝘭𝘩𝘦𝘴.',
      title: 'TRY     !try',
      longDescription: [
        _1 +
          '• É 𝗈 𝗈𝖻𝗃𝖾𝗍𝗂𝗏𝗈 𝗺𝗮𝗶𝘀 𝗶𝗺𝗽𝗼𝗿𝘁𝗮𝗻𝘁𝗲 𝖽𝗈 𝗋𝗎𝗀𝖻𝗒. É 𝖿𝖾𝗂𝗍𝗈 𝗖𝗢𝗡𝗗𝗨𝗭𝗜𝗡𝗗𝗢 𝖺 𝖻𝗈𝗅𝖺 𝗇𝗈 𝗂𝗇-𝗀𝗈𝖺𝗅 𝖺𝖽𝗏𝖾𝗋𝗌á𝗋𝗂𝗈.',
        _1 + '• 𝖮 𝗂𝗇-𝗀𝗈𝖺𝗅 é 𝖺 𝗋𝖾𝗀𝗂ã𝗈 𝖽𝗈 𝖼𝖺𝗆𝗉𝗈 𝖺𝗍𝗋á𝗌 𝖽𝖺 𝗅𝗂𝗇𝗁𝖺 𝖽𝖾 𝗀𝗈𝗅 𝖽𝖾 𝖼𝖺𝖽𝖺 𝗍𝗂𝗆𝖾.',
        _1 + '• 𝖮 𝖳𝗋𝗒 𝗏𝖺𝗅𝖾 𝟱 𝗽𝗼𝗻𝘁𝗼𝘀 𝖾 𝖽á 𝖽𝗂𝗋𝖾𝗂𝗍𝗈 𝖺 𝗎𝗆𝖺 𝗖𝗢𝗡𝗩𝗘𝗥𝗦Ã𝗢 𝗗𝗘 𝟮 𝗣𝗢𝗡𝗧𝗢𝗦.',
      ],
    },
    DROP_GOAL: {
      shortDescription:
        '• 𝗗𝗥𝗢𝗣 𝗚𝗢𝗔𝗟 - 𝖵𝖺𝗅𝖾 𝟯 𝗽𝗼𝗻𝘁𝗼𝘀 𝖾 é 𝖿𝖾𝗂𝗍𝗈 𝖺𝖼𝖾𝗋𝗍𝖺𝗇𝖽𝗈 𝗎𝗆 𝗖𝗛𝗨𝗧𝗘 𝗔É𝗥𝗘𝗢 𝗇𝗈 𝗀𝗈𝗅 𝖺𝖽𝗏𝖾𝗋𝗌á𝗋𝗂𝗈. 𝘜𝘴𝘦 !𝚍𝚛𝚘𝚙 𝘦 !𝚊𝚎𝚛𝚎𝚘 𝘱𝘢𝘳𝘢 𝘮𝘢𝘪𝘴 𝘥𝘦𝘵𝘢𝘭𝘩𝘦𝘴.',
      title: 'DROP GOAL (DG)     !drop !dg !gol',
      longDescription: [
        _1 + '• É 𝗈 𝗈𝖻𝗃𝖾𝗍𝗂𝗏𝗈 𝗌𝖾𝖼𝗎𝗇𝖽á𝗋𝗂𝗈 𝖽𝗈 𝗋𝗎𝗀𝖻𝗒. 𝖵𝖺𝗅𝖾 𝟯 𝗽𝗼𝗻𝘁𝗼𝘀.',
        _1 +
          '• 𝖲ó 𝗉𝗈𝖽𝖾 𝗌𝖾𝗋 𝖿𝖾𝗂𝗍𝗈 𝗱𝗲 𝗳𝗼𝗿𝗮 𝗱𝗮 𝗽𝗲𝗾𝘂𝗲𝗻𝗮 á𝗿𝗲𝗮 𝖾 𝖼𝗈𝗆 𝗎𝗆 𝗖𝗛𝗨𝗧𝗘 𝗔É𝗥𝗘𝗢 (𝘶𝘴𝘦 !𝚊𝚒𝚛 𝘱𝘢𝘳𝘢 𝘮𝘢𝘪𝘴 𝘥𝘦𝘵𝘢𝘭𝘩𝘦𝘴).',
        _1 + '• 𝖭ã𝗈 é 𝗉𝗈𝗌𝗌í𝗏𝖾𝗅 𝖿𝖺𝗓𝖾𝗋 𝗎𝗆 𝖣𝗋𝗈𝗉 𝖦𝗈𝖺𝗅 𝖼𝗈𝗇𝗍𝗋𝖺.',
      ],
    },
    AIR_KICK: {
      shortDescription: '',
      title: 'CHUTE AÉREO (AIR)     !air !aereo',
      longDescription: [
        _1 +
          '• É 𝗎𝗆 𝗰𝗵𝘂𝘁𝗲 𝗺𝗮𝗶𝘀 𝗳𝗼𝗿𝘁𝗲 (𝟣,𝟤𝗑 𝗇𝗈 𝗌𝗆𝖺𝗅𝗅, 𝟣,𝟥𝗑 𝗇𝗈 𝗇𝗈𝗋𝗆𝖺𝗅 𝖾 𝟣,𝟦𝟤𝗑 𝗇𝗈 𝖻𝗂𝗀), 𝗊𝗎𝖾 𝗣𝗔𝗦𝗦𝗔 𝗣𝗢𝗥 𝗖𝗜𝗠𝗔 𝖽𝗈𝗌 𝗃𝗈𝗀𝖺𝖽𝗈𝗋𝖾𝗌.',
        _1 + '• 𝖯𝖺𝗋𝖺 𝗍𝖾𝗇𝗍𝖺𝗋 𝗎𝗆 𝖢𝗁𝗎𝗍𝖾 𝖠é𝗋𝖾𝗈, 𝗰𝗼𝗻𝗱𝘂𝘇𝗮 𝗮 𝗯𝗼𝗹𝗮 𝗲 𝗲𝗺 𝘀𝗲𝗴𝘂𝗶𝗱𝗮 𝗰𝗵𝘂𝘁𝗲-𝗮.',
        _1 +
          '• 𝖲𝖾 𝗇𝖾𝗇𝗁𝗎𝗆 𝗃𝗈𝗀𝖺𝖽𝗈𝗋 𝗍𝗈𝖼𝖺𝗋 𝗇𝖺 𝖻𝗈𝗅𝖺 𝗉𝗈𝗋 𝟬,𝟮𝘀, 𝖾𝗅𝖺 𝖾𝗇𝗍ã𝗈 𝗌𝖾 𝗍𝗈𝗋𝗇𝖺𝗋á "𝖠é𝗋𝖾𝖺". 𝖠 𝖡𝗈𝗅𝖺 𝖠é𝗋𝖾𝖺 𝖽𝗎𝗋𝖺 𝟭,𝟱𝟱𝘀 𝖾 é 𝗌𝗂𝗇𝖺𝗅𝗂𝗓𝖺𝖽𝖺 𝖼𝗈𝗆 𝖺 𝗰𝗼𝗿 𝗰𝗶𝗻𝘇𝗮.',
        _1 + '• 𝖮 𝖣𝗋𝗈𝗉 𝖦𝗈𝖺𝗅 𝗌ó 𝗌𝖾𝗋á 𝗆𝖺𝗋𝖼𝖺𝖽𝗈 𝗌𝖾 𝖺 𝖻𝗈𝗅𝖺 𝖺𝗍𝗋𝖺𝗏𝖾𝗌𝗌𝖺𝗋 𝗈 𝗀𝗈𝗅 𝖼𝗈𝗆 𝗈 𝗌𝗍𝖺𝗍𝗎𝗌 𝖽𝖾 𝖠é𝗋𝖾𝖺.',
        _1 + '• 𝘜𝘴𝘦 𝘰 𝘤𝘰𝘮𝘢𝘯𝘥𝘰 `𝚊` 𝘱𝘢𝘳𝘢 𝘢𝘵𝘪𝘷𝘢𝘳/𝘥𝘦𝘴𝘢𝘵𝘪𝘷𝘢𝘳 𝘴𝘦𝘶 𝘊𝘩𝘶𝘵𝘦 𝘈é𝘳𝘦𝘰.',
      ],
    },
    SAFETY: {
      shortDescription:
        '• 𝗦𝗔𝗙𝗘𝗧𝗬 - 𝖩𝗈𝗀𝖺𝖽𝖺 𝖽𝖾 𝗌𝖾𝗀𝗎𝗋𝖺𝗇ç𝖺 𝖽𝖺 𝖽𝖾𝖿𝖾𝗌𝖺. É 𝖿𝖾𝗂𝗍𝗈 𝗖𝗢𝗡𝗗𝗨𝗭𝗜𝗡𝗗𝗢 𝖻𝗈𝗅𝖺 𝗻ã𝗼-𝗮𝗺𝗮𝗿𝗲𝗹𝗮 𝗇𝗈 𝗉𝗋ó𝗉𝗋𝗂𝗈 𝗂𝗇-𝗀𝗈𝖺𝗅. 𝘜𝘴𝘦 !𝗌𝖿 𝘱𝘢𝘳𝘢 𝘮𝘢𝘪𝘴 𝘥𝘦𝘵𝘢𝘭𝘩𝘦𝘴.',
      title: 'SAFETY (SF)     !safe !safety',
      longDescription: [
        _1 +
          '• É 𝖺 𝗃𝗈𝗀𝖺𝖽𝖺 𝖽𝖾 𝗌𝖾𝗀𝗎𝗋𝖺𝗇ç𝖺 𝖽𝖺 𝖽𝖾𝖿𝖾𝗌𝖺. É 𝖿𝖾𝗂𝗍𝗈 𝗖𝗢𝗡𝗗𝗨𝗭𝗜𝗡𝗗𝗢 𝖻𝗈𝗅𝖺 𝗻ã𝗼-𝗮𝗺𝗮𝗿𝗲𝗹𝗮 𝗇𝗈 𝗉𝗋ó𝗉𝗋𝗂𝗈 𝗂𝗇-𝗀𝗈𝖺𝗅.',
        _1 +
          '• 𝖮 𝖲𝖺𝖿𝖾𝗍𝗒 𝗌ó é 𝗉𝗈𝗌𝗌í𝗏𝖾𝗅 𝖾𝗆 𝖻𝗈𝗅𝖺 𝗻ã𝗼 𝗲𝘀𝘁𝗶𝘃𝗲𝗿 𝗮𝗺𝗮𝗿𝗲𝗹𝗮, 𝗈𝗎 𝗌𝖾𝗃𝖺, 𝗌𝖾 𝗈 ú𝗅𝗍𝗂𝗆𝗈 𝗍𝗈𝗊𝗎𝖾 𝗇𝖺 𝖻𝗈𝗅𝖺 𝖺𝗇𝗍𝖾𝗌 𝖽𝖾𝗅𝖺 𝖾𝗇𝗍𝗋𝖺𝗋 𝗇𝗈 𝗂𝗇-𝗀𝗈𝖺𝗅 𝖿𝗈𝗋 𝖽𝗈 𝖺𝗍𝖺𝗊𝗎𝖾.',
        _1 + '• 𝖮 𝖲𝖺𝖿𝖾𝗍𝗒 𝖼𝗈𝗇𝖼𝖾𝖽𝖾 à 𝖽𝖾𝖿𝖾𝗌𝖺 𝗎𝗆 𝗍𝗂𝗋𝗈 𝖽𝖾 𝗋𝖾𝗂𝗇í𝖼𝗂𝗈 𝗇𝗈 𝗅𝗈𝖼𝖺𝗅 𝖽𝖺 ú𝗅𝗍𝗂𝗆𝖺 𝖼𝗈𝗇𝖽𝗎çã𝗈 𝖽𝖾 𝖻𝗈𝗅𝖺.',
        _1 + '• 𝘜𝘴𝘦 𝘰 𝘤𝘰𝘮𝘢𝘯𝘥𝘰 `𝚣` 𝘰𝘶 `𝚜𝚏` 𝘱𝘢𝘳𝘢 𝘢𝘵𝘪𝘷𝘢𝘳/𝘥𝘦𝘴𝘢𝘵𝘪𝘷𝘢𝘳 𝘴𝘦𝘶 𝘚𝘢𝘧𝘦𝘵𝘺.',
      ],
    },
    OFFSIDE: {
      shortDescription: `• 𝗜𝗠𝗣𝗘𝗗𝗜𝗠𝗘𝗡𝗧𝗢 - 𝖯𝖺𝗋𝖺 𝗅𝖾𝗋 𝗌𝗈𝖻𝗋𝖾 𝖺 𝗋𝖾𝗀𝗋𝖺 𝖽𝗈 𝖨𝗆𝗉𝖾𝖽𝗂𝗆𝖾𝗇𝗍𝗈 𝗇𝗈 ${GAME_TITLE}, 𝗎𝗌𝖾 𝗈 𝖼𝗈𝗆𝖺𝗇𝖽𝗈 !𝚒𝚖𝚙.`,
      title: 'IMPEDIMENTO     !imp !impedimento',
      longDescription: [
        _1 + '• 𝖳𝗈𝖽𝗈 𝗃𝗈𝗀𝖺𝖽𝗈𝗋 𝖾𝗌𝗍á 𝗂𝗆𝗉𝖾𝖽𝗂𝖽𝗈 𝗌𝖾:',
        _2 + '  (𝟭) 𝖤𝗌𝗍𝗂𝗏𝖾𝗋 𝗱𝗲𝗻𝘁𝗿𝗼 𝗱𝗼 𝗶𝗻-𝗴𝗼𝗮𝗹 (𝗜𝗡𝗦𝗜𝗗𝗘) 𝗇𝗈 𝗆𝗈𝗆𝖾𝗇𝗍𝗈 𝖽𝗈 𝗉𝖺𝗌𝗌𝖾 (𝗅𝗂𝗇𝗁𝖺 é 𝖽𝖾𝗇𝗍𝗋𝗈);',
        _2 +
          '  (𝟮) 𝖤𝗌𝗍𝗂𝗏𝖾𝗋 à 𝗳𝗿𝗲𝗻𝘁𝗲 𝗱𝗮 𝗹𝗶𝗻𝗵𝗮 𝗱𝗼 ú𝗹𝘁𝗶𝗺𝗼 𝗱𝗲𝗳𝗲𝗻𝘀𝗼𝗿 𝗈𝗎 𝖽𝗈 𝗉𝖺𝗌𝗌𝖺𝖽𝗈𝗋 (𝗢𝗙𝗙𝗦𝗜𝗗𝗘) 𝗇𝗈 𝗆𝗈𝗆𝖾𝗇𝗍𝗈 𝖽𝗈 𝗉𝖺𝗌𝗌𝖾.',
        _1 + '• 𝖩𝗈𝗀𝖺𝖽𝗈𝗋𝖾𝗌 𝖽𝖾𝗇𝗍𝗋𝗈 𝖽𝖾 𝗌𝗎𝖺 𝗦𝗔𝗙𝗘 𝗭𝗢𝗡𝗘 (𝗭𝗼𝗻𝗮 𝗣𝗿𝗼𝘁𝗲𝗴𝗶𝗱𝗮) 𝖾𝗌𝗍ã𝗈 𝗶𝗺𝘂𝗻𝗲𝘀 𝗮𝗼 𝗢𝗳𝗳𝘀𝗶𝗱𝗲.',
        _1 + '• 𝘗𝘢𝘳𝘢 𝘮𝘢𝘪𝘴 𝘪𝘯𝘧𝘰𝘳𝘮𝘢çõ𝘦𝘴, 𝘶𝘴𝘦 𝘰 𝘤𝘰𝘮𝘢𝘯𝘥𝘰 !𝚙𝚎𝚗𝚊𝚕 𝘰𝘶 !𝚟𝚊𝚗𝚝𝚊𝚐𝚎𝚖.',
      ],
    },
    PENALTY: {
      title: 'PENAL / VANTAGEM     !𝚙𝚎𝚗𝚊𝚕 !𝚙𝚎𝚗 !𝚟𝚊𝚗𝚝𝚊𝚐𝚎𝚖 !𝚟𝚊𝚗𝚝',
      shortDescription: '',
      longDescription: [
        _1 + '• 𝖯𝖾𝗇𝖺𝗅 é 𝖼𝗈𝗆𝗈 𝗌𝖾 𝖼𝗁𝖺𝗆𝖺 "𝗳𝗮𝗹𝘁𝗮" 𝗇𝗈 𝖱𝗎𝗀𝖻𝗒.',
        _1 +
          '• 𝖰𝗎𝖺𝗇𝖽𝗈 𝗎𝗆 𝖨𝗆𝗉𝖾𝖽𝗂𝗆𝖾𝗇𝗍𝗈 é 𝖼𝗈𝗆𝖾𝗍𝗂𝖽𝗈, 𝗈 𝗍𝗂𝗆𝖾 𝗊𝗎𝖾 𝗌𝗈𝖿𝗋𝖾𝗎 𝖺 𝗂𝗇𝖿𝗋𝖺çã𝗈 𝗍𝖾𝗆 𝖺𝗍é 𝟱 𝘀𝗲𝗴𝘂𝗻𝗱𝗼𝘀 𝗽𝗮𝗿𝗮 𝗮𝗰𝗲𝗶𝘁𝗮𝗿 𝗼 𝗣𝗲𝗻𝗮𝗹.',
        _1 +
          '• 𝖲𝖾 𝖽𝖾𝗇𝗍𝗋𝗈 𝖽𝗈𝗌 𝟧 𝗌𝖾𝗀𝗎𝗇𝖽𝗈𝗌 𝗈 𝗍𝗂𝗆𝖾 𝗊𝗎𝖾 𝗌𝗈𝖿𝗋𝖾𝗎 𝖺 𝗂𝗇𝖿𝗋𝖺çã𝗈 𝗎𝗌𝖺𝗋 𝗈 𝖼𝗈𝗆𝖺𝗇𝖽𝗈 `𝚙` 𝗈𝗎 𝗈 𝗍𝗂𝗆𝖾 𝗂𝗇𝖿𝗋𝖺𝗍𝗈𝗋 𝗉𝗈𝗇𝗍𝗎𝖺𝗋, 𝖺 𝗃𝗈𝗀𝖺𝖽𝖺 é 𝖺𝗇𝗎𝗅𝖺𝖽𝖺 𝖾 é 𝗆𝖺𝗋𝖼𝖺𝖽𝗈 𝗈 𝗣𝗘𝗡𝗔𝗟. ⏸️',
        _1 +
          '• 𝖲𝖾 𝗈 𝗍𝗂𝗆𝖾 𝗊𝗎𝖾 𝗌𝗈𝖿𝗋𝖾𝗎 𝖺 𝗂𝗇𝖿𝗋𝖺çã𝗈 𝗎𝗌𝖺𝗋 𝗈 𝖼𝗈𝗆𝖺𝗇𝖽𝗈 `𝚟` 𝗈𝗎 𝖾𝗌𝗉𝖾𝗋𝖺𝗋 𝗈𝗌 𝟧 𝗌𝖾𝗀𝗎𝗇𝖽𝗈𝗌, é 𝖽𝖺𝖽𝖺 𝗩𝗔𝗡𝗧𝗔𝗚𝗘𝗠 𝖾 𝗈 𝗃𝗈𝗀𝗈 𝖼𝗈𝗇𝗍𝗂𝗇𝗎𝖺 𝗇𝗈𝗋𝗆𝖺𝗅𝗆𝖾𝗇𝗍𝖾. ⏩',
      ],
    },
    POST_RULES:
      // `O ${GAME_TITLE} é um jogo intuitivo e dinâmico. As regras podem ser pegas em pouco tempo com a prática.`,
      '𝘗𝘢𝘳𝘢 𝘭𝘦𝘳 𝘶𝘮 𝙧𝙚𝙨𝙪𝙢𝙤 𝙢𝙖𝙞𝙨 𝙙𝙚𝙩𝙖𝙡𝙝𝙖𝙙𝙤 𝘥𝘢𝘴 𝘳𝘦𝘨𝘳𝘢𝘴, 𝘢𝘤𝘦𝘴𝘴𝘦 𝘰 𝘤𝘢𝘯𝘢𝘭 #𝙧𝙚𝙜𝙧𝙖𝙨-𝙙𝙤-𝙟𝙤𝙜𝙤 𝘥𝘰 𝘯𝘰𝘴𝘴𝘰 𝘋𝘪𝘴𝘤𝘰𝘳𝘥 (𝖽𝗂𝗌𝖼𝗈𝗋𝖽.𝗂𝗈/𝖧𝖺𝗑𝖱𝗎𝗀𝖻𝗒).',
  },

  MSG_HELP: {
    TITLE: 'LISTA DE COMANDOS:',

    ADMIN_COMMANDS: _1 + 'Administrativos:',

    NEW_MATCH: _2 + '!rr ou !rr x2/x3/x4 ou !rr small/normal/big     Exemplo: !rr x4',
    NEW_MATCH_DESCRIPTION:
      _3 +
      'Cancela a partida atual (se houver) e começa uma nova partida. Opcionalmente, altera a configuração da partida.',

    ADMIN: _2 + '!admin <senha> [reclaim]',
    ADMIN_DESCRIPTION:
      _3 +
      'Concede admin para o jogador. Se usar o argumento `reclaim`, retira o admin de todos os demais jogadores da sala.',

    PASSWORD: _2 + '!pw ou !password <senha> [on/off]',
    PASSWORD_DESCRIPTION:
      _3 +
      'Coloca ou retira senha na/da sala. Se o jogador não é admin, recebe admin. Omitir o 2º argumento funciona como `on`.',

    SET_SCORE: _2 + '!set-score <pontos_do_red> <pontos_do_blue> [red/blue] [<tempo>]',
    SET_SCORE_DESCRIPTION:
      _3 +
      'Alterar o placar da partida e, opcionalmente, o mapa de reinício e o tempo restante. Formato do tempo: m:ss',

    OTHER_COMMANDS: _1 + 'Outros:',

    SCORE: _2 + '!s ou !score ou !placar',
    SCORE_DESCRIPTION: _3 + 'Exibe o tempo e placar da partida.',

    BALL_DESCRIPTION:
      _3 +
      '𝖻  𝘰𝘶  𝖡                                                             𝗥𝗘𝗣𝗢𝗦𝗜𝗖𝗜𝗢𝗡𝗔 𝗔 𝗕𝗢𝗟𝗔 𝗉𝖺𝗋𝖺 𝗈 𝖼𝗁𝗎𝗍𝖾 𝖽𝖾 𝖼𝗈𝗇𝗏𝖾𝗋𝗌ã𝗈.',
    KICKER_DESCRIPTION:
      _3 + '!𝚔  𝑜𝑢  !𝚔 𝚖𝚎  𝑜𝑢  !𝚔 #<𝙸𝙳_𝚍𝚘_𝚓𝚘𝚐𝚊𝚍𝚘𝚛>          𝖢𝗈𝗇𝗌𝗎𝗅𝗍𝖺 𝗈𝗎 𝗔𝗟𝗧𝗘𝗥𝗔 𝗢 𝗞𝗜𝗖𝗞𝗘𝗥 𝖽𝗈 𝗍𝗂𝗆𝖾.',
    GOALKEEPER_DESCRIPTION:
      _3 + '!𝚐𝚔  𝘰𝘶  !𝚐𝚔 𝚖𝚎  𝘰𝘶  !𝚐𝚔 #<𝙸𝙳_𝚍𝚘_𝚓𝚘𝚐𝚊𝚍𝚘𝚛>    𝖢𝗈𝗇𝗌𝗎𝗅𝗍𝖺 𝗈𝗎 𝗔𝗟𝗧𝗘𝗥𝗔 𝗢 𝗚𝗞 𝖽𝗈 𝗍𝗂𝗆𝖾.',

    RULES: _2 + '!r ou !regras ou !rules',
    RULES_DESCRIPTION: _3 + 'Exibe o resumo das regras do jogo.',

    LINKS: _2 + '!links ou !link ou !promo',
    LINKS_DESCRIPTION:
      _3 +
      'Exibe o link das regras, do Discord e do grupo no Facebook. Se for admin, exibe para todos os jogadores.',

    HELP: _2 + '!h ou !help ou !ajuda [forall]',
    HELP_DESCRIPTION:
      _3 +
      'Exibe essa lista de comandos. Se for admin e usar o argumento `forall`, exibe a lista para todos os jogadores.',
  },

  MSG_DEF_REC: [
    'DESVIO / RECUO',
    'A bola sofreu desvio ou foi recuada. Não tem safety! A defesa deve tentar tirar a bola!',
  ],
  MSG_BALL_LEAVE_INGOAL: 'A bola saiu do in-goal.',
  MSG_SAFETY_ALLOWED: 'Safety permitido.',

  MSG_PLAYER_CONFIGS: {
    SAFETY: 'Safety',
    AIR_KICK: 'Chute Aéreo',
  },
};

function getDict() {
  switch (appConfig.language) {
    case LanguageEnum['pt-BR']:
      return ptBr;
    default:
      return ptBr;
  }
}

const Dict = getDict();

export const MSG_GREETING = Dict['MSG_GREETING'];
export const MSG_GAME_INFO_1 = Dict['MSG_GAME_INFO_1'];
export const MSG_GAME_INFO_2 = Dict['MSG_GAME_INFO_2'];
export const MSG_GAME_INFO_3 = Dict['MSG_GAME_INFO_3'];
export const MSG_GAME_INFO_4 = Dict['MSG_GAME_INFO_4'];
export const MSG_GAME_INFO_5 = Dict['MSG_GAME_INFO_5'];

export const MSG_CLOSED_ROOM_1 = Dict['MSG_CLOSED_ROOM_1'];
export const MSG_CLOSED_ROOM_2 = Dict['MSG_CLOSED_ROOM_2'];
export const MSG_CLOSED_ROOM_3 = Dict['MSG_CLOSED_ROOM_3'];

export const MSG_RULES = Dict['MSG_RULES'];
export const MSG_HELP = Dict['MSG_HELP'];

export const MSG_DEF_REC = Dict['MSG_DEF_REC'];
export const MSG_BALL_LEAVE_INGOAL = Dict['MSG_BALL_LEAVE_INGOAL'];
export const MSG_SAFETY_ALLOWED = Dict['MSG_SAFETY_ALLOWED'];

export const MSG_PLAYER_CONFIGS = Dict['MSG_PLAYER_CONFIGS'];
