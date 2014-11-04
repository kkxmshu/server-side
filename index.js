var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var MazeGame = require('./models/mazegame');
var GameItem = require('./models/gameitem');

app.use(express.static('public'));

var countGames = onlineGames = 0, Game = new MazeGame();

io.on('connection', function (socket) {
	var userId = socket.id.toString();

	Game.users.push(userId);
	Game.availableUsers.push(userId);

	setInterval(function() {
		io.sockets.emit('stats', [
			'Всего игр: ' + countGames,
			'Сейчас игр: ' + onlineGames,
			'Свободно игроков:' + Game.availableUsers.length,
			'Сейчас игроков: ' + Game.users.length
		]);
		io.sockets.emit('listOfGames', Game.getListOfGames(userId));
    }, 1000);

    socket.on('createGame', function (data) {
    	var game = new GameItem(socket.id.toString(), data['players']);
    	if(Game.addGame(game, userId)) {
    		Game.availableUsers.pop(userId);
    		onlineGames++;
    	}
	});

	socket.on('connectToGame', function(data) {
		var roomId = data['roomId'];
		if(Game.games[roomId].addPlayer(userId)) {
			Game.availableUsers.pop(userId);
			if(Game.games[roomId].canStart()) {
				for(var i = 0; i < Game.games[roomId].players.length; i++) {
					if(Game.games[roomId].currentMove == i) {
						io.sockets.connected[Game.games[roomId].players[i]].emit('startGame', {canMove: true, movePlayer: Game.games[roomId].currentMove, userId: i, roomId: roomId});
					} else {
						io.sockets.connected[Game.games[roomId].players[i]].emit('startGame', {canMove: false, movePlayer: Game.games[roomId].currentMove, userId: i, roomId: roomId});
					}
				}
			};
		};
	})

	socket.on('makeMove', function(data) {
		var roomId = parseInt(data['roomId']);
		var x = data['x'];
		var y = data['y'];
		var opponentId = Game.games[roomId].currentMove;

		console.log(data);

		if(Game.games[roomId].currentMove + 1 == Game.games[roomId].players.length) {
			Game.games[roomId].currentMove = 0;
		} else {
			Game.games[roomId].currentMove++;
		}

		for(var i = 0; i < Game.games[roomId].players.length; i++) {
			if(Game.games[roomId].currentMove == i) {
				io.sockets.connected[Game.games[roomId].players[i]].emit('makeMove', {canMove: true, movePlayer: Game.games[roomId].currentMove, userId: i, roomId: roomId, opponentMove: {id : opponentId, x: x, y: y}});
			} else {
				io.sockets.connected[Game.games[roomId].players[i]].emit('makeMove', {canMove: false, movePlayer: Game.games[roomId].currentMove, userId: i, roomId: roomId, opponentMove: {id : opponentId, x: x, y: y}});
			}
		}
	});

	socket.on('disconnect', function(){
		Game.users.pop(userId);
		Game.availableUsers.pop(userId);
	});
});

server.listen(3000, function(){
  console.log('Server running on  *:3000');
});