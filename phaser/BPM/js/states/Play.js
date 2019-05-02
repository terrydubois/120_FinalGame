// define gameplay state and methods
var Play = function(game) {};
Play.prototype = {
	init: function() {
		console.log('Play: init');

	},
	preload: function() {
		console.log('Play: preload');

	},
	create: function() {
		console.log('Play: create');
		game.add.sprite(0,0,'sky');
		game.player = game.add.sprite(game.world.width/2,game.world.height/2,'player');
		game.player.anchor.setTo(.5);

		game.switchRate = 1;
		game.playerXSpeed = 20;
		game.playerYSpeed = 12;
		game.playerPos = 0;
		game.playerCollisionRad = game.player.width / 4;

		game.posLeft = 50;
		game.posRight = game.world.width - game.posLeft;

		game.time.events.repeat(Phaser.Timer.SECOND * game.switchRate, 1, switchSides, this);
		game.time.events.repeat(Phaser.Timer.SECOND * 1, 1, spawnEnemy, this);

	},
	update: function() {

		if(game.input.keyboard.isDown(Phaser.Keyboard.W)){
			game.posLeft--;
		}
		if(game.input.keyboard.isDown(Phaser.Keyboard.S)){
			game.posLeft++;
		}
		game.posRight = game.world.width - game.posLeft;







		if(game.input.keyboard.isDown(Phaser.Keyboard.UP)){
			game.player.y -= game.playerYSpeed;
		}
		if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
			game.player.y += game.playerYSpeed;
		}

		game.player.y = Phaser.Math.clamp(game.player.y,0,game.world.height);


		if (game.playerPos == 1) {
			game.player.x = approach(game.player.x, game.posLeft, game.playerXSpeed);
		}
		else {
			game.player.x = approach(game.player.x, game.posRight, game.playerXSpeed);	
		}
	}
}

function switchSides() {
	
	if (game.playerPos == 0) {
		game.playerPos = 1;
	}
	else {
		game.playerPos = 0;
	}


	game.time.events.repeat(Phaser.Timer.SECOND * game.switchRate, 1, switchSides, this);
}

function spawnEnemy() {

	var newEnemySpeed = Math.random() * 350;
	newEnemySpeed = Phaser.Math.clamp(newEnemySpeed, 150, 350);
	game.enemy = new Avoid(game, 'skull', 'skull', 1, 0, game.playerPos, newEnemySpeed);
	game.add.existing(game.enemy);

	var timeTilNextSpawn = Math.random() * 2;
	timeTilNextSpawn = Phaser.Math.clamp(timeTilNextSpawn, 0.5, 2);
	game.time.events.repeat(Phaser.Timer.SECOND * timeTilNextSpawn, 1, spawnEnemy, this);
}

function approach(value, valueDest, speed) {

	if (value < valueDest) {
		value += speed;
	}
	else if (value > valueDest) {
		value -= speed;
	}

	if (Math.abs(value - valueDest) < speed) {
		value = valueDest;
	}

	return value;
}
