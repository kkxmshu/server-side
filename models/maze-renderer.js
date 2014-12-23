var MazeRenderer = function() { }

MazeRenderer.prototype.render = function(maze) {
	for (var i = 0; i < maze.length; i++) {
		if (i == 0) {
			process.stdout.write(" ");
			for (var j = 0; j < maze[i].length; j++) {
				process.stdout.write("__ ");
			}
			process.stdout.write("\n");
		}
		this.drawCellsLine(maze[i]);
	}
}

MazeRenderer.prototype.drawCellsLine = function(cells) {
	process.stdout.write("|");
	for (var i = 0; i < cells.length; i++) {
		this.drawCell(cells[i]);
	}
	process.stdout.write("\n");
}

MazeRenderer.prototype.drawCell = function(cell) {
	if ((cell & 1) != 0) {
		process.stdout.write("__");
	} else {
		process.stdout.write("  ");
	}
	if ((cell & 2) != 0) {
		process.stdout.write("|");
	} else {
		process.stdout.write(" ");
	}
}

module.exports = MazeRenderer;