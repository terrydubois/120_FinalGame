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

        // add music
		game.song1 = game.add.audio('BETA');
		this.beat = game.add.audio('BEAT');
		this.beat.volume = 0.1;

		// play music
		game.song1.play('',0,1,true);
		this.beat.play('',0,.5,false);


		game.song1._sound.playbackRate.value = .7

		game.posLeft = 50;
		game.posRight = game.world.width - game.posLeft;

		// waves on left and right
		rightside = game.add.tileSprite(game.posRight-64, 0, 127, 1800, 'waveformR');
        leftside = game.add.tileSprite(game.posLeft-64, 0, 127, 1800, 'waveformL');

		// add player to game
		game.player = game.add.sprite(game.world.width / 2, (game.world.height / 2) + 175,'player');
		game.player.anchor.setTo(.5);

		game.switchRate = 1;
		game.playerXSpeedTarget = 20;
		game.playerXSpeed = game.playerXSpeedTarget;
		game.playerYSpeed = 12;
		game.playerPos = 0;
		game.playerCollisionRad = game.player.width / 4;

		game.lastSpawnX = -1;


		//timer to switch sides
		game.time.events.repeat(Phaser.Timer.SECOND * game.switchRate, 1, switchSides, this);

		//timers to spawn objects
		game.time.events.repeat(Phaser.Timer.SECOND * 1, 1, spawnEnemy, this);
		game.time.events.repeat(Phaser.Timer.SECOND * 5, 1, spawnCollect, this);
		game.time.events.repeat(Phaser.Timer.SECOND * 10, 1, spawnHealth, this);

		game.debugControls = false;

		// setup hearts
		game.maxHearts = 8;
		game.startingHearts = 5;
		game.currentHearts = game.startingHearts;
		game.heartSprite = [];
		for (var i = 0; i < game.maxHearts; i++) {
			game.heartSprite[i] = -1;
		}

		// bar for speedup
		game.barFill = game.add.sprite(game.world.width / 2, 20, 'barFill');		
		game.barOutline = game.add.sprite(game.world.width / 2, 20, 'barOutline');
		game.barFill.anchor.setTo(0);
		game.barOutline.anchor.setTo(0);
		game.barFillWidthDest = 0;
		game.barFill.width = 0;

		// text for leveling up
		game.speedupText = game.add.text(game.world.width / 2, 55, 'LEVEL ' + game.level, {fontStyle: 'italic', fontSize: '30px', fill: '#fff', align: 'center'});
		game.speedupText2 = game.add.text(game.world.width / 2 - 2, 55 - 2, 'LEVEL ' + game.level, {fontStyle: 'italic', fontSize: '30px', fill: '#000', align: 'center'});
		game.speedupText.anchor.setTo(0.5);
		game.speedupText2.anchor.setTo(0.5);

		// how many plusses to level up
		game.plussesToLevelUp = 5;
		game.currentPlussesToLevelUp = game.plussesToLevelUp;
		game.level = 1;


		// add sounds to game
		game.hitEnemySound = game.add.audio('hitEnemySound');
		game.hitPlusSound = game.add.audio('hitPlusSound');
		game.hitHeartSound = game.add.audio('hitHeartSound');
	
		console.log(game.song1._sound.playbackRate.value);
	},
	update: function() {

		highscore = game.level;
		console.log(highscore);
		
		// Game Over checking
		if(game.currentHearts == 0) {
			game.state.start("GameOver");
		}

		// resize speedup bar
		game.barOutline.x = (game.world.width / 2) - (game.barOutline.width / 2);
		game.barFill.x = game.barOutline.x;
		game.barFillWidthDest = ((game.plussesToLevelUp - game.currentPlussesToLevelUp) / game.plussesToLevelUp) * game.barOutline.width;
		game.barFill.width = approachSmooth(game.barFill.width, game.barFillWidthDest, 6);

		//slowdown while approach
		if (game.player.x > game.world.width / 2 + 250 && game.playerPos == 0) {

			game.playerXSpeed -= Math.abs((game.playerXSpeed)) / 12;
		}
		else if (game.player.x < game.world.width / 2 - 250 &&  game.playerPos == 1) {

			game.playerXSpeed -= Math.abs((game.playerXSpeed)) / 12;
		}
		else {
			game.playerXSpeed = game.playerXSpeedTarget;
		}


		// take out for final game
		if (game.input.keyboard.justPressed(Phaser.Keyboard.SHIFT)) {
			game.debugControls = !game.debugControls;
			console.log("DEBUG CONTROLS: " + game.debugControls);
		}

		//waveform scrolling
 		rightside.tilePosition.y -= .33;
 		leftside.tilePosition.y -= .33;


		 //screen size changing
		if (game.debugControls) {
			if(game.input.keyboard.isDown(Phaser.Keyboard.W)){
				game.posLeft--;
				leftside.x --;
				rightside.x ++;

			}
			if(game.input.keyboard.isDown(Phaser.Keyboard.S)){
				game.posLeft++;
				leftside.x ++;
				rightside.x --;
			}
		}
		game.posRight = game.world.width - game.posLeft;



		//player input control
		if (game.input.keyboard.isDown(Phaser.Keyboard.UP)){
			game.player.y -= game.playerYSpeed;
		}
		if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
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



		// level up every time currentPlussesToLevelUp hits zero
		if (game.currentPlussesToLevelUp <= 0) {
			game.level++;
			game.plussesToLevelUp++;
			game.currentPlussesToLevelUp = game.plussesToLevelUp;
			game.playerXSpeedTarget += 2;
			game.playerYSpeed += 2;
			game.switchRate -=.05;
			game.song1._sound.playbackRate.value += .1
		}


		//esc key also goes back to main menu
		if(game.input.keyboard.justPressed(Phaser.Keyboard.ESC)){
			game.sound.stopAll();
			game.state.start("GameOver");
		}



		gameplayHUD();
	}
}


function switchSides() {
	
	// switch which side player will slide to
	if (game.playerPos == 0) {
		game.playerPos = 1;
		this.beat.play('',0,.5,false);
	}
	else {
		game.playerPos = 0;
		this.beat.play('',0,.5,false);
	}

	// repeat this function
	game.time.events.repeat(Phaser.Timer.SECOND * game.switchRate, 1, switchSides, this);
}


//skull spawner
function spawnEnemy() {

	var newEnemySpeed = Math.random() * 350;
	newEnemySpeed = Phaser.Math.clamp(newEnemySpeed, 250, 350);
	game.enemy = new Avoid(game, 'skull', 'skull', .5, 0, game.playerPos, newEnemySpeed);
	game.add.existing(game.enemy);

	// decrease time until next spawn as levels progress
	var maxTimeTilNextSpawn = 2;
	if (game.level == 1) {
		maxTimeTilNextSpawn = 2;
	}
	else if (game.level == 2) {
		maxTimeTilNextSpawn = 1.5;
	}
	else if (game.level == 3) {
		maxTimeTilNextSpawn = 1;
	}
	else {
		maxTimeTilNextSpawn = 0.5;
	}

	var minTimeTilNextSpawn = 0.5;
	var timeTilNextSpawn = Math.random() * maxTimeTilNextSpawn;

	// clamp time until next spawn between reasonable minimum and maximum
	timeTilNextSpawn = Phaser.Math.clamp(timeTilNextSpawn, minTimeTilNextSpawn, maxTimeTilNextSpawn);

	// call this function again in "timeTilNextSpawn" seconds
	game.time.events.repeat(Phaser.Timer.SECOND * timeTilNextSpawn, 1, spawnEnemy, this);
}


// plus spawner
function spawnCollect() {
	var newEnemySpeed = Math.random() * 350;
	newEnemySpeed = Phaser.Math.clamp(newEnemySpeed, 150, 350);
	game.Heart = new Avoid(game, 'plus', 'plus', .5, 0, game.playerPos, newEnemySpeed);
	game.add.existing(game.Heart);

	// set up how long to wait until next plus spawn
	var timeTilNextSpawn = Math.random() * 10;
	var minTimeTilNextSpawn = 4;
	var maxTimeTilNextSpawn = 8;
	timeTilNextSpawn = Phaser.Math.clamp(timeTilNextSpawn, minTimeTilNextSpawn, maxTimeTilNextSpawn);
	console.log("time til next plus: " + timeTilNextSpawn);

	// call this function again in "timeTilNextSpawn" seconds
	game.time.events.repeat(Phaser.Timer.SECOND * timeTilNextSpawn, 1, spawnCollect, this);
}



//heart spawner
function spawnHealth() {
	var newEnemySpeed = Math.random() * 350;
	newEnemySpeed = Phaser.Math.clamp(newEnemySpeed, 150, 250);
	game.Heart = new Avoid(game, 'heart', 'heart', 0.5, 0, game.playerPos, newEnemySpeed);
	game.add.existing(game.Heart);

	// set up how long to wait until next heart spawn
	var timeTilNextSpawn = Math.random() * 15;
	var minTimeTilNextSpawn = 10;
	var maxTimeTilNextSpawn = 15;
	timeTilNextSpawn = Phaser.Math.clamp(timeTilNextSpawn, minTimeTilNextSpawn, maxTimeTilNextSpawn);
	console.log("time til next health: " + timeTilNextSpawn);

	// call this function again in "timeTilNextSpawn" seconds
	game.time.events.repeat(Phaser.Timer.SECOND * timeTilNextSpawn, 1, spawnHealth, this);
}



// function for clean movement
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

// function for movement that "eases" (curved movement)
function approachSmooth(value, valueDest, divisor) {
	if (value < valueDest) {
		value += Math.abs(valueDest - value) / divisor;
	}
	else if (value > valueDest) {
		value -= Math.abs(valueDest - value) / divisor;
	}
	return value;
}




function gameplayHUD() {

	// debug controls
	if (game.debugControls) {
		if (game.input.keyboard.justPressed(Phaser.Keyboard.D)) {
			game.currentHearts++;
		}
		if (game.input.keyboard.justPressed(Phaser.Keyboard.A)) {
			game.currentHearts--;
		}
	}

	// update level text
	game.speedupText.text = 'LEVEL ' + game.level;
	game.speedupText2.text = 'LEVEL ' + game.level;

	game.currentHearts = Phaser.Math.clamp(game.currentHearts, 0, game.maxHearts);


	// update hearts HUD
	for (var i = 0; i < game.maxHearts; i++) {

		if (game.heartSprite[i] != -1) {
			game.heartSprite[i].kill();
			game.heartSprite[i] = -1;
		}

		if (game.currentHearts > i) {
			var currentHeartX = 24 + (i * 58);
			var currentHeartY = 30;
			game.heartSprite[i] = game.add.sprite(currentHeartX, currentHeartY, 'heartHUD');
			game.heartSprite[i].anchor.setTo(0.5);
			game.heartSprite[i].scale.setTo(0.5);
		}
	}
}