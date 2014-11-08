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

	MazeGame.onConnect(userid);

	function updateGamesInfo() {
		io.sockets.emit('stats', [
			'Всего игр: ' + MazeGame.games.length,
			'Свободно игроков:' + MazeGame.usersAvailable.length,
			'Сейчас игроков: ' + MazeGame.users.length
		]);
		io.sockets.emit('listOfGames', MazeGame.getListOfGames(userid));
	}

	setInterval(updateGamesInfo, 1000);

	socket.on('createGame', function (data) {
		var game = new Game(userid, data['players']);
		if(MazeGame.createGame(game, userid)) {
			// ALL OK;
		};
	});

	socket.on('connectToGame', function(data) {
		var roomID = data['roomId'];
		MazeGame.signToGame(userid, roomID);
	})

	// socket.on('makeMove', function(data) {
	// 	var roomId = parseInt(data['roomId']);
	// 	var x = data['x'];
	// 	var y = data['y'];
	// 	var opponentId = MazeGame.games[roomId].currentMove;

	// 	if(MazeGame.games[roomId].currentMove + 1 == MazeGame.games[roomId].players.length) {
	// 		MazeGame.games[roomId].currentMove = 0;
	// 	} else {
	// 		MazeGame.games[roomId].currentMove++;
	// 	}

	// 	var result = {
	// 		canMove: false,
	// 		movePlayer: MazeGame.games[roomId].currentMove,
	// 		roomId: roomId,
	// 		opponentMove: {
	// 			id : opponentId,
	// 			x: x,
	// 			y: y
	// 		}
	// 	};

	// 	for(var i = 0; i < MazeGame.games[roomId].players.length; i++) {
	// 		result['canMove'] = (MazeGame.games[roomId].currentMove == i)
	// 			? true
	// 			: false;
	// 		result['userId'] = i;
			
	// 		io.sockets.connected[MazeGame.games[roomId].players[i]].emit('makeMove', result);
	// 	}
	// });

	socket.on('disconnect', function(){
		MazeGame.onDisconnect(userid);
	});
});

server.listen(3000, function(){
  console.log('Server running on  *:3000');
});