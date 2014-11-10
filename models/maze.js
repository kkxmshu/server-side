/**
 * @module Maze
 */

// Bit mask of the bottom wall.
var BOTTOM = 1;
// Bit mask of the right wall.
var RIGHT = 2;
// Bit mask of the visited cell
var VISITED = 4;

var Maze = function(){
	// Cells of the maze.
	this.maze = [];
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

	return this.maze;
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

module.exports = Maze;