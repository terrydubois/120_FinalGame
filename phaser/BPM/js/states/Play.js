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
        //audio
		this.song1 = game.add.audio('ALPHA');
		this.song1.play('',0,1,true);

		game.posLeft = 50;
		game.posRight = game.world.width - game.posLeft;


		rightside = game.add.tileSprite(game.posRight-300, 0, 600, 1600, 'waveformR');
        leftside = game.add.tileSprite(game.posLeft-300, 0, 600, 1600, 'waveformL');


		game.player = game.add.sprite(game.world.width/2,game.world.height/2+175,'player');
		game.player.anchor.setTo(.5);

		game.switchRate = 1;
		game.playerXSpeed = 20;
		game.playerYSpeed = 12;
		game.playerPos = 0;
		game.playerCollisionRad = game.player.width / 4;


		//timer to switch sides
		game.time.events.repeat(Phaser.Timer.SECOND * game.switchRate, 1, switchSides, this);

		//timers to spawn objects
		game.time.events.repeat(Phaser.Timer.SECOND * 1, 1, spawnEnemy, this);
		game.time.events.repeat(Phaser.Timer.SECOND * 5, 1, spawnCollect, this);
		game.time.events.repeat(Phaser.Timer.SECOND * 10, 1, spawnHealth, this);



	},
	update: function() {


		//waveform scrolling
 		rightside.tilePosition.y -= .33;
 		leftside.tilePosition.y -= .33;

 		//screen size changing
		if(game.input.keyboard.isDown(Phaser.Keyboard.W)){
			game.posLeft--;
			leftside.tilePosition.x --;
			rightside.tilePosition.x ++;

		}
		if(game.input.keyboard.isDown(Phaser.Keyboard.S)){
			game.posLeft++;
			leftside.tilePosition.x ++;
			rightside.tilePosition.x --;
		}
		game.posRight = game.world.width - game.posLeft;



		//player input control
		if(game.input.keyboard.isDown(Phaser.Keyboard.UP)){
			game.player.y -= game.playerYSpeed;
		}
		if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
			game.player.y += game.playerYSpeed;
		}

		//player bounds checking
		game.player.y = Phaser.Math.clamp(game.player.y,0,game.world.height);



		//player move speed determination
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


//skull spawner
function spawnEnemy() {

	var newEnemySpeed = Math.random() * 350;
	newEnemySpeed = Phaser.Math.clamp(newEnemySpeed, 250, 350);
	game.enemy = new Avoid(game, 'skull', 'skull', 1, 0, game.playerPos, newEnemySpeed);
	game.add.existing(game.enemy);

	var timeTilNextSpawn = Math.random() * 2;
	timeTilNextSpawn = Phaser.Math.clamp(timeTilNextSpawn, 0.5, 2);
	game.time.events.repeat(Phaser.Timer.SECOND * timeTilNextSpawn, 1, spawnEnemy, this);
}


//plus spawner
function spawnCollect() {
	var newEnemySpeed = Math.random() * 350;
	newEnemySpeed = Phaser.Math.clamp(newEnemySpeed, 150, 350);
	game.Heart = new Avoid(game, 'plus', 'plus', 1, 0, game.playerPos, newEnemySpeed);
	game.add.existing(game.Heart);

	var timeTilNextSpawn = Math.random() * 10;
	timeTilNextSpawn = Phaser.Math.clamp(timeTilNextSpawn, 5, 10);
	game.time.events.repeat(Phaser.Timer.SECOND * timeTilNextSpawn, 1, spawnCollect, this);
}



//heart spawner
function spawnHealth() {
	var newEnemySpeed = Math.random() * 350;
	newEnemySpeed = Phaser.Math.clamp(newEnemySpeed, 150, 250);
	game.Heart = new Avoid(game, 'heart', 'heart', 1, 0, game.playerPos, newEnemySpeed);
	game.add.existing(game.Heart);

	var timeTilNextSpawn = Math.random() * 15;
	timeTilNextSpawn = Phaser.Math.clamp(timeTilNextSpawn, 10, 15);
	game.time.events.repeat(Phaser.Timer.SECOND * timeTilNextSpawn, 1, spawnCollect, this);
}



//function for clean movement
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
