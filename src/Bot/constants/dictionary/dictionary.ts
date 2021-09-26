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
    TRY: [
      'É o tento mais importante do rugby. Vale 5 pontos e dá direito a uma conversão de 2 pontos.',
      'A conversão ainda não foi implementada',
    ],
    GOAL: [
      'É o tento secundário do rugby. Vale 3 pontos.',
      'Só pode ser feito de fora da pequena área. Qualquer contato dentro dessa área invalida o gol.',
    ],
    SAFETY: [
      'É a jogada de segurança da defesa.',
      'Se o último toque na bola antes dela entrar no ingoal for do ataque, a defesa pode conduzir a bola.',
      'O Safety concede à defesa um tiro de reinício no local da última condução de bola do adversário.',
    ],
    LINK_FOR_COMPLETE_RULES:
      'Para as regras completas, acesse sites.google.com/site/haxrugby/regras-completas',
  },

  MSG_HELP: {
    TITLE: 'Lista de comandos:',

    HELP: '!h ou !help ou !ajuda',
    HELP_DESCRIPTION: 'Exibe essa lista de comandos. Se for admin, exibe para todos os jogadores.',

    RULES: '!r ou !regras ou !rules',
    RULES_DESCRIPTION: 'Exibe o resumo das regras do jogo.',

    NEW_MATCH: '!new [<tempo>] [<pontos>] [small/normal]',
    NEW_MATCH_DESCRIPTION:
      'Cancela a partida atual (se houver), começa uma nova partida, e configura os limites de tempo e de pontos e o tamanho de mapa da nova partida e das próximas. Só pode ser usado por admins. Se o 3º argumento for omitido, mantém o tamanho de mapa atual.',

    SCORE: '!s ou !score ou !placar',
    SCORE_DESCRIPTION: 'Exibe o tempo e placar da partida.',

    LINKS: '!links ou !promo',
    LINKS_DESCRIPTION:
      'Exibe o link das regras, do Discord e do grupo no Facebook. Se for admin, exibe para todos os jogadores.',

    ADMIN: '!admin <senha> [reclaim]',
    ADMIN_DESCRIPTION:
      'Concede admin para o jogador. Se usar o argumento `reclaim`, retira o admin de todos os demais jogadores da sala.',

    PASSWORD: '!pw ou !password <senha> [on/off]',
    PASSWORD_DESCRIPTION:
      'Coloca ou retira senha na/da sala. Se o jogador não é admin, recebe admin. Omitir o 2º argumento funciona como `on`.',
  },

  MSG_DEF_REC: [
    'DESVIO / RECUO',
    'A bola sofreu desvio ou foi recuada. Não tem safety! A defesa deve tentar tirar a bola!',
  ],
  MSG_BALL_LEAVE_INGOAL: 'A bola saiu do ingoal.',
  MSG_SAFETY_ALLOWED: 'Safety permitido.',
};

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

function getDict() {
  switch (lang) {
    case LanguageEnum['pt-BR']:
      return ptBr;
    default:
      return ptBr;
  }
}
