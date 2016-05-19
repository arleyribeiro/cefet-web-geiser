var express = require('express');
var    app = express();
var    _ = require('underscore');
var fs = require('fs');

// carregar "banco de dados" (data/jogadores.json e data/jogosPorJogador.json)
// você pode colocar o conteúdo dos arquivos json no objeto "db" logo abaixo
// dica: 3-4 linhas de código (você deve usar o módulo de filesystem (fs))
var db = {
  jogadores: JSON.parse(fs.readFileSync('server/data/jogadores.json')).players,
  jogosPorJogador: JSON.parse(fs.readFileSync('server/data/jogosPorJogador.json'))
};


// configurar qual templating engine usar. Sugestão: hbs (handlebars)
app.set('view engine', 'hbs');


// EXERCÍCIO 2
// definir rota para página inicial --> renderizar a view index, usando os
// dados do banco de dados "data/jogadores.json" com a lista de jogadores
// dica: o handler desta função é bem simples - basta passar para o template
//       os dados do arquivo data/jogadores.json

app.set('views', 'server/views');
app.get('/', function(req, res){
    res.render('index', {
    jogadores: db.jogadores
  });
});


// EXERCÍCIO 3
// definir rota para página de detalhes de um jogador --> renderizar a view
// jogador, usando os dados do banco de dados "data/jogadores.json" e
// "data/jogosPorJogador.json", assim como alguns campos calculados
// dica: o handler desta função pode chegar a ter umas 15 linhas de código

app.get('/jogador/:id', function(req, res) {/*busca jogador por id*/
  var jogador = _.findWhere(db.jogadores, {steamid: req.params.id});
  var jogosJogador = db.jogosPorJogador[req.params.id];/*recebe os jogos dos jogadores*/
  var jogosTodosJogador = jogosJogador.games;/*jogos de todos os jogadores*/
  jogador.notPlay = jogosJogador.game_count;/*Conta quantos jogos o jogador tem*/

  jogador.naoJogados = _.where(jogosTodosJogador, { playtime_forever: 0 }).length;/*numero de jogos nao jogados*/

  jogosTodosJogador.forEach(function(jogo){
    jogo.playTime = Math.ceil(jogo.playtime_forever/60);/*numero de horas jogadas*/
  })

  var melhores = _.sortBy(jogosTodosJogador, function(jogo){
      return -jogo.playtime_forever;
  });

  jogosJogador.games=_.head(jogosJogador.games, 5);;/*5 Melhores jogadores*/

 
  res.render('jogador', {jogador});
});

// EXERCÍCIO 1
// configurar para servir os arquivos estáticos da pasta "client"
// dica: 1 linha de código
// app.use(express.static('client/'));

app.use(express.static(__dirname + '/../client/'));
console.log(__dirname + '/../client/');

//abrir o servidor
app.listen(3001);