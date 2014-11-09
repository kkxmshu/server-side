var Game = function(player, playersMax) {
	this.playersMax = playersMax;
	this.players = [player];
	this.started = false;
	this.moveTime = 5; // Время на ход
	this.moveStart = 0; // Timeshtamp начала старта хода
	this.moveCurrent = 0; // ID текущего хода
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
	if(this.playersMax == this.players.length) {
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

	callback(this.players, this.moveTime, this.moveStart, this.moveCurrent);

	var game = this;
	var gameMoves = setInterval(function() {
		callback(game.players, game.moveTime, game.moveStart, game.moveCurrent)
	}, this.moveTime*1000);
};

Game.prototype.newRound = function(callback) {

}

Game.prototype.makeMove = function(userID, data, callback) {
	var isCorrectMove = true;
	if((Math.round(new Date().getTime() / 1000) - this.moveTime > this.moveStart) || data['moveCurrent'] !== this.moveCurrent ) {
		isCorrectMove = false;
	}
	callback(this.players, isCorrectMove);
};

module.exports = Game;