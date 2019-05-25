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

		game.time.advancedTiming = true;

		game.add.sprite(0,0,'sky');

        // add music
		game.song1 = game.add.audio('BETA');
		this.beat = game.add.audio('BEAT');
		this.beat.volume = 0.1;


		emitter = game.add.emitter(game.world.width/2,game.world.height/2+175, 250);
		emitter.makeParticles('particle');

		emitter.setAlpha(1, 0.0, 500);
    	emitter.start(false, 5000, 50);




		game.posLeft = 50;
		game.posRight = game.world.width - game.posLeft;



		rightside = game.add.tileSprite(game.posRight, 0, 127, 1800, 'waveformR');
		rightside.anchor.setTo(.5);
		rightside.scale.x  = .2;
        leftside = game.add.tileSprite(game.posLeft, 0, 127, 1800, 'waveformL');
        leftside.anchor.setTo(.5);
        leftside.scale.x  = .2;

		game.player = game.add.sprite(game.world.width/2,game.world.height/2+175,'player');
		game.player.anchor.setTo(.5);
		game.player.scale.setTo(0.7);

		game.player.animations.add('squiggle', [0,1,2,3,4,5,6,7,8,9],4,true);
		game.player.animations.play('squiggle');

		game.switchRate = 1;
		game.playerXSpeedTarget = 20;
		game.playerXSpeed = game.playerXSpeedTarget;
		game.playerYSpeed = 12;
		game.playerPos = 1;
		game.playerCollisionRad = game.player.width / 4;

		game.lastSpawnX = -1;
		game.hasHitPlayer = false;

/*
		//timer to switch sides
		game.time.events.repeat(Phaser.Timer.SECOND * game.switchRate, 1, switchSides, this);

		//timers to spawn objects
		game.time.events.repeat(Phaser.Timer.SECOND * 1, 1, spawnEnemy, this);
		game.time.events.repeat(Phaser.Timer.SECOND * 5, 1, spawnCollect, this);
		game.time.events.repeat(Phaser.Timer.SECOND * 10, 1, spawnHealth, this);

*/

		

		// setup hearts
		game.maxHearts = 7;
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



		game.fpsText = game.add.text(game.world.width / 2, 90, 'fps: ' + game.time.fps, {fontStyle: 'italic', fontSize: '15px', fill: '#000', align: 'center'});
		game.fpsText.anchor.setTo(0.5);


		game.plussesToLevelUp = 4;
		game.currentPlussesToLevelUp = game.plussesToLevelUp;
		game.level = 1;


		// add sounds to game
		game.hitEnemySound = game.add.audio('hitEnemySound');
		game.hitPlusSound = game.add.audio('hitPlusSound');
		game.hitHeartSound = game.add.audio('hitHeartSound');

		//sprite scaling variables for player
		game.minScale = 0.6;
		game.maxScale = 0.8;
		game.scaleFactor = .01;
		game.isBig = false;

		//sprite scaling variables for waves
		game.playerPosChanged = 0;
		game.waveScaleDest = .2;

		game.hasStarted = false;

		game.currentScore = 0;

	},
	update: function() {

		

		game.fpsText.text = "fps: " + (game.time.fps);
		

		buldge();
		buldgeWaves();

		emitter.emitX = game.player.x;
		emitter.emitY = game.player.y;
		
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
			if(game.input.keyboard.justPressed(Phaser.Keyboard.T)){
				game.currentHearts--;
			}
			
		}
		game.posRight = game.world.width - game.posLeft;






		//player input control to start game
		if ((game.input.keyboard.isDown(Phaser.Keyboard.UP) && !game.hasStarted)
		|| (game.input.keyboard.isDown(Phaser.Keyboard.DOWN) && !game.hasStarted)) {

			//timer to switch sides
			game.time.events.repeat(Phaser.Timer.SECOND * game.switchRate, 1, switchSides, this);

			//timers to spawn objects
			game.time.events.repeat(Phaser.Timer.SECOND * 1, 1, spawnEnemy, this);
			game.time.events.repeat(Phaser.Timer.SECOND * 5, 1, spawnCollect, this);
			game.time.events.repeat(Phaser.Timer.SECOND * 10, 1, spawnHealth, this);
			game.time.events.repeat(Phaser.Timer.SECOND * 30, 1, spawnStar, this);
						

			game.song1.play('',0,1,true);
			game.song1._sound.playbackRate.value = .7
			this.beat.play('',0,.5,false);
			game.hasStarted = true;
		}


		//player input control
		if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
			game.player.y -= game.playerYSpeed;
		}
		if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
			game.player.y += game.playerYSpeed;
		}

		//player bounds checking
		game.player.y = Phaser.Math.clamp(game.player.y,0,game.world.height);



		//player move speed determination
		if (game.playerPos == 1 && game.hasStarted) {
			game.player.x = approach(game.player.x, game.posLeft, game.playerXSpeed);
		}
		else if (game.playerPos == 0 && game.hasStarted) {
			game.player.x = approach(game.player.x, game.posRight, game.playerXSpeed);	
		}
		else{
		}



		// level up every time currentPlussesToLevelUp hits zero
		if (game.currentPlussesToLevelUp <= 0
		|| (game.debugControls && game.input.keyboard.justPressed(Phaser.Keyboard.O))) {
			game.level++;
			game.plussesToLevelUp++;
			game.currentPlussesToLevelUp = game.plussesToLevelUp;
			game.playerXSpeedTarget += 1;
			game.playerYSpeed += 1.5;
			game.switchRate -=.03;
			game.song1._sound.playbackRate.value += .1;

			//game.posLeft += 20;
			//leftside.x += 20;
			//rightside.x -= 20;
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
		game.hasHitPlayer = false;
	}
	else {
		game.playerPos = 0;
		this.beat.play('',0,.5,false);
		game.hasHitPlayer = false;
	}
	game.playerPosChanged = 1;

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
	var minTimeTilNextSpawn = 1;
	if (game.level == 1) {
		maxTimeTilNextSpawn = 2;
	}
	else if (game.level == 2) {
		maxTimeTilNextSpawn = 1.75;
	}
	else if (game.level == 3) {
		maxTimeTilNextSpawn = 1.5;
	}
	else if (game.level == 4) {
		maxTimeTilNextSpawn = 1.25;
	}
	else {
		maxTimeTilNextSpawn = 1;
	}

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
	var minTimeTilNextSpawn = 3;
	var maxTimeTilNextSpawn = 8;
	if (game.level == 1) {
		maxTimeTilNextSpawn = 7;
	}
	else if (game.level == 2) {
		maxTimeTilNextSpawn = 6;
	}
	else if (game.level == 3) {
		maxTimeTilNextSpawn = 5;
	}
	else if (game.level == 4) {
		maxTimeTilNextSpawn = 4;
	}
	else {
		maxTimeTilNextSpawn = 3;
	}
	
		var timeTilNextSpawn = Math.random() * 10;

	timeTilNextSpawn = Phaser.Math.clamp(timeTilNextSpawn, minTimeTilNextSpawn, maxTimeTilNextSpawn);
	console.log("time til next plus: " + timeTilNextSpawn);

	// call this function again in "timeTilNextSpawn" seconds
	game.time.events.repeat(Phaser.Timer.SECOND * timeTilNextSpawn, 1, spawnCollect, this);
}



// star spawner
function spawnStar() {
	var newEnemySpeed = Math.random() * 350;
	newEnemySpeed = Phaser.Math.clamp(newEnemySpeed, 150, 350);
	game.Star = new Avoid(game, 'star', 'star', .5, 0, game.playerPos, newEnemySpeed);
	game.add.existing(game.Star);

	// set up how long to wait until next plus spawn
	var timeTilNextSpawn = Math.random() * 50;
	var minTimeTilNextSpawn = 30;
	var maxTimeTilNextSpawn = 45;
	timeTilNextSpawn = Phaser.Math.clamp(timeTilNextSpawn, minTimeTilNextSpawn, maxTimeTilNextSpawn);
	console.log("time til next plus: " + timeTilNextSpawn);

	// call this function again in "timeTilNextSpawn" seconds
	game.time.events.repeat(Phaser.Timer.SECOND * timeTilNextSpawn, 1, spawnStar, this);
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

function buldge(){

	if(game.player.scale.x < game.maxScale && game.isBig == false){
		game.player.scale.setTo(game.player.scale.x += game.scaleFactor, game.player.scale.y += game.scaleFactor);
	}
	if(game.player.scale.x >= game.maxScale){
		game.isBig = true;
	}


	if(game.player.scale.x > game.minScale && game.isBig == true){
		game.player.scale.setTo(game.player.scale.x -= game.scaleFactor,game.player.scale.y -= game.scaleFactor);
	}
	if(game.player.scale.x <= game.minScale){
		game.isBig = false;
	}
}

function buldgeWaves(){
	if (game.playerPosChanged){
		game.playerPosChanged = 0;

		game.waveScaleDest = game.maxScale;
	}

	if (Math.abs(rightside.scale.x - game.maxScale) < 0.1) {
		game.waveScaleDest = 0.2;
	}
	

	if (rightside.scale.x < game.waveScaleDest) {
		rightside.scale.x += Math.abs(rightside.scale.x - game.waveScaleDest) / 4;
	}
	else if (rightside.scale.x > game.waveScaleDest) {
		rightside.scale.x -= Math.abs(rightside.scale.x - game.waveScaleDest) / 16;	
	}
	leftside.scale.x = rightside.scale.x;
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
			game.heartSprite[i].destroy();
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