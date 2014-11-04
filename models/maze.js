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
			cells[i] = initLine(width);
			attachToSet(setsOfCells, sets);
			addRightBorders(cells[i], setsOfCells, sets);
			addBottomBorders(cells[i], setsOfCells, sets);
		} else {
			cells[i] = cloneLine(cells[i - 1]);
			removeBorders(cells[i], setsOfCells, sets);
			attachToSet(setsOfCells,sets);
			addRightBorders(cells[i], setsOfCells, sets);
			addBottomBorders(cells[i], setsOfCells, sets);
			if (i == height - 1) {
				completeLastLine(cells[i], setsOfCells, sets);				
			} 
		}	
	}

	return cells;
};

function initLine(cellsCount) {
	var cells = new Array(cellsCount);
	for (var i = 0; i < cells.length; i++) {
		cells[i] = 0;
	}
	return cells;
}

function cloneLine(cellsOfLine) {
	var clone = new Array(cellsOfLine.length);
	for (var i = 0; i < clone.length; i++) {
		clone[i] = cellsOfLine[i];
	}
	return clone;
}

function getUniqueSetNum(set) {
	var i = 1;
	while(set.indexOf(i) != -1) {
		i++;
	}
	return i;
}

function attachToSet(setsOfCells, sets) {
	for (var i = 0; i < setsOfCells.length; i++) {
		if (sets.indexOf(setsOfCells[i]) == -1) {
			setsOfCells[i] = getUniqueSetNum(sets);
			sets.push(setsOfCells[i]);
		}
	}
}

function addRightBorders(cells, setsOfCells, sets) {
	for (var i = 0; i < cells.length - 1; i++) {
		if (setsOfCells[i] == setsOfCells[i + 1] || getRandomBool()) {
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

function addBottomBorders(cells, setsOfCells, sets) {
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
			noBottomCell = getRandomInt(cellsOfSet.length);
			cellsOfSet.splice(noBottomCell, 1);
			for (var j = 0; j < cellsOfSet.length; j++) {
				if (getRandomBool()) {
					cells[cellsOfSet[j]] |= 1;
				}
			}
		}
	}
}

function removeBorders(cells, setsOfCells, sets) {
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

function completeLastLine(cells, setsOfCells, sets) {
	for (var i = 0; i < cells.length - 1; i++) {
		cells[i] |= 1;
		if (setsOfCells[i] != setsOfCells[i + 1]) {
			cells[i] &= ~2;
			setsOfCells[i + 1] = setsOfCells[i];
		}
	}
	cells[cells.length - 1] |= 1;
}

function getRandomBool() {
	return Math.random()<.5;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

module.exports = Maze;