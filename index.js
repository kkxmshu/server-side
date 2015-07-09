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

		for(var i = 0; i<MazeGame.users.length; i++) {
			io.sockets.connected[MazeGame.users[i]].emit('listOfGames', MazeGame.getListOfGames(MazeGame.users[i]));
		};
	}

	setInterval(updateGamesInfo, 1000);

	socket.on('createGame', function (data) {
		var game = new Game(userid, data['players'], data['roomSize']);
		if(MazeGame.createGame(game, userid)) {
		};
	});

	socket.on('connectToGame', function(data) {
		var roomID = data['roomId'];
		MazeGame.signToGame(userid, roomID);

		var game = MazeGame.games[roomID];

		if(data['action'] == 'forceStart') {
			game.playersMax = game.players.length;
		}

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
			if(game.started) {
				io.sockets.connected[userid].emit('errorText', {
					id: 1,
					text: "Игра в комнате уже началась"
				});
			}
			
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

		game['game'].makeMove(userid, moveInfo, function(players, isCorrectMove, cells, isEnd) {
			if(!isCorrectMove) {
				moveInfo['isCorrect'] = false;
				MazeGame.exitFromGame(userid);
				io.sockets.connected[userid].emit('errorText', {
					id: 0,
					text: "Время, отведённое на ход вышло"
				});
			} else {
				moveInfo['cells'] = JSON.stringify(cells);
				if(isEnd) {
					console.log("game end");
					moveInfo['isWinner'] = true;
					moveInfo['winnerID'] = userid;
				}
				if(players.length == 1) {
					isEnd = true;
					moveInfo['isWinner'] = true;
					moveInfo['userId'] = userid;
					io.sockets.connected[players[0]].emit('someUserDoMove', moveInfo);
				} else {
					if(!moveInfo['isWinner'] && !isEnd) {
						moveInfo['userId'] = userid;
						io.sockets.connected[userid].emit('someUserDoMove', moveInfo);
					} else {
						for(var i = 0; i < players.length; i++) {
							moveInfo['userId'] = players[i];
							io.sockets.connected[players[i]].emit('someUserDoMove', moveInfo);
						}
						for(var i = 0; i < players.length; i++) {
							if(isEnd) {
								MazeGame.exitFromGame(players[i]);
							};
						}
					}
				}
			}
			
			
		});
	});

	socket.on('disconnect', function(){
		MazeGame.onDisconnect(userid);
	});
});

server.listen(8080, function(){
  console.log('Server running on  *:3000');
});