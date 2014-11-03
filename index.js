var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var MazeGame = require('./models/mazegame');
var GameItem = require('./models/gameitem');

app.use(express.static('public'));

var countGames = onlinePlayers = onlineGames = 0, countPlayers = [], Game = new MazeGame();

io.on('connection', function (socket) {
	var userId = socket.id.toString();

	onlinePlayers++;

	setInterval(function() {
		io.sockets.emit('stats', [
			'Всего игр: ' + countGames,
			// 'Уникальных игроков: ' + Object.keys(countPlayers).length,
			'Сейчас игр: ' + onlineGames,
			'Сейчас игроков: ' + onlinePlayers
		]);
		io.sockets.emit('listOfGames', Game.getListOfGames());
    }, 1000);

    socket.on('createGame', function (data) {
    	var game = new GameItem(socket.id.toString(), data['players']);
    	if(Game.addGame(game, userId)) {
    		onlineGames++;
			console.log("OK " + onlineGames);
    	}
	});

	socket.on('disconnect', function(){
		onlinePlayers -= 1;
	});
});

server.listen(3000, function(){
  console.log('Server running on  *:3000');
});