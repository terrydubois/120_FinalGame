// define gameplay state and methods
var Mode2 = function(game) {};
Mode2.prototype = {
	init: function() {
		console.log('Mode2: init');

	},
	preload: function() {
		console.log('Mode2: preload');

	},
	create: function() {
		console.log('Mode2: create');

		game.time.advancedTiming = true;

		game.bgFill = game.add.sprite(0,0,'sky');

        // add music
		game.song1 = game.add.audio('BETA');
		this.beat = game.add.audio('BEAT');
		this.beat.volume = 0.1;


		game.playerEmitter = game.add.emitter(game.world.width/2,game.world.height/2+175, 250);
		game.playerEmitter.makeParticles('player');

		game.playerEmitter.minParticleScale = 0.3;
		game.playerEmitter.maxParticleScale = 0.5;
		game.playerEmitter.setAlpha(1, 0.0, 250);
    	game.playerEmitter.start(false, 5000, 50);




		game.posLeft = 50;
		game.posLeftDest = 50;
		game.posRight = game.world.width - game.posLeft;

		game.originalPos =50;
		game.newPos =250;


		rightside = game.add.tileSprite(game.posRight, 0, 127, 1800, 'waveformR');
		rightside.anchor.setTo(.5);
		rightside.scale.x  = .2;
        leftside = game.add.tileSprite(game.posLeft, 0, 127, 1800, 'waveformL');
        leftside.anchor.setTo(.5);
        leftside.scale.x  = .2;

		game.player = game.add.sprite(game.world.width/2,game.world.height/2+175,'player');
		game.player.anchor.setTo(.5);
		game.player.scale.setTo(0.7);

		game.player.animations.add('squiggle', [0,1,2,3,4,5,6,7,8,9],8,true);
		game.player.animations.play('squiggle');

		game.switchRate = 1;
		game.playerXSpeedTarget = 20;
		game.playerXSpeed = game.playerXSpeedTarget;
		game.playerYSpeed = 12;
		game.playerPos = 1;
		game.playerCollisionRad = game.player.width / 4;
		game.wavePos = 1;

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


		game.HUDgroup = game.add.group();
		game.add.existing(game.HUDgroup);
		// bar for speedup
		game.barFill = game.add.sprite(game.world.width / 2, 20, 'barFill');		
		game.barOutline = game.add.sprite(game.world.width / 2, 20, 'barOutline');
		game.barFill.anchor.setTo(0);
		game.barOutline.anchor.setTo(0);
		game.barFillWidthDest = 0;
		game.barFill.width = 0;
		game.HUDgroup.add(game.barFill);
		game.HUDgroup.add(game.barOutline);

		// text for leveling up
		game.speedupText = game.add.text(game.world.width / 2, 55, 'LEVEL ' + game.level, {font: 'Impact', fontStyle: 'italic', fontSize: '30px', fill: '#fff', align: 'center'});
		game.speedupText2 = game.add.text(game.world.width / 2 - 2, 55 - 2, 'LEVEL ' + game.level, {font: 'Impact', fontStyle: 'italic', fontSize: '30px', fill: '#000', align: 'center'});
		game.speedupText.anchor.setTo(0.5);
		game.speedupText2.anchor.setTo(0.5);
		game.HUDgroup.add(game.speedupText);
		game.HUDgroup.add(game.speedupText2);

		// text for score
		game.scoreTextArrLength = 5;
		game.scoreTextArr = [game.scoreTextArrLength];
		//game.scoreText = game.add.text(game.world.width - 60, 75, game.currentScore, {font: 'Impact', fontStyle: 'italic', fontSize: '50px', fill: '#3FFC45', align: 'center'});
		//game.scoreText.anchor.setTo(1);
	    //game.scoreText.stroke = '#299F2D';
    	//game.scoreText.strokeThickness = 2;
		game.scoreTextDisplay = 0;
		for (var i = 0; i < game.scoreTextArrLength; i++) {
			var currentFill = '#26D100';
			if (i == game.scoreTextArrLength - 1) {
				currentFill = '#0f7200';
			}
			game.scoreTextArr[i] = game.add.text(game.world.width - 60, 75, game.currentScore, {font: 'Impact', fontStyle: 'italic', fontSize: '50px', fill: currentFill, align: 'center'});
			game.scoreTextArr[i].anchor.setTo(1);
			game.HUDgroup.add(game.scoreTextArr[i]);
		}
		

		// text for stars
		game.starCountMenuSprite = game.add.sprite(game.world.width - 90, 80, 'star');
		game.starCountMenuSprite.scale.setTo(0.25);
		game.starCountMenuSprite.anchor.setTo(0.5);
		game.starCountMenuText = game.add.text(game.world.width - 110, 95, '0  ', {font: 'Impact', fontStyle: 'italic', fontSize: '20px', fill: '#333', align: 'center'});
		game.starCountMenuText.anchor.setTo(1);
		game.HUDgroup.add(game.starCountMenuSprite);
		game.HUDgroup.add(game.starCountMenuText);


		// text for FPS
		game.fpsText = game.add.text(game.world.width / 2, 90, 'fps: ' + game.time.fps, {fontStyle: 'italic', fontSize: '15px', fill: '#000', align: 'center'});
		game.fpsText.anchor.setTo(0.5);
		game.HUDgroup.add(game.fpsText);



		game.plussesToLevelUp = 4;
		game.currentPlussesToLevelUp = game.plussesToLevelUp;
		game.level = 1;


		// add sounds to game
		game.hitEnemySound = game.add.audio('hitEnemySound');
		game.hitPlusSound = game.add.audio('hitPlusSound');
		game.hitHeartSound = game.add.audio('hitHeartSound');
		game.hitStarSound = game.add.audio('hitStarSound');
		game.dieSound = game.add.audio('dieSound');
		game.levelUpSound = game.add.audio('levelUpSound');
		game.dieSound.volume = 0.5;
		game.levelUpSound.volume = 0.75;

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

		// add group for BG sprites
		game.bgGroup = game.add.group();
		game.add.existing(game.bgGroup);
		game.bgFlashGroup = game.add.group();
		game.add.existing(game.bgFlashGroup);

	},
	update: function() {

		

		game.fpsText.text = "fps: " + (game.time.fps);
		

		buldge();
		buldgeWaves();


		game.playerEmitter.emitX = game.player.x;
		game.playerEmitter.emitY = game.player.y;
		
		// Game Over checking
		if(game.currentHearts == 0) {
			game.dieSound.play();
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
			if(game.input.keyboard.justPressed(Phaser.Keyboard.P)){
				game.currentPlussesToLevelUp--;
			}
			
		}
		game.posRight = game.world.width - game.posLeft;






		// player input control to start game
		if ((game.input.keyboard.isDown(Phaser.Keyboard.UP)
		|| game.input.keyboard.isDown(Phaser.Keyboard.DOWN)
		|| game.input.keyboard.isDown(Phaser.Keyboard.W)
		|| game.input.keyboard.isDown(Phaser.Keyboard.S))
		&& !game.hasStarted) {

			//timer to switch sides
			game.time.events.repeat(Phaser.Timer.SECOND * game.switchRate, 1, switchSides, this);
			//game.time.events.repeat(Phaser.Timer.SECOND *8, 1, moveWaves, this);

			//timers to spawn objects
			game.time.events.repeat(Phaser.Timer.SECOND * 1, 1, spawnEnemy, this);
			game.time.events.repeat(Phaser.Timer.SECOND * 5, 1, spawnCollect, this);
			game.time.events.repeat(Phaser.Timer.SECOND * 10, 1, spawnHealth, this);
			game.time.events.repeat(Phaser.Timer.SECOND * 30, 1, spawnStar, this);

			spawnBGCircle();
						

			game.waveScaleDest = game.maxScale;	


			game.song1.play('',0,1,true);
			game.song1._sound.playbackRate.value = .7
			this.beat.play('',0,.5,false);
			game.hasStarted = true;
		}


		//player input control for movement
		if (game.input.keyboard.isDown(Phaser.Keyboard.UP)
		|| game.input.keyboard.isDown(Phaser.Keyboard.W)) {
			game.player.y -= game.playerYSpeed;
		}
		if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)
		|| game.input.keyboard.isDown(Phaser.Keyboard.S)) {
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
/*
		//waveform move speed determination
		if (game.wavePos == 1 && game.hasStarted) {
				game.posLeftDest = game.originalPos;
		}
		else if (game.wavePos == 0 && game.hasStarted) {
				game.posLeftDest = game.newPos;
		}
		else{
		}
*/
		game.posLeft = approachSmooth(game.posLeft,game.posLeftDest,20);
		game.posRight = game.world.width - game.posLeft;

		leftside.x = game.posLeft;
		rightside.x  = game.posRight;



		blinkPlayer(game.player);
		game.playerEmitter.alpha = game.player.alpha;



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
			game.levelUpSound.play();
			if(game.level <8){
				game.posLeftDest += 50;
			}
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