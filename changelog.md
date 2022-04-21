## CHANGELOG

### v0.15c:

- Adicionado comando para **ativar/desativar safety** (comando `z` ou `!sf`).
  - Isso é útil quando, por exemplo, um jogador deseja realizar um chute aéreo dentro do próprio in-goal em bola não-amarela.
- Adicionado o comando `!c` (ou `!conf` ou `!config`) para exibir ao jogador as suas configurações de jogo atuais.
  - Atualmente há apenas duas: Safety (ativado/desativado) e Chute Aéreo (ativado/desativado).
- Adicionadas as opções `small`/`normal`/`big` ao comando `!rr`. Exemplo: `!rr big`
  - Para ajuda quanto ao comando `!rr` e outros, use o comando `!h`.

### v0.15b:

- O chute de conversão do map Big agora é 1,4x mais forte.
  - Não foi alterada a força do boost já existente no chão, e sim a força do chute (x) mesmo.
- Corrigido pequeno bug da bola ficando presa na cor do time após pontuações.
  - Esse bug não afetava a jogabilidade.

### v0.15a:

- Corrigido um bug durante a Conversão do map Big.
- Alterado o map padrão do x4 para o Big.

### v0.15:

- Lançado o map tamanho **Big**.
  - _Ainda está em fase de testes e ajustes..._
- Adicionadas as opções `big`, `x5` e `x6` ao comando `!rr`. Exemplos:
  - `!rr x5`
  - `!rr 4 30 big`
  - `!rr - - big`

### v0.14d:

- Corrigido o bug da bola ficando na cor errada (do time ofensivo) em safety de bola dividida.

### v0.14c:

- Criado comando para resetar os times (`!rr-teams` ou `!reset-teams`) no que diz respeito à All Blackerização (ou outras customizações).
  - Apenas _SuperAdmins_ podem usar esse comando.
- Corrigidos bugs do patch anterior.
- Agora apenas SuperAdmins podem usar os comandos `!clearban` e `!clearbans`.
- Alterado o ícone de jogadores impedidos para o de uma banheira (🛁 ).

### v0.14b:

- Implementada a **All Blackerização**.
  - Times com vitórias consecutivas irão ficar gradativamente mais escuros.
  - Após 5 vitórias consecutivas, o time se transformará no _All Blacks_.
  - O _All Blacks_ possui cor de disco totalmente preta, além de nome de time e cor de mensagem diferenciados nos anúncios de jogo.
- Adicionado filtro para mensagens que travam o jogo.
  - Adotamos o mesmo filtro usado por Gab em suas salas.
- Melhorias diversas ao longo de todo o fluxo de jogo.

### v0.14a:

- Removido o pause e adicionado **efeito de pontuação** para todas as pontuações.
  - O pause no Safety foi mantido por conta de eu ainda não ter conseguido congelar a bola e jogadores.
  - Assim que eu conseguir fazer isso, vou remover o pause para o Safety também.
- Melhoradas as mensagens de ajuda da Conversão.

### v0.14:

- Nosso bot agora está num **VPS**!

### v0.13a:

- Aumentado o _boost_ de conversão de 2,4x para 2,7x.
  - Lembrando que esse boost está localizado no campo, logo à frente da bola. Não é necessário usar o `x` para utilizá-lo, basta empurrar a bola.
- Invertidos o lado inicial e o sentido de deslocamento da sombra.
  - Isso é pra simular que sol está se deslocando da direita para a esquerda no céu (leste a oeste).
- Leves ajustes na precisão do efeito de deslocamento de sombra.

### v0.13:

- Incluído o nome "JP's HaxRugby" no map tamanho small.
- Alterada a cor do nome "JP's HaxRugby" desenhado no campo.
- Adicionado _efeito de sombra_ para o gol:
  - A sombra se desloca ao longo da partida;
  - A velocidade da sombra depende da duração total da partida. Em partidas curtas a sombra se deslocará mais rapidamente.

### v0.12e:

- Corrigido erro na lógica de Impedimento quando, em certas situações, a condição de um ou mais jogadores deveria ser normalizada, mas não estava sendo.
  - Sempre que o time X chuta ou conduz a bola, normaliza-se a condição de todos os jogadores do time Y, exceto se tanto a bola quanto o jogador do time Y estiverem dentro do in-goal do time X no momento do chute/condição. Foi corrigido um erro nessa lógica.
- Corrigido bug do bot informando Penal depois de um Try.
- Corrigido Try sendo centralizado mesmo quando o Impedimento é contra o time que fez o Try.
  - Apenas quando a defesa comete um Impedimento depois do Try, é que o Try é centralizado (é dado _Penal-Try_). Mas isso é bem difícil de acontecer por conta da _Safe Zone_. _Eu nem consegui reproduzir isso testando sozinho aqui..._
- Não é mais necessário estar com o disco totalmente dentro da Safe Zone para se considerar dentro dela. Agora basta ter qualquer parte do disco sobre a linha da Safe Zone.
  - Lembrando a regra: _jogadores dentro de sua Safe Zone estão imunes ao Offside_.
- Comando `!tempo` agora também exibe o placar e o tempo.

### v0.12d:

- Tentativa de correção do bug da bola ficando permanentemente no estado "Aérea".
  - São necessários testes para certificar que o problema foi solucionado.
- Melhoria no texto e estilo das regras dos comandos `!try`, `!drop`, `!sf`, `!air`, `!imp` e `!penal`.

### v0.12c:

- **Alterado o padrão no pós-impedimento de Penal para Vantagem.**
  - Agora os times devem usar o comando `p` para aceitar o Penal. Se dentro de 5 segundos nenhuma escolha for feita, será concedida _Vantagem Automática_.
- Encurtado e melhorado o resumo de regras do comando `!regras` ou `!r`.
- Melhorias nos textos de algumas regras.
- Adicionado um único comando para explicar o Penal e a Vantagem (`!penal` ou `!vantagem`).
- Corrigido erro do tempo da conversão acabar mesmo depois de realizado o disparo.
- Corrigido comando `v` podendo ser utilizado mesmo depois de aceitar o Penal.

### v0.12b:

- Substituído o desenho de campo "Rugby Union" por "HaxRugby".
- Leve ajuste no desenho de campo "JP's".

### v0.12a:

- Jogadores que cometem Impedimento agora recebem um emoji diferenciado (⚠️).
- Corrigido bug de ser desconectado após kickar ou banir alguém, mesmo sendo SuperAdmin.
- Melhorias nas mensagens do bot referentes ao cargo de SuperAdmin.
- Corrigido partida não sendo cancelada devido a ausência de jogadores durante 15 segundos.

### v0.12:

- Introduzido o **OFFSIDE**, a 2ª parte da regra do **Impedimento**:
  - Junto ao Inside introduzido na última versão (`v0.11`), a regra do Impedimento agora está completa.
  - Estão em posição de Offside os jogadores localizados à frente da linha do último defensor ou do passador no momento do passe.
  - O Offside considera todos os jogadores adversários, não existe algo como "goleiro".
  - Jogadores totalmente dentro de sua **Safe Zone (Zona Protegida)** estão imunes ao Offside.
  - A Safe Zone de um time vai do fundo do seu in-goal até a primeira linha branca depois do in-goal.

### v0.11b:

- Adicionado comando para aceitar imediatamente o Penal (`p`), não precisando esperar os 5s.
- A partida agora é automaticamente cancelada se ambos os times ficarem vazios por 15s.
- Correções e melhorias referentes às novas funcionalidades da versão v0.11.

### v0.11a:

- Adicionada **gestão de kick e ban**:
  - Jogadores sem senha de admin que tentarem kickar ou banir alguém agora serão imediatamente kickados.
  - E em caso de ban, o ban será retirado.
- Correções e melhorias referentes às novas funcionalidades da versão v0.11.

### v0.11:

- Introduzido o **INSIDE**, uma das duas partes da regra do **Impedimento**:
  - Todos os jogadores de ataque estão impedidos se estiverem com qualquer parte do disco dentro do in-goal (linha é dentro).
  - Para a regra do Impedimento, ocorre uma nova origem de jogada sempre que houver um chute ou condução por parte de qualquer time.
  - Desvios simples não eliminam a condição de impedimento! Como dito acima, apenas chutes ou conduções fazem a jogada ser reavaliada.
  - _A infração só acontece se o jogador impedido encostar na bola._
- Introduzida a **VANTAGEM**:
  - Se ocorrer um Impedimento por parte de um time, o outro time tem até **5 segundos** para aceitar ou não a Vantagem. Para isso, qualquer jogador do time pode usar o comando `v`.
  - Se a vantagem for aceita, a jogada prossegue normalmente e a infração é retirada (_todos os jogadores impedidos tem suas condições de jogo normalizadas_).
- Introduzido o **PENAL**:
  - Penal é como se chama "falta" no Rugby.
  - Diferente do Kickoff e do Tiro de Safety, o time pode optar por **sair conduzindo a bola**.
  - _[Não implementado ainda]_ O time também pode pedir **Chute ao Gol** (como se fosse uma conversão), porém nesse caso valendo 3 pontos.
- Correções referentes ao último patch.

### v0.10g:

- Aumentado de 2s para 3s o acumulado de tempo para o time que fez o Try tentar levar a bola mais para o centro do in-goal.
  - Para quem não entende como isso funciona, esse tempo de 3s (antes 2s) é congelado quando o time que fez o Try está encostando na bola, ou está levando a bola mais para o centro do in-goal.
  - Sendo assim, o time tem um "acumulado" de 3s (antes 2s) para tentar centralizar o Try o máximo possível.
- O período após o Try (mencionado acima) não conta mais para o tempo de jogo.
  - O relógio de jogo agora será congelado assim que a bola mudar para a cor do time que fez o Try.
- Maior destaque para as mensagens de pontuação.
- Correções de pequenos problemas do último patch.

### v0.10f:

- Adicionado **limite de 20 segundos** para cobrança da Conversão.
- Eliminado o rebote da conversão.
- O comando `b` agora só pode ser usado após 2 segundos.
- O Chute Aéreo agora é desabilitado após a marcação do Try, permitindo assim um passe curte com o intuito de levar a bola mais para o centro do in-goal.
- Adicionado o comando `!clearbans` (mesmo comportamento de `!clearban all`).
- Melhoradas as mensagens do bot.
- Corrigido bola ficando branca no pause automático após a marcação do Try.

### v0.10e:

- Aplicada mais uma correção para o erro da bola área não retornando ao normal.
  - Com a correção do último patch, esse erro teve sua frequência bem reduzida, mas ainda insiste em ocorrer às vezes.
- Diminuída a força do Chute Aéreo do map small de `1.3x` para `1.2x`.
- Melhoradas as mensagens do bot.
- Impedida a seleção de stadiums que não são do HaxRugby.

### v0.10d:

- Corrigido o bug crítico da bola aérea não retornando ao normal (ainda são necessários testes).
- Ajustes quanto ao Chute Aéreo:
  - Diminuída a fase de bloqueio de `0,25s` para `0,2s`.
  - Aumentado o tempo da bola aérea de `1,25s` para `1,55s`.
- Melhoria nas explicações dos comandos `!drop` e `!air`.
- Bola aérea desviada/recuada agora recebe uma mistura (meio a meio) do amarelo de bola desviada/recuada com o cinza de bola aérea.

### v0.10c:

- Mais correções e ajustes quanto ao Chute Aéreo.
- Adicionado comando para exibir explicação do Chute Aéreo (`!air` ou `!aereo`).

### v0.10b:

- Correções e melhorias de jogabilidade quanto ao Chute Aéreo.
- Ajustes nas cores e nas mensagens de jogo quanto ao Chute Aéreo.

### v0.10a:

- Tempo mínimo de condução revertido para 0.167s.
- _[Experiência]_ Implementado o **Chute Aéreo**:
  - Use o comando `a` para ativar ou desativar o Chute Aéreo;
  - Para marcar um Drop Goal é necessário usar o Chute Aéreo.

### v0.10:

- _[Experiência]_ O Field Goal agora se chama **Drop Goal**;
- Para se marcar um Drop Goal é preciso conduzir a bola primeiro;
- Desvios dentro da pequena área não evitam o Drop Goal;
- Não é possível fazer um Drop Goal contra;
- Diminuído o tempo mínimo de condução de 0.167s para 0.1s.

### v0.9b:

- Diminuído o raio da bola de 8.5 para 7.5;
- Bola desviada/recuada agora fica com a cor roxa.

### v0.9a:

- O tiro de safety agora é no local da última condução de bola à frente da zona protegida.
- A bola agora altera para a cor do time que a conduziu, e transita gradualmente para o branco quando é solta.

### v0.9:

- Implementada a classe `HaxRugbyStadium`;
  - Agora todos os stadiums, independente do tamanho do map e ou da situação de jogo, são objetos desta única classe;
  - Isso tornou bem flexíveis as dimensões dos maps, podendo ser alteradas com facilidade;
  - E agora também ficou bastante facilitado o desenvolvimento do penal (cobrança que acontece após o **impedimento**).
- Aumentado o map small em 20% (exceto o field goal).

### v0.8c:

- Alterado o kick rate limit para 10/60/3;
- Corrigido o erro do `!k` e `!gk` quando seleciona um jogador com `#`;
- Correções e melhorias em diversas mensagens do bot;
- _Loading..._

### v0.8b:

- Adicionado um kick rate limit de 10/10/15 (ainda será reajustado no futuro);
- Tentativa de correção do novo erro do Try;
- Adicionado o comando `!bb`;
- O jogador agora é imediatamente parado após usar o comando de reposicionar bola;
- Mensagens `b`, `B` e `!B` agora também acionam o comando de reposicionar bola;
- Adicionado comando de cancelar partida (`!cancel`);
- Adicionado comando para evitar ser o único admin da sala (`!only-admin`).

### v0.8a:

- Adicionado o comando `!clearban`;
- Adicionadas as opções `x2`, `x3` e `x4` ao comando `!rr` (Exemplo: `!rr x3`);
- Adicionadas mensagens periódicas de ajuda para começar nova partida (`!rr`).

### v0.8:

- Implementada a conversão de 2 pontos;
- Adicionados os comandos de suporte à conversão `!k`, `!gk` e `!b`;
- Diminuído o tamanho da bola em 15% (o raio agora tem o valor de 8.5);
- Alerta de Desvio/Recuo agora é em cor amarela.

### v0.7:

- Corrigido o erro do Try que não era Try;
- Corrigido alerta "Safety permitido." sendo disparado na ocasião de um Try na linha de gol;
- Corrigido o erro do Safety (ao invés de Try) sendo dado quando a bola entra no in-goal sendo conduzida simultaneamente pelo ataque e pela defesa;
- Criado comando para alterar o placar (`!set-score`);
- Aprimorados comandos existentes;
- Retirado o player do host;
- O anúncio de links dos 5s de partida agora é enviado apenas para os espectadores;
- Aprimorada a lógica de gol (nenhuma alteração na jogabilidade).

### v0.6a:

- Aprimoradas as lógicas do Try e do Safety;
- Melhoradas as descrições do Try e do Safety (do comando `!help`);
- Corrigido mensagem "A bola saiu do ingoal." aparecendo após o reinício de jogo;
- Anúncio de placar agora também é exibido após o kickoff de reinício;
- Corrigido jogo reiniciando, ao invés de finalizando, após Safety no overtime;
- Aprimorados comandos existentes;
- Criado comando para cada regra ou link (`!dc`, `!fb`, `!try`, `!fg` e `!sf`).

### v0.6:

- Implementado o desvio/recuo de bola;
- Implementado o Safety (SF).

### v0.5:

- Adicionados os comandos `!help`, `!rules`, `!score`, `!links`, `!admin` e `!password`;
- Adicionado suporte à internacionalização;
- Melhorias e correções de erros.

### v0.4:

- Implementado tamanho Normal de mapa;
- Correções de erros.

### v0.3:

- Implementada condução de bola;
- Implementado o Try (TRY).

### v0.2:

- Implementado o Field Goal (FG).

### v0.1:

- Implementado o ciclo básico de partida;
- Implementado o Overtime (OT);
- Adicionado o comando de nova partida (`!new`).
