// Line width
var line = 10;
var offset = line / 2;

// Wall color
var lineColor = "black";

// Width of canvas
var w = 0;
// Height of canvas
var h = 0;

// Cell height
var cell_h = 0;
// Cell width
var cell_w = 0;

/**
 * Calculates cells width and height
 */
function initGame() {
	w = canvas.width;
	h = canvas.height;

	cell_h = (h-line*3) / 3;
	cell_w = (w-line*3) / 3;
}

/**
 * Redraw canvas
 * 
 * @param argument for changing values
 */
function renderScene(delta) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillRect((w / 2)-32, (h / 2)-32, 64, 64);
	maze.draw();

}
/**
 * Method for loading sprite
 * 
 * @param path to sprite
 * @returns object with loaded sprite 
 */
function loadSprite(imagePath) {
	var image = new Image();
	image.src = imagePath;
	return image;
}

/**
 * Draw sprite
 *
 * @param image, which need to draw
 * @param x-coordinate
 * @param y-coordinate
 * @param x-coordinate of sprite (1st point)
 * @param y-coordinate of sprite (1st point)
 * @param height/width for cutting the sprite from 1st point
 * @param rotation value in radians
 * @param scale value
 */
function drawSprite(imageObject, x, y, sx, sy, ds, rotation, scale) {
	ctx.save();
	ctx.translate(x, y);
	ctx.rotate(rotation);
	ctx.scale(scale, scale);
	ctx.drawImage(imageObject, sx, sy, ds, ds, 0, 0, ds, ds);
	ctx.restore();
}

// Variables of move direction
var UP = 1000, DOWN = 1001, LEFT = 1010, RIGHT = 1100;

// Maze object
var maze = {
	// Cells values
	ways: {
		left: 2, right: 5, top: 1, bottom: 9
	},
	/**
	 * Refresh cells values
	 */
	init: function() {
		
	},
	/**
	 * Draw cells
	 */
	draw: function() {	
		drawCell(cell_w, 0, this.ways.top);
		drawCell(cell_w, cell_h * 2, this.ways.bottom);
		drawCell(0, cell_h, this.ways.left);
		drawCell(cell_w * 2, cell_h, this.ways.right);
	}
}

/**
 * Draw one wall
 *
 * @param source x
 * @param source y 
 * @param destination x
 * @param destination y
 * @param color of the wall
 * @param is this wall vertical? 
 */
function wall(sx, sy, dx, dy, color, isVertical) {
	// Calculate values of Bezier control points
	var c1x = sx + Math.floor((Math.random() * 10) - 0), 
		c1y = sy + Math.floor((Math.random() * 10) - 0),
		c2x = dx - Math.floor((Math.random() * 200) - 0),
		c2y = dy + Math.floor((Math.random() * 10) - 0);
	if(isVertical) {
		c1x = sx + Math.floor((Math.random() * 5) - 2); 
		c1y = sy + Math.floor((Math.random() * 100) - 0);
		c2x = dx - Math.floor((Math.random() * 5) - 5);
		c2y = dy + Math.floor((Math.random() * 25) - 0);
	} 
	
	ctx.save();
	ctx.beginPath();
	ctx.strokeStyle = color;
	ctx.lineWidth = line;
	ctx.lineCap = "round";

	ctx.moveTo(sx + offset, sy + offset);
	ctx.bezierCurveTo(c1x, c1y, c2x, c2y, dx + offset, dy + offset);

	ctx.stroke();
	ctx.restore();
}

// Direction values for bitmask
var BOTTOM = 1, RIGHT = 2, TOP = 4, LEFT = 8;

/**
 * Draw walls of cell
 *
 * @param source x
 * @param source y
 * @param cell
 */
function drawCell(sx, sy, cell) {
	if((cell & BOTTOM) != 0) {
		wall(sx, sy + cell_h, sx + cell_w, sy + cell_h, lineColor, false);
	} else {
		// bottom blur
	}

	if((cell & RIGHT) != 0) {
		wall(sx + cell_w, sy, sx + cell_w, sy + cell_h, lineColor, true);
	} else {
		// right blur
	}

	if((cell & TOP) != 0) {
		wall(sx, sy, sx + cell_w, sy, lineColor, false);
	} else {
		// top blur
	}

	if((cell & LEFT) != 0) {
		wall(sx, sy, sx, sy + cell_h, lineColor, true);
	} else {
		// left blur
	}
}

// Player object
var player = {
	direction: DOWN,
	scale: 10,
	update: function() {},
	draw: function() {},

	/**
	 * One step in the direction of
	 *
	 * @param move direction 
	 */
	goto: function(direction) {
		switch(direction) {
			case UP:
				if(ways.top != 0) {
					toServer(direction);
				}
				break;
			case DOWN:
				if(ways.bottom != 0) {
					toServer(direction);
				}
				break;
			case RIGHT:
				if(ways.right != 0) {
					toServer(direction);
				}
				break;
			case LEFT:
				if(ways.left != 0) {
					toServer(direction);
				}
				break;
		}
	}
}

/**
 * Send move direction to the server
 *
 * @param direction
 */
function toServer(direction) {

}

