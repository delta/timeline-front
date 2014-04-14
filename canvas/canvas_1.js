

var canvas;
var context;
var screenWidth;
var screenHeight;
var doublePI = Math.PI * 2;
var gui;
var stepA = 0;
var stepB = 0;

//----


canvas = document.createElement("canvas");
canvas.id = "canvas";


document.body.appendChild(canvas);



var sun;
var planets = [];
var planetsAmount = 500;

window.onload = function()
{
	canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');

    window.onresize = function()
	{
		screenWidth = window.innerWidth;
		screenHeight = window.innerHeight;

		canvas.width = screenWidth;
		canvas.height = screenHeight;

		context.fillStyle = '#FFF';
		context.fillRect(0, 0, screenWidth, screenHeight);
	};



	window.onresize();

	init();

    loop();
};

function init()
{
	sun = new Sun();

	generatePlanets();
}

function generatePlanets()
{
	var i = 0;
	var length = planetsAmount;

	for(i; i < length; ++i)
	{
		var factor = i / length;
		var planet = new Planet(Math.random() * 2);
		var dist = Math.random() * 200 + 300;

		planet.position.x = Math.cos(factor * (Math.PI * 2)) * dist + screenWidth >> 1;
		planet.position.y = Math.sin(factor * (Math.PI * 2)) * dist + screenHeight >> 1;
		planet.direction.setAngle(factor * (Math.PI * 2));

		planets.push(planet);
	}
}

function guiSetup()
{
	var controls =
	{
	};

	gui = new dat.GUI();

	/*
	gui.addColor(controls, 'waveColor').onChange(function(value){waveColor = value;});
	gui.addColor(controls, 'backgroundColor').onChange(function(value){backgroundColor = value;});
	gui.add(controls, 'amplitudeA', 0, 100).onChange(function(value){amplitudeA = value;});
	gui.add(controls, 'frequencyA', 0, 80).onChange(function(value){frequencyA = value;});
	gui.add(controls, 'amplitud+eB', 0, 100).onChange(function(value){amplitudeB = value;});
	gui.add(controls, 'frequencyB', 0, 80).onChange(function(value){frequencyB = value;});
	gui.add(controls, 'speedA', 0.0, 0.4).onChange(function(value){speedA = value;});
	gui.add(controls, 'speedB', 0.0, 0.4).onChange(function(value){speedB = value;});
	gui.add(controls, 'waveQuality', 24, 512).onChange(function(value){waveQuality = value;});
	*/
}

window.getAnimationFrame =
window.requestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame ||
window.oRequestAnimationFrame ||
window.msRequestAnimationFrame ||
function(callback)
{
	window.setTimeout(callback, 16.6);
};

function loop()
{
	context.globalAlpha = 0.26;
	context.fillStyle = '#FFF';
	context.fillRect(0, 0, screenWidth, screenHeight);
	context.globalAlpha = 1;

	updatePlanets();
	updateSun();

	//drawSun();
	drawPlanets();

	stepA += 0.02;
	stepB += 0.04;

	getAnimationFrame(loop);
}

function updateSun()
{
	sun.position.x = Math.cos(stepA) * sun.distance + screenWidth >> 1;
	sun.position.y = Math.sin(stepA) * sun.distance + screenHeight >> 1;
	sun.update();
}

function drawSun()
{
	context.fillStyle = '#FFF';
	context.beginPath();
	context.arc(sun.position.x, sun.position.y, sun.radius, 0, doublePI);
	context.fill();
	context.stroke();
	context.closePath();
}

function updatePlanets()
{
	var i = planets.length - 1;

	for(i; i > -1; --i)
	{
		var planet = planets[i];
		planet.update();
	}
}

function drawPlanets()
{
	var i = planets.length - 1;

	for(i; i > -1; --i)
	{
		var planet = planets[i];


		context.fillStyle = planet.color;
		context.beginPath();
		context.arc(planet.position.x, planet.position.y, planet.radius, 0, doublePI);
		context.fill();
		context.closePath();

		/*context.beginPath();
		context.moveTo(planet.position.x, planet.position.y);
		context.lineTo(planet.position.x + Math.cos(planet.direction.getAngle()) * planet.radius, planet.position.y + Math.sin(planet.direction.getAngle()) * planet.radius);
		context.strokeStyle = '#F00';
		context.stroke();
		context.closePath();*/

	}
}

function dotProduct(v1, v2)
{
	return v1.getDx() * v2.getDx() + v1.getDy() * v2.getDy();
}

function unitRandom()
{
	return 1 - Math.random() * 2;
}

function drawVector(vector, color, normals)
{
	var color = color || '#FFF'
	var normals = normals || false;

	context.beginPath();
	context.strokeStyle = color;
	context.lineWidth = 2;
	context.moveTo(screenWidth >> 1, screenHeight >> 1);
	context.lineTo((screenWidth >> 1) + Math.cos(vector.getAngle()) * vector.getLength(), (screenHeight >> 1) + Math.sin(vector.getAngle()) * vector.getLength());
	context.stroke();
	context.closePath();

	if(normals)
	{
		var normalLength = 10;

		context.beginPath();
		context.strokeStyle = '#F00';
		context.lineWidth = 2;

		var leftNormal = vector.getLeftNormal();

		context.moveTo(screenWidth >> 1, screenHeight >> 1);
		context.lineTo((screenWidth >> 1) + Math.cos(leftNormal.getAngle()) * normalLength, (screenHeight >> 1) + Math.sin(leftNormal.getAngle()) * normalLength);

		context.stroke();
		context.closePath();

		//----

		context.beginPath();
		context.strokeStyle = '#0F0';
		context.lineWidth = 2;

		var rightNormal = vector.getRightNormal();

		context.moveTo(screenWidth >> 1, screenHeight >> 1);
		context.lineTo((screenWidth >> 1) + Math.cos(rightNormal.getAngle()) * normalLength, (screenHeight >> 1) + Math.sin(rightNormal.getAngle()) * normalLength);

		context.stroke();
		context.closePath();
	}
}

function Vector2(x, y)
{
	this.x = x || 1;
	this.y = y || 0;
}

Vector2.prototype =
{
	constructor:Vector2,

	getAngle :function()
	{
		return Math.atan2(this.y, this.x);
	},

	setAngle:function(value)
	{
		var length = this.getLength();

		this.x = Math.cos(value) * length;
		this.y = Math.sin(value) * length;
	},

	getLength:function()
	{
		return Math.sqrt(this.x * this.x + this.y * this.y);
	},

	setLength:function(value)
	{
		var angle = this.getAngle();

		this.x = Math.cos(angle) * value;
		this.y = Math.sin(angle) * value;
	},

	getDx:function()
	{
		return this.x / this.getLength();
	},

	getDy:function()
	{
		return this.y / this.getLength();
	},

	getLeftNormal:function()
	{
		return new Vector2(this.y, -this.x);
	},

	getRightNormal:function()
	{
		return new Vector2(-this.y, this.x);
	},
};

function Sun()
{
	this.position = new Vector2();
	this.direction = new Vector2();
	this.radius = 40;
	this.color = '#fe5a64';
	this.distance = 700;
}

Sun.prototype =
{
	constructor:Sun,

	update:function()
	{
		var vx = this.position.x - (screenWidth >> 1);
		var vy = this.position.y - (screenHeight >> 1);

		this.direction.setAngle(Math.atan2(vy, vx));
	}
};

function Planet(radius)
{
	this.planetToSunVector = new Vector2();
	this.position = new Vector2();
	this.direction = new Vector2();
	this.radius = radius || 6;
	this.fixedRadius = radius || 6;
	this.color = 'rgb(255, 255, 255)';
	this.color = 'rgb(0, 100, 255)';
	this.distance = 200;
	this.randomAngle = Math.random() * doublePI;
}

Planet.prototype =
{
	constructor:Planet,

	update:function()
	{
		var vx = this.position.x - sun.position.x;
		var vy = this.position.y - sun.position.y;
		var vec = new Vector2();
		vec.setAngle(Math.atan2(vy, vx));

		var dp = dotProduct(this.direction, vec);

		if(dp < 0)
		{
			/*context.globalAlpha = 0.1;
			context.beginPath();
			context.strokeStyle = '#fe5a64';
			context.lineWidth = 1;

			context.moveTo(0, (screenHeight >> 1) + Math.sin(stepA) * 400);
			context.lineTo(this.position.x, this.position.y);

			context.stroke();
			context.closePath();
			context.globalAlpha = 1;*/

			this.radius = map(dp, 0, -1, 1, 20) * this.fixedRadius;

		}
		else
		{
			this.radius = this.fixedRadius;
		}

		//console.log(dp);

		var red = map(dp, -1, 1, 255, 20);
		var green = map(dp, -1, 1, Math.cos(stepB) * 120, 20);

		this.color = 'rgb(' + (red >> 0) + ', ' + (green >> 0) + ', 100)';
		this.position.x += Math.cos(stepA + this.randomAngle);
		this.position.y += Math.sin((stepB + this.randomAngle));
	}
};

function norm(value, min, max)
{
	return (value - min) / (max - min);
};

function lerp(norm, min, max)
{
	return (max - min) * norm + min;
};

function map(value, smin, smax, omin, omax)
{
	return lerp(norm(value, smin, smax), omin, omax);
}
