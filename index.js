var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var MazeGame = require('./models/mazegame');
var Game = require('./models/game');

app.use(express.static('public'));

var MazeGame = new MazeGame();

io.on('connection', function (socket) {
	var userid = socket.id.toString();

	MazeGame.users.push(userid);
	MazeGame.availableUsers.push(userid);

	function updateGamesInfo() {
    	io.sockets.emit('stats', [
			'Всего игр: ' + MazeGame.games.length,
			'Свободно игроков:' + MazeGame.availableUsers.length,
			'Сейчас игроков: ' + MazeGame.users.length
		]);
		io.sockets.emit('listOfGames', MazeGame.getListOfGames(userid));
    }

	setInterval(updateGamesInfo, 1000);

    socket.on('createGame', function (data) {
    	var game = new Game(userid, data['players']);
    	if(MazeGame.addGame(game, userid)) {
    		MazeGame.availableUsers.pop(userid);
    		MazeGame.bindUserToGame(userid, game);
    	}
	});

	socket.on('connectToGame', function(data) {
		var roomId = data['roomId'];
		if(MazeGame.games[roomId].addPlayer(userid)) {
			MazeGame.availableUsers.pop(userid);
			if(MazeGame.games[roomId].canStart()) {
				var result = {movePlayer: MazeGame.games[roomId].currentMove, roomId: roomId};

				for(var i = 0; i < MazeGame.games[roomId].players.length; i++) {
					result['userId'] = i;
					result['canMove'] = (MazeGame.games[roomId].currentMove == i)
						? true
						: false;

					io.sockets.connected[MazeGame.games[roomId].players[i]].emit('startGame', result);
				}
			};
		};
	})

	socket.on('makeMove', function(data) {
		var roomId = parseInt(data['roomId']);
		var x = data['x'];
		var y = data['y'];
		var opponentId = MazeGame.games[roomId].currentMove;

		if(MazeGame.games[roomId].currentMove + 1 == MazeGame.games[roomId].players.length) {
			MazeGame.games[roomId].currentMove = 0;
		} else {
			MazeGame.games[roomId].currentMove++;
		}

		var result = {
			canMove: false,
			movePlayer: MazeGame.games[roomId].currentMove,
			roomId: roomId,
			opponentMove: {
				id : opponentId,
				x: x,
				y: y
			}
		};

		for(var i = 0; i < MazeGame.games[roomId].players.length; i++) {
			result['canMove'] = (MazeGame.games[roomId].currentMove == i)
				? true
				: false;
			result['userId'] = i;
			
			io.sockets.connected[MazeGame.games[roomId].players[i]].emit('makeMove', result);
		}
	});

	socket.on('disconnect', function(){
		// Remove user from list of all users
		MazeGame.users.pop(userid);
		MazeGame.availableUsers.pop(userid);
		var currentGame = MazeGame.findGameByUser(userid);
		if(currentGame && MazeGame.games[currentGame['game']].players.length == 1) {
			MazeGame.games[currentGame['game']] = null;
			MazeGame.games.pop(MazeGame.games[currentGame['game']]);
		} else if(currentGame && MazeGame.games[currentGame['game']].players.length > 1) {
			MazeGame.games[currentGame['game']].players.pop(userid);
		}
	});
});

server.listen(3000, function(){
  console.log('Server running on  *:3000');
});