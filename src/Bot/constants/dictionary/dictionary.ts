import { lang, LanguageEnum } from '../appConfig';
import { APP_VERSION } from '../constants';
import DictionaryKeys from './DictionaryKeys';

const ptBr: DictionaryKeys = {
  MSG_GREETING_1: `Bem vindo(a) ao HaxRugby by JP v${APP_VERSION}!`,
  MSG_GREETING_2: 'Essa é uma sala de testes. Ainda estamos em desenvolvimento!',
  MSG_GREETING_3:
    'Nessa versão corrigimos bugs evidenciados no último teste aberto. Também lançamos o tamanho normal de mapa!',
  MSG_GREETING_4: 'Use o comando !regras para ver o resumo das regras do jogo.',
  MSG_GREETING_5: 'Use o comando !help ou !h para ver a lista de comandos disponíveis.',

  MSG_RULES: {
    TITLE: 'Resumo das REGRAS do jogo:',
    TRY_TITLE: 'TRY     !try',
    TRY: [
      'É o tento mais importante do rugby. É feito conduzindo a bola no in-goal adversário.',
      'O in-goal é a região do campo atrás da linha de gol de cada time.',
      'O Try vale 5 pontos e dá direito a uma conversão de 2 pontos.',
      'A conversão ainda não foi implementada.',
    ],
    FIELD_GOAL_TITLE: 'FIELD GOAL (FG)     !fg !gol',
    FIELD_GOAL: [
      'É o tento secundário do rugby. Vale 3 pontos.',
      'Só pode ser feito de fora da pequena área. Qualquer contato na bola dentro dessa área invalida o Field Goal.',
    ],
    SAFETY_TITLE: 'SAFETY (SF)     !sf !safety',
    SAFETY: [
      'É a jogada de segurança da defesa. É feito conduzindo a bola no próprio in-goal.',
      'O Safety só é possível se o último toque na bola antes dela entrar no in-goal for do ataque.',
      'O Safety concede à defesa um tiro de reinício no local da última condução de bola do adversário.',
    ],
    LINK_FOR_COMPLETE_RULES:
      'Para as regras completas, acesse sites.google.com/site/haxrugby/regras',
  },

  MSG_HELP: {
    TITLE: 'LISTA DE COMANDOS:',

    ADMIN_COMMANDS: '  Administrativos:',

    NEW_MATCH: '    !new ou !rr [<tempo>] [<pontos>] [small/normal] [red/blue]',
    NEW_MATCH_DESCRIPTION:
      'Cancela a partida atual (se houver) e começa uma nova partida. Opcionalmente, configura os limites de tempo e de pontos, o tamanho de mapa da nova partida e das próximas, e a posse de bola inicial. Só pode ser usado por admins.',

    ADMIN: '    !admin <senha> [reclaim]',
    ADMIN_DESCRIPTION:
      'Concede admin para o jogador. Se usar o argumento `reclaim`, retira o admin de todos os demais jogadores da sala.',

    PASSWORD: '    !pw ou !password <senha> [on/off]',
    PASSWORD_DESCRIPTION:
      'Coloca ou retira senha na/da sala. Se o jogador não é admin, recebe admin. Omitir o 2º argumento funciona como `on`.',

    SET_SCORE: '    !set-score <pontos_do_red> <pontos_do_blue> [red/blue] [<tempo>]',
    SET_SCORE_DESCRIPTION:
      'Alterar o placar da partida e, opcionalmente, o mapa de reinício e o tempo restante. Formato do tempo: m:ss',

    OTHER_COMMANDS: '  Outros:',

    HELP: '    !h ou !help ou !ajuda [forall]',
    HELP_DESCRIPTION:
      'Exibe essa lista de comandos. Se for admin e usar o argumento `forall`, exibe a lista para todos os jogadores.',

    SCORE: '    !s ou !score ou !placar',
    SCORE_DESCRIPTION: 'Exibe o tempo e placar da partida.',

    KICKER: '    !k ou !kicker [me/<#jogador>]',
    KICKER_DESCRIPTION: 'Consulta ou altera o Kicker do time.',

    GOALKEEPER: '    !gk ou !goalkeeper [me/<#jogador>]',
    GOALKEEPER_DESCRIPTION: 'Consulta ou altera o GK do time.',

    PLACE_BALL: '    !pl ou !place',
    PLACE_BALL_DESCRIPTION: 'Reposiciona a bola na conversão de 2 pontos.',

    RULES: '    !r ou !regras ou !rules',
    RULES_DESCRIPTION: 'Exibe o resumo das regras do jogo.',

    LINKS: '    !links ou !link ou !promo',
    LINKS_DESCRIPTION:
      'Exibe o link das regras, do Discord e do grupo no Facebook. Se for admin, exibe para todos os jogadores.',
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
