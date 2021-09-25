import { APP_VERSION } from './constants';

export const MSG_GREETING_1 = `Bem vindo(a) ao HaxRugby by JP v${APP_VERSION}!`;
export const MSG_GREETING_2 = 'Essa é uma sala de testes. Ainda estamos em desenvolvimento!';
export const MSG_GREETING_3 =
  'Nessa versão corrigimos bugs evidenciados no último teste aberto. Também lançamos o tamanho normal de mapa!';
export const MSG_GREETING_4 = 'Use o comando !regras para ver o resumo das regras do jogo.';
export const MSG_GREETING_5 = 'Use o comando !help ou !h para ver a lista de comandos disponíveis.';

export const MSG_RULES = {
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
};

export const MSG_HELP = {
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
};
