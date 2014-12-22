var mySprite;
var spriteRotation = 0;
var line = 10;
var offset = line / 2;

var w = 0;
var h = 0;


var cell_h = 0;
var cell_w = 0;

function initGame() {
	mySprite = loadSprite("src/blocks.png");
	w = canvas.width;
	h = canvas.height;

	cell_h = (h-line) / 3;
	cell_w = (w-line) / 3;
}

function updateScene(delta) {
	spriteRotation += (Math.PI / 180.0) * 45 * delta;
}

function renderScene(delta) {
	var offset = line / 2;

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillRect((w / 2)-32, (h / 2)-32, 64, 64);
	maze.draw();

}

function loadSprite(imagePath) {
	var image = new Image();
	image.src = imagePath;
	return image;
}

function drawSprite(imageObject, x, y, sx, sy, ds, rotation, scale) {
	// var w = imageObject.width;
	// var h = imageObject.height;

	ctx.save();
	ctx.translate(x, y);
	ctx.rotate(rotation);
	ctx.scale(scale, scale);
	ctx.drawImage(imageObject, sx, sy, ds, ds, 0, 0, ds, ds);
	ctx.restore();
}

var UP = 1000, DOWN = 1001, LEFT = 1010, RIGHT = 1100;


var maze = {
	ways: {
		left: 2, right: 5, top: 4, bottom: 8
	},
	init: function() {
		// get ways from server 
	},
	draw: function() {	
		drawCell(cell_w, 0, this.ways.top);
		drawCell(cell_w, cell_h * 2, this.ways.bottom);
		drawCell(0, cell_h, this.ways.left);
		drawCell(cell_w * 2, cell_h, this.ways.right);
	}
}


function wall(sx, sy, dx, dy, color) {
	ctx.save();
	ctx.beginPath();
	ctx.strokeStyle = color;
	ctx.lineWidth = line;
	ctx.lineCap = "square";
	ctx.moveTo(sx + offset, sy + offset);
	ctx.lineTo(dx + offset, dy + offset);
	ctx.stroke();

	ctx.restore();
}
var BOTTOM = 1, RIGHT = 2, TOP = 4, LEFT = 8;
function drawCell(sx, sy, cell) {
	if((cell & BOTTOM) != 0) {
		wall(sx, sy + cell_h, sx + cell_w, sy + cell_h, "red");
	} else {
		// bottom blur
	}

	if((cell & RIGHT) != 0) {
		wall(sx + cell_w, sy, sx + cell_w, sy + cell_h, "red");
	} else {
		// right blur
	}

	if((cell & TOP) != 0) {
		wall(sx, sy, sx + cell_w, sy, "red");
	} else {
		// top blur
	}

	if((cell & LEFT) != 0) {
		wall(sx, sy, sx, sy + cell_h, "red");
	} else {
		// left blur
	}
}

var player = {
	direction: DOWN,
	scale: 10,
	update: function() {	},
	draw: function() {	},
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

function toServer(direction) {

}

