var GameItem = function(creator, playersMax) {
    this.creator = creator;
    this.playersMax = playersMax;
    this.players = [creator];
    this.started = false;
    this.currentMove = 0;
}

GameItem.prototype.addPlayer = function(userId) {
	if(this.creator != userId && !this.started) {
		// TODO: check user in players
		this.players.push(userId);
	} else {
		return false;
	}
	return true;
};

GameItem.prototype.canStart = function() {
	if(this.playersMax == this.players.length) {
		this.started = true;
		return true;
	} else {
		return false;
	}
}

module.exports = GameItem;