import { lang, LanguageEnum } from '../appConfig';
import { APP_MINOR_VERSION, APP_VERSION, GAME_TITLE, ROOM_TITLE } from '../constants';
import DictionaryKeys from './DictionaryKeys';

export const _1: string = '   ';
export const _2: string = '      ';
export const _3: string = '         ';

const ptBr: DictionaryKeys = {
  MSG_GREETING_1: `Bem vindo(a) ao ${ROOM_TITLE} ${APP_VERSION}!`,
  MSG_GREETING_2:
    'Ainda estamos em desenvolvimento! Se encontrar bugs, relate no canal #bugs do nosso Discord (!dc).',
  MSG_GREETING_3: `Na versão ${APP_MINOR_VERSION} lançamos a 𝗰𝗼𝗻𝘃𝗲𝗿𝘀ã𝗼 𝗱𝗲 𝟮 𝗽𝗼𝗻𝘁𝗼𝘀!`,
  MSG_GREETING_4: 'Use o comando !regras para ver o resumo das regras do jogo.',
  MSG_GREETING_5: 'Use o comando !help ou !h para ver a lista de comandos disponíveis.',

  MSG_RULES: {
    TITLE: 'Resumo das REGRAS do jogo:',
    TRY_TITLE: 'TRY     !try',
    TRY: [
      _1 + 'É o tento mais importante do rugby. É feito conduzindo a bola no in-goal adversário.',
      _1 + 'O in-goal é a região do campo atrás da linha de gol de cada time.',
      _1 + 'O Try vale 5 pontos e dá direito a uma conversão de 2 pontos.',
    ],
    FIELD_GOAL_TITLE: 'FIELD GOAL (FG)     !fg !gol',
    FIELD_GOAL: [
      _1 + 'É o tento secundário do rugby. Vale 3 pontos.',
      _1 +
        'Só pode ser feito de fora da pequena área. Qualquer contato na bola dentro dessa área invalida o Field Goal.',
    ],
    SAFETY_TITLE: 'SAFETY (SF)     !sf !safety',
    SAFETY: [
      _1 + 'É a jogada de segurança da defesa. É feito conduzindo a bola no próprio in-goal.',
      _1 +
        'O Safety só é possível se o último toque na bola antes dela entrar no in-goal for do ataque.',
      _1 +
        'O Safety concede à defesa um tiro de reinício no local da última condução de bola do adversário.',
    ],
    OFFSIDE_TITLE: 'IMPEDIMENTO (IMP)',
    OFFSIDE: [_1 + 'As regras de impedimento (OFFSIDE e INSIDE) ainda não foram implementadas.'],
    POST_RULES: [
      `O ${GAME_TITLE} é um jogo intuitivo e dinâmico. As regras podem ser pegas em pouco tempo com a prática.`,
      'Para ler as regras completas, acesse sites.google.com/site/haxrugby/regras',
    ],
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

export const MSG_GREETING_1 = Dict['MSG_GREETING_1'];
export const MSG_GREETING_2 = Dict['MSG_GREETING_2'];
export const MSG_GREETING_3 = Dict['MSG_GREETING_3'];
export const MSG_GREETING_4 = Dict['MSG_GREETING_4'];
export const MSG_GREETING_5 = Dict['MSG_GREETING_5'];

export const MSG_RULES = Dict['MSG_RULES'];
export const MSG_HELP = Dict['MSG_HELP'];

export const MSG_DEF_REC = Dict['MSG_DEF_REC'];
export const MSG_BALL_LEAVE_INGOAL = Dict['MSG_BALL_LEAVE_INGOAL'];
export const MSG_SAFETY_ALLOWED = Dict['MSG_SAFETY_ALLOWED'];
