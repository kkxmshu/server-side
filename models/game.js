var Game = function(player, playersMax) {
	this.playersMax = playersMax;
	this.players = [player];
	this.started = false;
	this.moveTime = 10; // Время на ход
	this.moveStart = 0; // Timeshtamp начала старта хода
	this.moveCurrent = 0; // ID текущего хода
	this.moveHistory = [];
}

Game.prototype.getCurrentPlayers = function() {
	return this.players.length;
};

Game.prototype.isPlayerInGame = function(userID) {
	return this.players.indexOf(userID);
};

Game.prototype.addPlayer = function(userID) {
	if(this.isPlayerInGame(userID) == -1) {
		this.players.push(userID);
	} else {
		return false;
	}
	return true;
};

Game.prototype.removeUser = function(userID) {
	if(this.isPlayerInGame(userID) !== -1) {
		this.players.splice(this.players.indexOf(userID), 1);
	} else {
		return false;
	};
	return true;
};

Game.prototype.isCanStart = function() {
	if(this.playersMax == this.players.length && this.started === false) {
		return true;
	} else {
		return false;
	}
};

Game.prototype.start = function(callback) {
	if(this.isCanStart()) {
		this.started = true;
		this.moveStart = Math.round(new Date().getTime() / 1000);
	}

	var game = this;
	game.newRound(callback);
	var gameMoves = setInterval(function() {
		game.newRound(callback);
	}, this.moveTime*1000);
};

Game.prototype.newRound = function(callback) {
	if(this.getCurrentPlayers() > 1) {
		console.log("New round");
		this.moveCurrent++;
		this.moveStart = Math.round(new Date().getTime() / 1000);
		callback(this.players, this.moveTime, this.moveStart, this.moveCurrent);
	};
};

Game.prototype.isUserInGame = function(userID, roundID){
	if(this.findUserMove(userID, roundID)) {
		return true;
	} else {
		return false;
	}
}

Game.prototype.findUserMove = function(userID, roundID) {
	return this.moveHistory.filter(function(obj) {
		if(obj.userID == userID && obj.roundID == roundID) {
			return obj
		}
	})[0]
}

Game.prototype.findUserMoveCount = function(userID) {
	return this.moveHistory.filter(function(obj) {
		if(obj.userID == userID) {
			return obj
		}
	}).length;
}

Game.prototype.saveToHistory = function(userID, moves, moveCurrent) {
	this.moveHistory.push({
		userID: userID,
		roundID: moveCurrent,
		coords: {
			x: moves['moveInfo']['x'],
			y: moves['moveInfo']['y']
		}
	})
}

Game.prototype.makeMove = function(userID, data, callback) {
	var isCorrectMove = true;
	console.log(data['moveCurrent'] + " " + this.moveCurrent);
	if((Math.round(new Date().getTime() / 1000) - this.moveTime > this.moveStart) || parseInt(data['moveCurrent']) !== this.moveCurrent ) {
		isCorrectMove = false;
	};
	if(this.findUserMoveCount(userID)+1 != this.moveCurrent ) {
		isCorrectMove = false;
	}
	if(isCorrectMove) {
		this.saveToHistory(userID, data, this.moveCurrent);
	}
	callback(this.players, isCorrectMove);
};

module.exports = Game;