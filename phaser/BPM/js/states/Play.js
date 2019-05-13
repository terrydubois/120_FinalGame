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
		this.song1 = game.add.audio('BETA');
		this.beat = game.add.audio('BEAT');
		this.beat.volume = 0.1;




		this.song1.play('',0,1,true);
		this.beat.play('',0,.5,false);


		this.song1._sound.playbackRate.value = .7

		game.posLeft = 50;
		game.posRight = game.world.width - game.posLeft;


		rightside = game.add.tileSprite(game.posRight-64, 0, 127, 1800, 'waveformR');
        leftside = game.add.tileSprite(game.posLeft-64, 0, 127, 1800, 'waveformL');


		game.player = game.add.sprite(game.world.width/2,game.world.height/2+175,'player');
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

		game.plussesToLevelUp = 5;
		game.level = 1;
		game.levelUpText1 = game.add.text(16, 64, 'plusses to levelup: ' + game.plussesToLevelUp, {fontStyle: 'italic', fontSize: '20px', fill: '#000', align: 'left'});
		game.levelUpText2 = game.add.text(16, 84, 'current level: ' + game.level, {fontStyle: 'italic', fontSize: '20px', fill: '#000', align: 'left'});
	
		console.log(this.song1._sound.playbackRate.value);
	},
	update: function() {


		//Game Over checking
		if(game.currentHearts == 0){
			game.state.start("GameOver");
		}

		//slowdown while approach
		if (game.player.x > game.world.width / 2 + 250 && game.playerPos == 0){

			game.playerXSpeed -= Math.abs((game.playerXSpeed)) / 12;
		}
		else if (game.player.x < game.world.width / 2 - 250 &&  game.playerPos == 1){

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
				leftside.tilePosition.x --;
				rightside.tilePosition.x ++;

			}
			if(game.input.keyboard.isDown(Phaser.Keyboard.S)){
				game.posLeft++;
				leftside.tilePosition.x ++;
				rightside.tilePosition.x --;
			}
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



		// level up every time plussesToLevelUp hits zero
		if (game.plussesToLevelUp <= 0) {
			game.level++;
			game.plussesToLevelUp = 5;
			game.playerXSpeedTarget += 3;
			game.playerYSpeed += 3;
			game.switchRate -=.05;
			this.song1._sound.playbackRate.value += .1

		}


		//esc key also goes back to main menu
		if(game.input.keyboard.justPressed(Phaser.Keyboard.ESC)){
			game.sound.stopAll();
			game.state.start("GameOver");
		}



		// game over if 
		gameplayHUD();
	}
}


function switchSides() {
	
	if (game.playerPos == 0) {
		game.playerPos = 1;
		this.beat.play('',0,.5,false);
	}
	else {
		game.playerPos = 0;
		this.beat.play('',0,.5,false);
	}


	game.time.events.repeat(Phaser.Timer.SECOND * game.switchRate, 1, switchSides, this);
}


//skull spawner
function spawnEnemy() {

	var newEnemySpeed = Math.random() * 350;
	newEnemySpeed = Phaser.Math.clamp(newEnemySpeed, 250, 350);
	game.enemy = new Avoid(game, 'skull', 'skull', .5, 0, game.playerPos, newEnemySpeed);
	game.add.existing(game.enemy);

	var timeTilNextSpawn = Math.random() * 2;
	var minTimeTilNextSpawn = 0.5;
	var maxTimeTilNextSpawn = 2;
	timeTilNextSpawn = Phaser.Math.clamp(timeTilNextSpawn, minTimeTilNextSpawn, maxTimeTilNextSpawn);

	game.time.events.repeat(Phaser.Timer.SECOND * timeTilNextSpawn, 1, spawnEnemy, this);
}


//plus spawner
function spawnCollect() {
	var newEnemySpeed = Math.random() * 350;
	newEnemySpeed = Phaser.Math.clamp(newEnemySpeed, 150, 350);
	game.Heart = new Avoid(game, 'plus', 'plus', .5, 0, game.playerPos, newEnemySpeed);
	game.add.existing(game.Heart);

	var timeTilNextSpawn = Math.random() * 10;
	var minTimeTilNextSpawn = 4;
	var maxTimeTilNextSpawn = 8;
	timeTilNextSpawn = Phaser.Math.clamp(timeTilNextSpawn, minTimeTilNextSpawn, maxTimeTilNextSpawn);
	console.log("time til next plus: " + timeTilNextSpawn);

	game.time.events.repeat(Phaser.Timer.SECOND * timeTilNextSpawn, 1, spawnCollect, this);
}



//heart spawner
function spawnHealth() {
	var newEnemySpeed = Math.random() * 350;
	newEnemySpeed = Phaser.Math.clamp(newEnemySpeed, 150, 250);
	game.Heart = new Avoid(game, 'heart', 'heart', 0.5, 0, game.playerPos, newEnemySpeed);
	game.add.existing(game.Heart);

	var timeTilNextSpawn = Math.random() * 15;
	var minTimeTilNextSpawn = 10;
	var maxTimeTilNextSpawn = 15;
	timeTilNextSpawn = Phaser.Math.clamp(timeTilNextSpawn, minTimeTilNextSpawn, maxTimeTilNextSpawn);
	console.log("time til next health: " + timeTilNextSpawn);

	game.time.events.repeat(Phaser.Timer.SECOND * timeTilNextSpawn, 1, spawnHealth, this);
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




function gameplayHUD() {

	if (game.debugControls) {
		if (game.input.keyboard.justPressed(Phaser.Keyboard.D)) {
			game.currentHearts++;
		}
		if (game.input.keyboard.justPressed(Phaser.Keyboard.A)) {
			game.currentHearts--;
		}
	}

	game.levelUpText1.text = 'plusses to levelup: ' + game.plussesToLevelUp;
	game.levelUpText2.text = 'current level: ' + game.level;

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