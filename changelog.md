## CHANGELOG

### v0.10a:

- Tempo mínimo de condução revertido para 0.167s;
- Implementado o **Chute Aéreo**;
  - Use os comandos `a`, `z`, `c`, `d`, `l` ou `p` para ativar ou desativar o Chute Aéreo;
- Para marcar um Drop Goal é necessário usar o Chute Aéreo.

### v0.10:

- O Field Goal agora se chama **Drop Goal**;
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
