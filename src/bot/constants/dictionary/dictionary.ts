import { lang, LanguageEnum } from '../appConfig';
import { APP_MINOR_VERSION, APP_VERSION, GAME_TITLE, ROOM_TITLE } from '../constants';
import DictionaryKeys from './DictionaryKeys';

export const _1: string = '   ';
export const _2: string = '      ';
export const _3: string = '         ';

const ptBr: DictionaryKeys = {
  MSG_GREETING: `𝖡𝖾𝗆 𝗏𝗂𝗇𝖽𝗈(𝖺) 𝖺𝗈 ${ROOM_TITLE} ${APP_VERSION}!`,
  MSG_GAME_INFO_1: `𝖵𝗈𝖼ê 𝖾𝗌𝗍á 𝗇𝗈 ${ROOM_TITLE} ${APP_VERSION}!`,
  MSG_GAME_INFO_2:
    '𝖠𝗂𝗇𝖽𝖺 𝖾𝗌𝗍𝖺𝗆𝗈𝗌 𝖾𝗆 𝗱𝗲𝘀𝗲𝗻𝘃𝗼𝗹𝘃𝗶𝗺𝗲𝗻𝘁𝗼! 𝖲𝖾 𝖾𝗇𝖼𝗈𝗇𝗍𝗋𝖺𝗋 𝗯𝘂𝗴𝘀, 𝗋𝖾𝗅𝖺𝗍𝖾 𝗇𝗈 𝖼𝖺𝗇𝖺𝗅 #𝖻𝗎𝗀𝗌 𝖽𝗈 𝗇𝗈𝗌𝗌𝗈 𝗗𝗶𝘀𝗰𝗼𝗿𝗱 (!𝖽𝖼).',
  MSG_GAME_INFO_3: `𝖭𝖺 𝗏𝖾𝗋𝗌ã𝗈 𝘃𝟬.𝟭𝟭 𝗂𝗇𝗍𝗋𝗈𝖽𝗎𝗓𝗂𝗆𝗈𝗌 𝗈 𝗜𝗺𝗽𝗲𝗱𝗶𝗺𝗲𝗻𝘁𝗼 "𝗜𝗻𝘀𝗶𝗱𝗲" (𝖼𝗈𝗆𝖺𝗇𝖽𝗈 !𝗶𝗺𝗽), 𝖺 𝗩𝗮𝗻𝘁𝗮𝗴𝗲𝗺 𝖾 𝗈 𝗣𝗲𝗻𝗮𝗹.`,
  MSG_GAME_INFO_4: `𝖤 𝗇𝖺 𝗏𝖾𝗋𝗌ã𝗈 ${APP_MINOR_VERSION} 𝗂𝗇𝗍𝗋𝗈𝖽𝗎𝗓𝗂𝗆𝗈𝗌 𝗈 𝗜𝗺𝗽𝗲𝗱𝗶𝗺𝗲𝗻𝘁𝗼 "𝗢𝗳𝗳𝘀𝗶𝗱𝗲" (𝖼𝗈𝗆𝖺𝗇𝖽𝗈 !𝗶𝗺𝗽). 𝖠𝗀𝗈𝗋𝖺 𝖺 𝗋𝖾𝗀𝗋𝖺 𝖽𝗈 𝖨𝗆𝗉𝖾𝖽𝗂𝗆𝖾𝗇𝗍𝗈 𝖾𝗌𝗍á 𝗰𝗼𝗺𝗽𝗹𝗲𝘁𝗮!`,
  // MSG_GAME_INFO_3: `𝖭𝖺 𝗏𝖾𝗋𝗌ã𝗈 ${APP_MINOR_VERSION} 𝗂𝗆𝗉𝗅𝖾𝗆𝖾𝗇𝗍𝖺𝗆𝗈𝗌 𝗈 𝗗𝗿𝗼𝗽 𝗚𝗼𝗮𝗹 (𝖼𝗈𝗆𝖺𝗇𝖽𝗈 !𝗱𝗿𝗼𝗽) 𝖾 𝗈 𝗖𝗵𝘂𝘁𝗲 𝗔𝗲𝗿𝗲𝗼 (𝖼𝗈𝗆𝖺𝗇𝖽𝗈 !𝗮𝗶𝗿).`,
  // MSG_GREETING_3: `𝖭𝖺 𝗏𝖾𝗋𝗌ã𝗈 ${APP_MINOR_VERSION} 𝗈 𝖼𝗈𝗇𝖼𝖾𝗂𝗍𝗈 𝖽𝗈 𝖥𝗂𝖾𝗅𝖽 𝖦𝗈𝖺𝗅 𝗆𝗎𝖽𝗈𝗎 𝖾 𝖺𝗀𝗈𝗋𝖺 𝖾𝗅𝖾 𝗌𝖾 𝖼𝗁𝖺𝗆𝖺 𝗗𝗿𝗼𝗽 𝗚𝗼𝗮𝗹. 𝖴𝗌𝖾 𝗈 𝖼𝗈𝗆𝖺𝗇𝖽𝗈 !𝗱𝗿𝗼𝗽 𝗉𝖺𝗋𝖺 𝗆𝖺𝗂𝗌 𝖽𝖾𝗍𝖺𝗅𝗁𝖾𝗌.`,
  MSG_GAME_INFO_5:
    '𝖴𝗌𝖾 𝗈 𝖼𝗈𝗆𝖺𝗇𝖽𝗈 !𝗿𝗲𝗴𝗿𝗮𝘀 𝗉𝖺𝗋𝖺 𝗏𝖾𝗋 𝖺𝗌 𝗿𝗲𝗴𝗿𝗮𝘀 𝗱𝗼 𝗷𝗼𝗴𝗼. 𝖤 𝗈 𝖼𝗈𝗆𝖺𝗇𝖽𝗈 !𝗵 𝗉𝖺𝗋𝖺 𝗏𝖾𝗋 𝖺 𝗹𝗶𝘀𝘁𝗮 𝗱𝗲 𝗰𝗼𝗺𝗮𝗻𝗱𝗼𝘀 𝖽𝗂𝗌𝗉𝗈𝗇í𝗏𝖾𝗂𝗌.',
  // MSG_GAME_INFO_6: '𝖴𝗌𝖾 𝗈 𝖼𝗈𝗆𝖺𝗇𝖽𝗈 !𝗵𝗲𝗹𝗽 𝗈𝗎 !𝗵 𝗉𝖺𝗋𝖺 𝗏𝖾𝗋 𝖺 𝗹𝗶𝘀𝘁𝗮 𝗱𝗲 𝗰𝗼𝗺𝗮𝗻𝗱𝗼𝘀 𝖽𝗂𝗌𝗉𝗈𝗇í𝗏𝖾𝗂𝗌.',

  MSG_RULES: {
    TITLE: 'Resumo das REGRAS do jogo:',
    TRY: {
      shortDescription:
        '• 𝗧𝗥𝗬 - 𝖵𝖺𝗅𝖾 𝟱 𝗽𝗼𝗻𝘁𝗼𝘀 𝖾 é 𝖿𝖾𝗂𝗍𝗈 𝗖𝗢𝗡𝗗𝗨𝗭𝗜𝗡𝗗𝗢 𝖺 𝖻𝗈𝗅𝖺 𝗇𝗈 𝗂𝗇-𝗀𝗈𝖺𝗅 𝖺𝖽𝗏𝖾𝗋𝗌á𝗋𝗂𝗈. 𝘜𝘴𝘦 !𝚝𝚛𝚢 𝘱𝘢𝘳𝘢 𝘮𝘢𝘪𝘴 𝘥𝘦𝘵𝘢𝘭𝘩𝘦𝘴.',
      title: 'TRY     !try',
      longDescription: [
        _1 +
          'É o objetivo mais importante do rugby. É feito CONDUZINDO a bola no in-goal adversário.',
        _1 + 'O in-goal é a região do campo atrás da linha de gol de cada time.',
        _1 + 'O Try vale 5 pontos e dá direito a uma CONVERSÃO DE 2 PONTOS.',
      ],
    },
    DROP_GOAL: {
      shortDescription:
        '• 𝗗𝗥𝗢𝗣 𝗚𝗢𝗔𝗟 - 𝖵𝖺𝗅𝖾 𝟯 𝗽𝗼𝗻𝘁𝗼𝘀 𝖾 é 𝖿𝖾𝗂𝗍𝗈 𝖺𝖼𝖾𝗋𝗍𝖺𝗇𝖽𝗈 𝗎𝗆 𝗖𝗛𝗨𝗧𝗘 𝗔É𝗥𝗘𝗢 𝗇𝗈 𝗀𝗈𝗅 𝖺𝖽𝗏𝖾𝗋𝗌á𝗋𝗂𝗈. 𝘜𝘴𝘦 !𝚍𝚛𝚘𝚙 𝘦 !𝚊𝚎𝚛𝚎𝚘 𝘱𝘢𝘳𝘢 𝘮𝘢𝘪𝘴 𝘥𝘦𝘵𝘢𝘭𝘩𝘦𝘴.',
      title: 'DROP GOAL (DG)     !drop !dg !gol',
      longDescription: [
        _1 + 'É o objetivo secundário do rugby. Vale 3 pontos.',
        _1 +
          'Só pode ser feito de fora da pequena área e com um CHUTE AÉREO (use !air para mais detalhes).',
        _1 + 'Não é possível fazer um Drop Goal contra.',
      ],
    },
    AIR_KICK: {
      shortDescription: '',
      title: 'CHUTE AÉREO (AIR)     !air !aereo',
      longDescription: [
        _1 +
          'É um chute mais forte (1,2x no small e 1,3x no normal), que PASSA POR CIMA dos jogadores.',
        _1 + 'Para tentar um Chute Aéreo, conduza a bola e em seguida chute-a.',
        _1 +
          'Se nenhum jogador tocar na bola por 0,2s, ela então se tornará "Aérea". A Bola Aérea dura 1,55s.',
        _1 + 'O Drop Goal só será marcado se a bola atravessar o gol com o status de Aérea.',
        _1 + 'Use o comando `a` para ativar/desativar seu Chute Aéreo.',
      ],
    },
    SAFETY: {
      shortDescription:
        '• 𝗦𝗔𝗙𝗘𝗧𝗬 - É 𝖺 𝗃𝗈𝗀𝖺𝖽𝖺 𝖽𝖾 𝗌𝖾𝗀𝗎𝗋𝖺𝗇ç𝖺 𝖽𝖺 𝖽𝖾𝖿𝖾𝗌𝖺. É 𝖿𝖾𝗂𝗍𝗈 𝗖𝗢𝗡𝗗𝗨𝗭𝗜𝗡𝗗𝗢 𝖺 𝖻𝗈𝗅𝖺 𝗇𝗈 𝗉𝗋ó𝗉𝗋𝗂𝗈 𝗂𝗇-𝗀𝗈𝖺𝗅. 𝘜𝘴𝘦 !𝚜𝚊𝚏𝚎𝚝𝚢 𝘱𝘢𝘳𝘢 𝘮𝘢𝘪𝘴 𝘥𝘦𝘵𝘢𝘭𝘩𝘦𝘴.',
      title: 'SAFETY (SF)     !sf !safety',
      longDescription: [
        _1 + 'É a jogada de segurança da defesa. É feito CONDUZINDO a bola no próprio in-goal.',
        _1 +
          'O Safety só é possível se o último toque na bola antes dela entrar no in-goal for do ataque.',
        _1 + 'O Safety concede à defesa um tiro de reinício no local da última condução de bola.',
      ],
    },
    OFFSIDE: {
      shortDescription: `• 𝗜𝗠𝗣𝗘𝗗𝗜𝗠𝗘𝗡𝗧𝗢 - 𝖯𝖺𝗋𝖺 𝗅𝖾𝗋 𝗌𝗈𝖻𝗋𝖾 𝖺 𝗋𝖾𝗀𝗋𝖺 𝖽𝗈 𝖨𝗆𝗉𝖾𝖽𝗂𝗆𝖾𝗇𝗍𝗈 𝗇𝗈 ${GAME_TITLE}, 𝗎𝗌𝖾 𝗈 𝖼𝗈𝗆𝖺𝗇𝖽𝗈 !𝚒𝚖𝚙.`,
      title: 'IMPEDIMENTO     !imp !impedimento',
      longDescription: [
        _1 + 'Todo jogador está impedido se:',
        _2 + '(1) Estiver dentro do in-goal (INSIDE) no momento do passe (linha é dentro);',
        _2 +
          '(2) Estiver à frente da linha do último defensor ou do passador (OFFSIDE) no momento do passe.',
        _3 +
          '- Jogadores totalmente dentro de sua Safe Zone (Zona Protegida) estão imunes ao Offside.',
        _1 + 'Para mais informações, use o comando !penal ou !vantagem.',
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

    NEW_MATCH: _2 + '!rr ou !rr x2/x3/x4     Exemplo: !rr x4',
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

    KICKER: _2 + '!k ou !k me ou !k #<ID_do_jogador>',
    KICKER_DESCRIPTION: _3 + 'Consulta ou altera o Kicker do time.',

    GOALKEEPER: _2 + '!gk ou !gk me ou !gk #<ID_do_jogador>',
    GOALKEEPER_DESCRIPTION: _3 + 'Consulta ou altera o GK do time.',

    BALL: _2 + 'b ou B',
    BALL_DESCRIPTION: _3 + 'Reposiciona a bola para o chute de conversão.',

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
};

function getDict() {
  switch (lang) {
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

export const MSG_RULES = Dict['MSG_RULES'];
export const MSG_HELP = Dict['MSG_HELP'];

export const MSG_DEF_REC = Dict['MSG_DEF_REC'];
export const MSG_BALL_LEAVE_INGOAL = Dict['MSG_BALL_LEAVE_INGOAL'];
export const MSG_SAFETY_ALLOWED = Dict['MSG_SAFETY_ALLOWED'];
