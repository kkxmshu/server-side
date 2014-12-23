var Maze = require('./maze');

var Game = function(player, playersMax) {
	// Maximum of playes
	this.playersMax = playersMax;

	// Objects IDs of players
	this.players = [player];

	// Is started game
	this.started = false;

	// Time (in sec) for one round
	this.moveTime = 3;

	// Timeshtamp of start current round
	this.moveStart = 0;

	// Current round ID
	this.moveCurrent = 0;

	// Objects with history of all moves
	this.moveHistory = [];

	this.maze = new Maze();
	this.maze.generate(20, 20);
}

/**
 * Count of all users
 *
 * @param user ID
 * @returns count of all users in game
 */
Game.prototype.getCurrentPlayers = function() {
	return this.players.length;
};

/**
 * Checking if user in game
 *
 * @param user ID
 * @returns boolean, is user in game
 */
Game.prototype.isPlayerInGame = function(userID) {
	return this.players.indexOf(userID);
};

/**
 * Adding user to game
 *
 * @param user ID
 * @returns true if successful
 */
Game.prototype.addPlayer = function(userID) {
	if(this.isPlayerInGame(userID) == -1) {
		this.players.push(userID);
	} else {
		return false;
	}
	return true;
};

/**
 * Remove user from game
 *
 * @param user ID
 * @returns true if successful
 */
Game.prototype.removeUser = function(userID) {
	if(this.isPlayerInGame(userID) !== -1) {
		this.players.splice(this.players.indexOf(userID), 1);
	} else {
		return false;
	};
	return true;
};

/**
 * Checking, room is full
 *
 * @returns true if can start game
 */
Game.prototype.isCanStart = function() {
	if(this.playersMax == this.players.length && this.started === false) {
		return true;
	} else {
		return false;
	}
};

/**
 * Starting game
 *
 * @param callback
 */
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

/**
 * New round
 *
 * @param callback(players, moveTime, moveStart, moveCurrent)
 */
Game.prototype.newRound = function(callback) {
	// if(this.getCurrentPlayers() >= 1) {
		console.log("New round");
		this.moveCurrent++;
		this.moveStart = Math.round(new Date().getTime() / 1000);
		callback(this.players, this.moveTime, this.moveStart, this.moveCurrent);
	// };
};

/**
 * Is user in game
 *
 * @param user ID
 * @param round ID
 * @returns true if in game
 */
Game.prototype.isUserInGame = function(userID, roundID){
	if(this.findUserMove(userID, roundID)) {
		return true;
	} else {
		return false;
	}
}

/**
 * Search moves in history by round
 *
 * @param user ID
 * @param round ID
 * @returns true if in game
 */
Game.prototype.findUserMove = function(userID, roundID) {
	return this.moveHistory.filter(function(obj) {
		if(obj.userID == userID && obj.roundID == roundID) {
			return obj
		}
	})[0]
}

/**
 * Count of all user moves
 *
 * @param user ID
 * @returns counter of all moves
 */
Game.prototype.findUserMoveCount = function(userID) {
	return this.moveHistory.filter(function(obj) {
		if(obj.userID == userID) {
			return obj
		}
	}).length;
}

/**
 * Appeng to moveHistory user move
 *
 * @param user ID
 * @param count of moves
 * @param current move
 */
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

/**
 * Checking if valid move, then save to history info about move
 *
 * @param user ID
 * @param data with move info
 * @param callback
 */
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
	// console.log(this.maze.getNeighbourCells(data.moveInfo.y, data.moveInfo.x));
	callback(this.players, isCorrectMove, this.maze.getNeighbourCells(data.moveInfo.y, data.moveInfo.x));
};

module.exports = Game;