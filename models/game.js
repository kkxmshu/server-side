var Game = function(player, playersMax) {
	this.playersMax = playersMax;
	this.players = [player];
	this.started = false;
	this.moveTime = 5000; // Время на ход
	this.moveStart = 0; // Timeshtamp начала старта хода
	this.moveCurrent = 0; // ID текущего хода
}

Game.prototype.getCurrentPlayers = function() {
	return this.players.length;
}

Game.prototype.isPlayerInGame = function(userID) {
	return this.players.indexOf(userID);
};

Game.prototype.addPlayer = function(userID) {
	console.log(this.isPlayerInGame(userID));
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
}

Game.prototype.start = function() {
	if(this.isCanStart()) {
		this.started = true;
	}
}

module.exports = Game;