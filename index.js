var can, ctx;
var pDiv;

/* Cart coord */
var points = [];
/* Cart coord */
var line = {a: 1, b: 0};

var aRate = 0.000001;
var bRate = 0.05;

/* --------------------------------------------- */
/* Algo */

function cartCoord(p){
	return {x: p.x, y:can.height-p.y};
}

function screenCoord(p){
	return {x: p.x, y:can.height-p.y};
}

function point(x, y){
	return {x: x, y: y};
}

function applyGradient(){
	/* Compute gradient */
	gradientA = 0;
	gradientB = 0;
	for(var i=0; i<points.length; i++){
		x = points[i].x;
		y = points[i].y;
		N = points.length;
		gradientA += -(2/N) * x * (y - ((line.a * x) + line.b));
		gradientB += -(2/N) * (y - ((line.a * x) + line.b));
	}

	/* Apply gradient */
	line.a -= gradientA*aRate;
	line.b -= gradientB*bRate;
}

/* --------------------------------------------- */
/* Drawing toolbox */

/* Tools for main can */
var canTools = {
	resize: function(w, h){
		can.setAttribute("width", w);
		can.setAttribute("height", h);
	},
	clear: function(col){
		/* Backup old fillStyle and apply the new one */
		var fillStyleBCKP = ctx.fillStyle;
		ctx.fillStyle = col;
		/* Clear and draw the background */
		ctx.clearRect(0, 0, can.width, can.height);
		ctx.fillRect(0, 0, can.width, can.height);
		/* Restore old fillStyle */
		ctx.fillStyle = fillStyleBCKP;
	},
	fillDot: function(x, y, r, col){
		/* Backup old fillStyle and apply the new one */
		var fillStyleBCKP = ctx.fillStyle;
		ctx.fillStyle = col;
		/* Draw circle */
		ctx.beginPath();
		ctx.arc(x, can.height-y, r, 0, 2*Math.PI, false);
		ctx.fill();
		/* Restore old fillStyle */
		ctx.fillStyle = fillStyleBCKP;
	},
	line: function(xa, ya, xb, yb, col){
		/* Backup old strokeStyle and apply the new one */
		var strokeStyleBCKP = ctx.fillStyle;
		ctx.strokeStyle = col;
		/* Draw line */
		ctx.beginPath();
		ctx.moveTo(xa, can.height-ya);
		ctx.lineTo(xb, can.height-yb);
		ctx.stroke();
		/* Restore old strokeStyle */
		ctx.strokeStyle = strokeStyleBCKP;
	}
};

/* --------------------------------------------- */
/* Main events */

window.onload = function(){
	/* JS Loaded */
	console.log("index.js loaded");

	/* Set up main canvas */
	can = document.querySelector("#mainCan");
	ctx = can.getContext("2d");
	/* Set a fixed size */
	canTools.resize(window.innerWidth, window.innerHeight);
	canTools.clear("#000");

	/* Set up on click event */
	can.onclick = function(e){
		points.push(cartCoord(point(e.x, e.y)));
	}

	/* Init pDiv */
	pDiv = document.querySelector("#plotty");
};

/* --------------------------------------------- */
/* Main loop */

function update(){
	/* Computation time */
	if(points.length != 0){
		applyGradient();
	}
	/* Clear canvas */
	canTools.clear();
	/* Draw line */
	canTools.line(0, line.b, can.width, can.width*line.a+line.b, "#AAA");
	/* Draw white dots */
	for(var i=0; i<points.length; i++){
		canTools.fillDot(points[i].x, points[i].y, 5,"#FFF");
	}
}

setInterval(update, 1000/60);