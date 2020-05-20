// Engine - computation and math
// Renderer - draws the engine


//Flippers, plunger, drain, slingshots, target bank, chutes, jet bumpers, ramps, multiball

// alias is a shortcut to make our code cleaner
const {Engine, Render, Body, Bodies, World, Mouse, MouseConstraint, Composites, Query, Vertices, Common, Svg, Events, Constraint} = Matter

Matter.use('matter-wrap')
Matter.use('matter-attractors');

// Polygon paths
const PATHS = {
	DROP_LEFT: '0.5 286.62 0.5 3.08 66.2 200.18 0.5 286.62',
	DROP_RIGHT: '50 0 68 0 68 150 50 150 0 100 50 0',
};

// constants
const COLOR = {
	BACKGROUND: '#212529',
	OUTER: '#495057',
	INNER: '#15aabf',
	BUMPER: '#fab005',
	BUMPER_LIT: '#fff3bf',
	PADDLE: '#e64980',
	PINBALL: '#dee2e6'
};

const POS = {
	START: {
		x: 430, 
		y: 650
	}
}

const GRAVITY = 0.75;
const BUMPER_BOUNCE = 1.5;
const PADDLE_PULL = 0.002;
const MAX_VELOCITY = 30;

// score elements
let $currentScore = $('.currentScore span');
let $highScore = $('.highScore span');

// shared variables
let currentScore, highScore;
let leftPaddle, leftUpStopper, leftDownStopper, isLeftPaddleUp;
let rightPaddle, rightUpStopper, rightDownStopper, isRightPaddleUp;

// used for collision filtering on various bodies
const stopperGroup = Body.nextGroup(true);
const plugGroup = Body.nextGroup(true);

// where matter is being deployed
const sectionTag = document.querySelector('.shapes')

// page width and height
const w = 475
const h = 704

// starting values
currentScore = 0;
highScore = 0;
isLeftPaddleUp = false;
isRightPaddleUp = false;

const engine = Engine.create()
const world = engine.world;

world.gravity.y = GRAVITY; // simulate rolling on a slanted table

const renderer = Render.create({
	element: sectionTag,
	engine: engine,
	options: {
		width: w,
		height: h,
		background: '#000000',
		wireframes: false,
		pixelRatio: window.devicePixelRatio

	}
})


// Fixed ball in the middle of the screen
const pinball = Bodies.circle(POS.START.x, POS.START.y, 10, {
	label: 'pinball',
	collisionFilter: {
		group: stopperGroup
	},
	render: {
		fillStyle: 'white',
	}
})

// Drain that ball falls into, for collision
const drain = Bodies.rectangle(w/2, h-10, 130, 30, {
	isStatic: true,
	label: 'reset',
	render: {
		fillStyle: 'black',
	}
})

const plug = Bodies.rectangle(530, 300, 20, 20, {
	isStatic: true,
	label: 'plug',
	render: {
		fillStyle: 'red'
	}
})


// Add shapes to the world
World.add(engine.world, [
	pinball,
	drain,
	plug,

	// Bumpers
	bumper(140, 240),
	bumper(260, 240),

	bumper(100, 330),
	bumper(205, 330),
	bumper(300, 330),

	// Pegs
	peg(150, 150),
	peg(200, 150),
	peg(250, 150),


	// Drops
	polyPath(44, 382, PATHS.DROP_LEFT, 0.5),
	polyPath(388, 364, PATHS.DROP_RIGHT, 0.8),
])

// round bodies that repel pinball
function bumper(x, y) {
	let bumper = Bodies.circle(x, y, 25, {
		label: 'bumper',
		isStatic: true,
		render: {
			fillStyle: COLOR.BUMPER
		}
	});

	// for some reason, restitution is reset unless it's set after body creation
	bumper.restitution = BUMPER_BOUNCE;

	return bumper;
}

// Peg
function peg(x, y){
	let peg = Bodies.rectangle(x, y, 10, 30, {
		isStatic: true,
		chamfer: { 
			radius: 5 
		},
		render: {
			fillStyle: COLOR.INNER
		}
	})

	return peg
}


// invisible bodies to constrict paddles
function stopper(x, y, side, position) {
	// determine which paddle composite to interact with
	let attracteeLabel = (side === 'left') ? 'paddleLeftComp' : 'paddleRightComp';

	let stopper =  Bodies.circle(x, y, 40, {
		isStatic: true,
		render: {
			visible: false,
		},
		collisionFilter: {
			group: stopperGroup
		},
		plugin: {
			attractors: [
				// stopper is always a, other body is b
				function(a, b) {
					if (b.label === attracteeLabel) {
						let isPaddleUp = (side === 'left') ? isLeftPaddleUp : isRightPaddleUp;
						let isPullingUp = (position === 'up' && isPaddleUp);
						let isPullingDown = (position === 'down' && !isPaddleUp);
						if (isPullingUp || isPullingDown) {
							return {
								x: (a.position.x - b.position.x) * PADDLE_PULL,
								y: (a.position.y - b.position.y) * PADDLE_PULL,
							};
						}
					}
				}
			]
		}
	});

	return stopper
}

// Create shape from svg polygon path
function polyPath(x, y, path, scale) {
	let vertices = Vertices.fromPath(path);
	let scaled = []

	scaled.push(Vertices.scale(vertices, scale, scale))

	let polypath = Bodies.fromVertices(x, y, scaled, {
		isStatic: true,
		scale: 0.1,
		render: {
			fillStyle: COLOR.OUTER,

			// add stroke and line width to fill in slight gaps between fragments
			strokeStyle: COLOR.OUTER,
			lineWidth: 1
		}
	});

	return polypath
}

// Create shape from svg complex path
function path(x, y, file, scale) {
	$.get('./assets/svg/' + file + '.svg').done(function(data) {
		var vertexSets = []

		$(data).find('path').each(function(i, path) {
			var points = Svg.pathToVertices(path, 30);
			vertexSets.push(Vertices.scale(points, scale, scale));
		});

		World.add(world, Bodies.fromVertices(x, y, vertexSets, {
			isStatic: true,
			render: {
				fillStyle: COLOR.OUTER,
				strokeStyle: COLOR.OUTER,
				lineWidth: 1,

			}
		}, true));
	});
}

// custom svg shapes
path(w/2, 120, 'dome', 0.6)
path((w/2)+43, 585, 'bottom2', 0.6)
path(85, 525, 'flipper-wall-left', 0.45)
path(350, 525, 'flipper-wall-right', 0.45)



// * FUNCITONS *

// Collision events
function createEvents(){

	// Events when the ball hits stuff
	Events.on(engine, 'collisionStart', function(event){
		let pairs = event.pairs;
		pairs.forEach(function(pair) {
			if (pair.bodyA.label === 'pinball') {
				switch (pair.bodyB.label) {
					case 'reset':
						drainBall();
						break;
					case 'bumper':
						pingBumper(pair.bodyB);
						break;
				}
			}
		})
	})


	// * EVENT LISTENERS *

	// regulate pinball
	Events.on(engine, 'beforeUpdate', function(event) {
		// bumpers can quickly multiply velocity, so keep that in check
		Body.setVelocity(pinball, {
			x: Math.max(Math.min(pinball.velocity.x, MAX_VELOCITY), -MAX_VELOCITY),
			y: Math.max(Math.min(pinball.velocity.y, MAX_VELOCITY), -MAX_VELOCITY),
		});
	});

	// keyboard paddle events
	$('body').on('keydown', function(e) {
		if (e.which === 37) { // left arrow key
			isLeftPaddleUp = true;
		} else if (e.which === 39) { // right arrow key
			isRightPaddleUp = true;
		}

		if (e.which === 32) {
			launchPinball()
		}
	});
	$('body').on('keyup', function(e) {
		if (e.which === 37) { // left arrow key
			isLeftPaddleUp = false;
		} else if (e.which === 39) { // right arrow key
			isRightPaddleUp = false;
		}
	});


}

// Paddle position constants
const PADDLE = {
	LEFTX : 125,
	RIGHTX: 278,
	LEFTRIGHTY: 518,
}

function createPaddles() {
	// these bodies keep paddle swings contained, but allow the ball to pass through
	leftUpStopper = stopper(PADDLE.LEFTX + 20, PADDLE.LEFTRIGHTY, 'left', 'up');
	leftDownStopper = stopper(PADDLE.LEFTX , PADDLE.LEFTRIGHTY + 252, 'left', 'down');
	rightUpStopper = stopper(PADDLE.RIGHTX + 12, PADDLE.LEFTRIGHTY, 'right', 'up');
	rightDownStopper = stopper(310, 743, 'right', 'down');
	World.add(world, [leftUpStopper, leftDownStopper, rightUpStopper, rightDownStopper]);

	// this group lets paddle pieces overlap each other
	let paddleGroup = Body.nextGroup(true);


	// Left paddle mechanism
	let paddleLeft = {};
	paddleLeft.paddle = Bodies.trapezoid(PADDLE.LEFTX  + 30, PADDLE.LEFTRIGHTY + 69, 20, 80, 0.33, {
		label: 'paddleLeft',
		friction: 10,
		angle: 1.57,
		chamfer: {},
		render: {
			fillStyle: COLOR.PADDLE
		}
	});
	paddleLeft.brick = Bodies.rectangle(PADDLE.LEFTX + 32, PADDLE.LEFTRIGHTY + 81, 40, 80, {
		angle: 1.62,
		friction: 10,
		chamfer: {},
		render: {
			visible: false
		}
	});
	paddleLeft.comp = Body.create({
		label: 'paddleLeftComp',
		parts: [paddleLeft.paddle, paddleLeft.brick]
	});
	paddleLeft.hinge = Bodies.circle(PADDLE.LEFTX +2, PADDLE.LEFTRIGHTY + 69, 5, {
		isStatic: true,
		render: {
			visible: false
		}
	});
	Object.values(paddleLeft).forEach((piece) => {
		piece.collisionFilter.group = paddleGroup
	});
	paddleLeft.con = Constraint.create({
		bodyA: paddleLeft.comp,
		pointA: { x: -29.5, y: -8.5 },
		bodyB: paddleLeft.hinge,
		length: 0,
		stiffness: 0
	});
	World.add(world, [paddleLeft.comp, paddleLeft.hinge, paddleLeft.con]);
	Body.rotate(paddleLeft.comp, 0.57, { x: 142, y: 660 });


	// right paddle mechanism
	let paddleRight = {};
	paddleRight.paddle = Bodies.trapezoid(PADDLE.RIGHTX + 2 , PADDLE.LEFTRIGHTY + 69, 20, 80, 0.33, {
		label: 'paddleRight',
		angle: -1.57,
		friction: 10,
		chamfer: {},
		render: {
			fillStyle: COLOR.PADDLE
		}
	});
	paddleRight.brick = Bodies.rectangle(PADDLE.RIGHTX, PADDLE.LEFTRIGHTY + 81, 40, 80, {
		angle: -1.62,
		chamfer: {},
		friction: 10,
		render: {
			visible: false
		}
	});
	paddleRight.comp = Body.create({
		label: 'paddleRightComp',
		parts: [paddleRight.paddle, paddleRight.brick]
	});
	paddleRight.hinge = Bodies.circle(PADDLE.RIGHTX + 30, PADDLE.LEFTRIGHTY + 69, 5, {
		isStatic: true,
		render: {
			visible: false
		}
	});
	Object.values(paddleRight).forEach((piece) => {
		piece.collisionFilter.group = paddleGroup
	});
	paddleRight.con = Constraint.create({
		bodyA: paddleRight.comp,
		pointA: { x: 29.5, y: -8.5 },
		bodyB: paddleRight.hinge,
		length: 0,
		stiffness: 0
	});
	World.add(world, [paddleRight.comp, paddleRight.hinge, paddleRight.con]);
	Body.rotate(paddleRight.comp, -0.57, { x: 308, y: 660 });
}


// matter.js has a built in random range function, but it is deterministic
function rand(min, max) {
	return Math.random() * (max - min) + min;
}


// Plunger launches the ball out of the chamber
function launchPinball() {
	
	Body.setVelocity(pinball, { x: 0, y: -23 + rand(-2, 2) });
	Body.setAngularVelocity(pinball, 0);

	

	setTimeout(function() {
		closePlug()
	}, 1000);
}

function drainBall(){
	updateScore(0);
	Body.setPosition(pinball, { x: POS.START.x, y: POS.START.y  });
	Body.setPosition(plug, {x: 530, y: 300})
}

function pingBumper(bumper) {
	updateScore(currentScore + 10);

	// flash color
	bumper.render.fillStyle = COLOR.BUMPER_LIT;
	setTimeout(function() {
		bumper.render.fillStyle = COLOR.BUMPER;
	}, 100);
}

function updateScore(newCurrentScore) {
	currentScore = newCurrentScore;
	$currentScore.text(currentScore);

	highScore = Math.max(currentScore, highScore);
	$highScore.text(highScore);
}

function closePlug() {
	Body.setPosition(plug, {x: 430, y: 300})
}




Engine.run(engine)
Render.run(renderer)


function load() {
	createPaddles()
	createEvents()
	
}

window.addEventListener('load', load, false);







