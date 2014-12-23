/**
 * @module Maze
 */

// Bit mask of the bottom wall.
var BOTTOM = 1;
// Bit mask of the right wall.
var RIGHT = 2;
// Bit mask of the top wall.
var TOP = 4;
// Bit mask of the left wall.
var LEFT = 8;
// Bit mask of the visited cell
var VISITED = 16;

var Maze = function(){
	// Cells of the maze.
	this.maze = [];
	this.bottom = BOTTOM;
	this.right = RIGHT;
	this.top = TOP;
	this.left = LEFT;
}	

/**
 * Generate Maze by Recursive Backtracking Algorithm.
 *
 * @param width the number of horizontal cells of maze.
 * @param height the number of vertical cells of maze.
 * @returns generated maze.
 */
Maze.prototype.generate = function(width, height) {
	this.maze = new Array(height);
	
	for (var i = 0; i < this.maze.length; i++) {
		this.maze[i] = new Array(width);
		for (var j = 0; j < this.maze[i].length; j++) {
			this.maze[i][j] = 0 | BOTTOM | RIGHT;
		}
	}

	var current = {y: getRandomInt(0, height), x: getRandomInt(0, width)};
	var neighbours;
	var stack = [];

	do {
		this.setVisited(current);

		neighbours = this.getNeighbours(current);

		if (neighbours.length != 0) {
			stack.push(current);
			current = neighbours[getRandomInt(0, neighbours.length)];
			this.removeWall(current, stack[stack.length - 1]);
			this.setVisited(current);
		} else if (stack.length != 0) {
			current = stack.pop();
		} else {
			current = getUnVisited();
			this.setVisited(current);
		}
	} while (this.getUnVisited() != -1)

	return this;
};

/**
 * Remove the wall between two neighboring cells.
 *
 * @param first first cell.
 * @param second second cell.
 */
Maze.prototype.removeWall = function(first, second) {
	if (first.y == second.y) {
		this.maze[first.y][Math.min(first.x, second.x)] &= ~RIGHT;
	} else {
		this.maze[Math.min(first.y, second.y)][first.x] &= ~BOTTOM;
	}
};

/**
 * Set cell as visited.
 *
 * @param cell cell which will be set as visited.
 */
Maze.prototype.setVisited = function(cell) {
	this.maze[cell.y][cell.x] |= VISITED;
};

/**
 * Search for unvisited cell.
 *
 * @returns first unvisited cell or -1 if there is no unvisited cells.
 */
Maze.prototype.getUnVisited = function() {
	for (var i = 0; i < this.maze.length; i++) {
		for (var j = 0; j < this.maze[i].length; j++) {
			if (!this.isVisited(this.maze[i][j])) {
				return {y: i ,x: j};
			}
		};
	};
	return -1;
};

/**
 * Get unvisited neighbouring cells of the cell.
 * 
 * @param cell cell for which search unvisited neighbours.
 * @returns array of unvisited neighbouring cells.
 */
Maze.prototype.getNeighbours = function(cell) {
	var neighbours = [];

	// Left side
	if (cell.x > 0 && !this.isVisited(this.maze[cell.y][cell.x - 1])) {
		neighbours.push({y: cell.y, x: cell.x - 1});
	}

	// Right side
	if (cell.x < this.maze[0].length -1 && !this.isVisited(this.maze[cell.y][cell.x + 1])) {
		neighbours.push({y: cell.y, x: cell.x + 1});
	}

	// Up side
	if (cell.y > 0 && !this.isVisited(this.maze[cell.y - 1][cell.x])) {
		neighbours.push({y: cell.y - 1, x: cell.x});
	}


	// Down side
	if (cell.y < this.maze.length - 1 && !this.isVisited(this.maze[cell.y + 1][cell.x])) {
		neighbours.push({y: cell.y + 1, x: cell.x});
	}

	return neighbours;
};

/**
 * Check if cell is visited.
 * 
 * @param cell cell to check.
 * @returns the cell is visited or not.
 */
Maze.prototype.isVisited = function(cell) {
	return (cell & VISITED) != 0;
};

/**
 * Get random integer in range [min; max).
 * 
 * @param min minimal value.
 * @param max maximum value.
 * @returns random integer.
 */
function getRandomInt(min, max) {
	return Math.floor((Math.random() * max - min) + min);
}

/**
 * Get neighbour cells of the current cell in position (y,x) in 4 directions.
 * 
 * @param y number of row of the current cell in maze array.
 * @param x number of column of the current cell in maze array.
 * @returns neighbour cells.
 */
Maze.prototype.getNeighbourCells = function(y, x) {
	var cells = {};
	cells.left = this.getNeighbourCell(y, x, LEFT);
	cells.right = this.getNeighbourCell(y, x, RIGHT);
	cells.top = this.getNeighbourCell(y, x, TOP);
	cells.bottom = this.getNeighbourCell(y, x, BOTTOM);
	if (y == this.maze.length - 1 && x == this.maze[y].length - 1) {
		//exit from the maze
		cells.right = -1;
	}
	return cells;
}

/**
 * Get neighbour cell of the current cell in position (y,x) for specified direction.
 * 
 * @param y number of row of the current cell in maze array.
 * @param x number of column of the current cell in maze array.
 * @param dir direction of the neighbour.
 * @returns neighbour cell (walls bitmask).
 */
Maze.prototype.getNeighbourCell = function(y, x, dir) {
	var cell;

	switch (dir) {
		case LEFT:
			if (x > 0) {
				x--;
				cell = this.maze[y][x];
				if ((cell & RIGHT) == 0) {
					if ((x - 1 >= 0 && (this.maze[y][x - 1] & RIGHT) != 0) || x == 0) {
						cell |= LEFT;
					}
					if ((y - 1 >= 0 && (this.maze[y - 1][x] & BOTTOM) != 0) || y == 0) {
						cell |= TOP;
					}
				} else {
					return RIGHT;
				}
			} else {
				return RIGHT;
			}
		break;
		case RIGHT:
			if (x < this.maze[y].length - 1) {
				if ((this.maze[y][x] & RIGHT) != 0) {
					return LEFT;
				}
				x++;
				cell = this.maze[y][x];
				if ((y - 1 >= 0 && (this.maze[y - 1][x] & BOTTOM) != 0) || y == 0) {
					cell |= TOP;
				}
			} else {
				return LEFT;
			}
		break;
		case TOP:
			if (y > 0) {
				y--;
				cell = this.maze[y][x];
				if ((cell & BOTTOM) == 0) {
					if ((x - 1 >= 0 && (this.maze[y][x - 1] & RIGHT) != 0) || x == 0) {
						cell |= LEFT;
					}
					if ((y - 1 >= 0 && (this.maze[y - 1][x] & BOTTOM) != 0) || y == 0) {
						cell |= TOP;
					}
				} else {
					return BOTTOM;
				}
			} else {
				return BOTTOM
			}
		break;
		case BOTTOM:
			if (y < this.maze.length -1) {
				if ((this.maze[y][x] & BOTTOM) != 0) {
					return TOP;
				}
				y++;
				cell = this.maze[y][x];
				if ((x - 1 >= 0 && (this.maze[y][x - 1] & RIGHT) != 0) || x == 0) {
					cell |= LEFT;
				}
			} else {
				return TOP;
			}
		break;
	}

	return cell;
}

module.exports = Maze;