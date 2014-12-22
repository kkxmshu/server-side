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
		io.sockets.emit('listOfGames', MazeGame.getListOfGames());
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

		var game = MazeGame.games[roomID];

		if(game.isCanStart()) {
			game.start(function(players, moveTime, moveStart, moveCurrent) {
				for(var i = 0; i < players.length; i++) {
					var data = {
						roomId: roomID,
						moveTime: moveTime,
						moveStart: moveStart,
						moveCurrent: moveCurrent
					};
					io.sockets.connected[players[i]].emit('startGame', data);
				}
			});
		} else {
			io.sockets.connected[userid].emit('errorText', {
				id: 1,
				text: "Игра в комнате уже началась"
			});
		};
	});

	socket.on('makeMove', function(data) {
		var game = MazeGame.findGameByUser(userid);

		var moveInfo = {
			isCorrect: true,
			moveCurrent: data['moveCurrent'],
			moveInfo: {
				userID: userid,
				x: data['x'],
				y: data['y']
			},
		};

		game['game'].makeMove(userid, moveInfo, function(players, isCorrectMove) {
			if(!isCorrectMove) {
				moveInfo['isCorrect'] = false;
				MazeGame.exitFromGame(userid);
				io.sockets.connected[userid].emit('errorText', {
					id: 0,
					text: "Время, отведённое на ход вышло"
				});
			};
			if(players.length == 1) {
				moveInfo['isWinner'] = true;
				io.sockets.connected[players[0]].emit('someUserDoMove', moveInfo);
			} else {
				for(var i = 0; i < players.length; i++) {
					moveInfo['userid'] = players[i];
					io.sockets.connected[players[i]].emit('someUserDoMove', moveInfo);
				}
			}
			
		});
	});

	socket.on('disconnect', function(){
		MazeGame.onDisconnect(userid);
	});
});

server.listen(3000, function(){
  console.log('Server running on  *:3000');
});