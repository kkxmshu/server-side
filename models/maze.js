/**
 * @module Maze
 */

var Maze = function() { }

/**
 * Generate Maze
 *
 * @param width the number of horizontal cells of maze
 * @param height the number of vertical cells of maze
 */
Maze.prototype.generate = function(width, height) {
	var sets = [];
	var setsOfCells = new Array(width);
	var cells = new Array(height);

	for (var i = 0; i < height; i++) {
		if (i == 0) {
			cells[i] = this.initLine(width);
			this.attachToSet(setsOfCells, sets);
			this.addRightBorders(cells[i], setsOfCells, sets);
			this.addBottomBorders(cells[i], setsOfCells, sets);
		} else {
			cells[i] = this.cloneLine(cells[i - 1]);
			this.removeBorders(cells[i], setsOfCells, sets);
			this.attachToSet(setsOfCells,sets);
			this.addRightBorders(cells[i], setsOfCells, sets);
			this.addBottomBorders(cells[i], setsOfCells, sets);
			if (i == height - 1) {
				this.completeLastLine(cells[i], setsOfCells, sets);				
			} 
		}	
	}

	return cells;
};

Maze.prototype.initLine = function(cellsCount) {
	var cells = new Array(cellsCount);
	for (var i = 0; i < cells.length; i++) {
		cells[i] = 0;
	}
	return cells;
}

Maze.prototype.cloneLine = function(cellsOfLine) {
	var clone = new Array(cellsOfLine.length);
	for (var i = 0; i < clone.length; i++) {
		clone[i] = cellsOfLine[i];
	}
	return clone;
}

Maze.prototype.getUniqueSetNum = function(set) {
	var i = 1;
	while(set.indexOf(i) != -1) {
		i++;
	}
	return i;
}

Maze.prototype.attachToSet = function(setsOfCells, sets) {
	for (var i = 0; i < setsOfCells.length; i++) {
		if (sets.indexOf(setsOfCells[i]) == -1) {
			setsOfCells[i] = this.getUniqueSetNum(sets);
			sets.push(setsOfCells[i]);
		}
	}
}

Maze.prototype.addRightBorders = function(cells, setsOfCells, sets) {
	for (var i = 0; i < cells.length - 1; i++) {
		if (setsOfCells[i] == setsOfCells[i + 1] || this.getRandomBool()) {
			cells[i] |= 2;
		} else {
			var setNum = setsOfCells[i];
			var setNumId = sets.indexOf(setNum);
			setsOfCells[i + 1] = setsOfCells[i];
			if (setNumId != -1 && setsOfCells.indexOf(setNum) == -1) {
				sets.splice(setNumId, 1);
			}
		}
	}
	cells[cells.length -1] |= 2;
}

Maze.prototype.addBottomBorders = function(cells, setsOfCells, sets) {
	var cellsOfSet;
	var noBottomCell;
	for (var i = 0; i < sets.length; i++) {
		cellsOfSet = [];
		for (var j = 0; j < setsOfCells.length; j++) {
			if (setsOfCells[j] == sets[i]) {
				cellsOfSet.push(j);
			}
		}
		if (cellsOfSet.length > 1) {
			noBottomCell = this.getRandomInt(cellsOfSet.length);
			cellsOfSet.splice(noBottomCell, 1);
			for (var j = 0; j < cellsOfSet.length; j++) {
				if (this.getRandomBool()) {
					cells[cellsOfSet[j]] |= 1;
				}
			}
		}
	}
}

Maze.prototype.removeBorders = function(cells, setsOfCells, sets) {
	var setNum;
	var setNumId;
	for (var i = 0; i < cells.length; i++) {
		cells[i] &= ~2;
		if ((cells[i] & 1) != 0) {
			setNum = setsOfCells[i];
			setNumId = sets.indexOf(setNum);
			setsOfCells[i] = 0;
			if (setNumId != -1 && setsOfCells.indexOf(setNum) == -1) {
				sets.splice(setNumId, 1);
			}
			cells[i] &= ~1;
		}
	}
}

Maze.prototype.completeLastLine = function(cells, setsOfCells, sets) {
	for (var i = 0; i < cells.length - 1; i++) {
		cells[i] |= 1;
		if (setsOfCells[i] != setsOfCells[i + 1]) {
			cells[i] &= ~2;
			setsOfCells[i + 1] = setsOfCells[i];
		}
	}
	cells[cells.length - 1] |= 1;
}

Maze.prototype.getRandomBool = function() {
	return Math.random()<.5;
}

Maze.prototype.getRandomInt = function(max) {
  return Math.floor(Math.random() * max);
}

module.exports = Maze;