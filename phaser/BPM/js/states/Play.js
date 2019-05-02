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

		game.switchRate = 2;
		game.playerXSpeed = 10;
		game.playerYSpeed = 10;
		game.playerPos = 0;
		game.posLeft = 50;
		game.posRight = game.world.width - game.posLeft;

		game.time.events.repeat(Phaser.Timer.SECOND * game.switchRate, 1, switchSides, this);

	},
	update: function() {

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
	console.log('buh');
	if (game.playerPos == 0) {
		game.playerPos = 1;
	}
	else {
		game.playerPos = 0;
	}

	game.time.events.repeat(Phaser.Timer.SECOND * game.switchRate, 1, switchSides, this);
}

function approach(value, valueDest, speed) {

	if (value < valueDest) {
		value += speed;
	}
	else if (value > valueDest) {
		value -= speed;
	}

	return value;
}
