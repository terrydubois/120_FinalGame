// define gameover state and methods
var GameOver = function(game) {};
GameOver.prototype = {
	preload: function() {
		console.log('GameOver: preload');
	},
	create: function() {
		console.log('GameOver: create');
		game.add.sprite(0,0,'sky');
		gameover = game.add.sprite(0,0,'goscreen');

		game.highScore = 0;

		//player scaling variables
		game.minScale = 0.6;
		game.maxScale = 0.8;
		game.scaleFactor = .01;
		game.isBig = false;

		game.player = game.add.sprite(game.world.width/2,game.world.height/2+180,'player');
		game.player.anchor.setTo(.5);
		game.player.scale.setTo(game.maxScale, game.maxScale)

		game.player.animations.add('squiggle', [0,1,2,3,4,5,6,7,8,9],8,true);
		game.player.animations.play('squiggle');

		game.escapeText = game.add.text(140, game.world.height - 30, 'PRESS ESC TO EXIT    ', {font: 'Impact',fontStyle: 'italic', fontSize: '25px', fill: '#000', align: 'center'});
		game.escapeText.anchor.setTo(0.5);


		if(game.currentMode == 1){

			// save highscore to browser (credit to Nathan Altice's Paddle Parkour)
			var newHS = false;
			if (localStorage.getItem('highscore1') == null) {
				
				// in this case, we don't have a saved browser highscore yet, so we set this score as the new highscore
				game.highScore = game.currentScore;
				localStorage.setItem('highscore1', game.highScore.toString());
				newHS = true;
				
				console.log("brand new hs: " + game.highScore);
			}
			else {

				// in this case, we have a saved browser highscore, so we compare it to this score
				let storedScore = parseInt(localStorage.getItem('highscore'));

				if (game.currentScore > storedScore) {
					// player beat the highscore, so we overwrite the browser's highscore
					game.highScore = game.currentScore;
					localStorage.setItem('highscore', game.highScore.toString());
					newHS = true;

					console.log("player set new hs: " + game.highScore);
				}
				else {
					// player didn't beat highscore, so the highscore remains the browser's highscore
					game.highScore = parseInt(localStorage.getItem('highscore'));
					newHS = false;
				}
			}


		}
		else if(game.currentMode == 2){
			// save highscore to browser (credit to Nathan Altice's Paddle Parkour)
			var newHS = false;
			if (localStorage.getItem('highscore2') == null) {
				
				// in this case, we don't have a saved browser highscore yet, so we set this score as the new highscore
				game.highScore = game.currentScore;
				localStorage.setItem('highscore2', game.highScore.toString());
				newHS = true;
				
				console.log("brand new hs: " + game.highScore);
			}
			else {

				// in this case, we have a saved browser highscore, so we compare it to this score
				let storedScore = parseInt(localStorage.getItem('highscore2'));

				if (game.currentScore > storedScore) {
					// player beat the highscore, so we overwrite the browser's highscore
					game.highScore = game.currentScore;
					localStorage.setItem('highscore2', game.highScore.toString());
					newHS = true;

					console.log("player set new hs: " + game.highScore);
				}
				else {
					// player didn't beat highscore, so the highscore remains the browser's highscore
					game.highScore = parseInt(localStorage.getItem('highscore2'));
					newHS = false;
				}
			}
		}
		else{
			// save highscore to browser (credit to Nathan Altice's Paddle Parkour)
			var newHS = false;
			if (localStorage.getItem('highscore3') == null) {
				
				// in this case, we don't have a saved browser highscore yet, so we set this score as the new highscore
				game.highScore = game.currentScore;
				localStorage.setItem('highscore3', game.highScore.toString());
				newHS = true;
				
				console.log("brand new hs: " + game.highScore);
			}
			else {

				// in this case, we have a saved browser highscore, so we compare it to this score
				let storedScore = parseInt(localStorage.getItem('highscore3'));

				if (game.currentScore > storedScore) {
					// player beat the highscore, so we overwrite the browser's highscore
					game.highScore = game.currentScore;
					localStorage.setItem('highscore3', game.highScore.toString());
					newHS = true;

					console.log("player set new hs: " + game.highScore);
				}
				else {
					// player didn't beat highscore, so the highscore remains the browser's highscore
					game.highScore = parseInt(localStorage.getItem('highscore3'));
					newHS = false;
				}
			}
		}
		









		// game over text
		//game.scoreText = game.add.text(game.world.width / 2 + 80 ,(game.world.height / 2) - 115, game.currentScore+"  ", { fontSize: '80px',fill:'#FFCC33',fontStyle: 'italic'});

		// show most recent player score
		game.scoreTextArrLength = 5;
		game.scoreTextArr = [game.scoreTextArrLength];
		for (var i = 0; i < game.scoreTextArrLength; i++) {
			var currentFill = game.scoreColor2;
			if (i == game.scoreTextArrLength - 1) {
				currentFill = game.scoreColor1;
			}
			game.scoreTextArr[i] = game.add.text((game.world.width / 2) + 80 - i, (game.world.height / 2) - 110 - i, game.currentScore + "  ", {font: 'Impact', fontStyle: 'italic', fontSize: '60px', fill: currentFill, align: 'left'});
		}

		// show browser's high score
		game.highScoreTextArr = [game.scoreTextArrLength];
		for (var i = 0; i < game.scoreTextArrLength; i++) {
			var currentFill = '#E3B21F';
			if (i == game.scoreTextArrLength - 1) {
				currentFill = '#FFCC33';
			}
			game.highScoreTextArr[i] = game.add.text((game.world.width / 2) + 80 - i, (game.world.height / 2) - 15 - i, game.highScore + "  ", {font: 'Impact', fontStyle: 'italic', fontSize: '60px', fill: currentFill, align: 'left'});
		}

		// if the player just set a new highscore, say so
		if (newHS) {
			game.newHSText = game.add.text(game.world.width / 2 - 300 ,(game.world.height / 2) - 10, "NEW  ", { fontSize: '40px',fill:'#FFCC33',fontStyle: 'italic'});
		}

		game.bgFlashGroup = game.add.group();
		game.add.existing(game.bgFlashGroup);
		spawnFlash(0);

		game.dieSound = game.add.audio('dieSound');
		game.dieSound.volume = 0.5;
		game.dieSound.play();
	},
	update: function() {
		
		buldge();

		//esc key also goes back to play state
		if(game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)){
			game.sound.stopAll();
			// play game
			game.modeStartSound.play();
			if (game.currentMode == 0) {
				//game.state.start('Practice');
			}
			else if (game.currentMode == 1) {
				game.state.start('Mode1');
			}
			else if (game.currentMode == 2) {
				game.state.start('Mode2');
			}
			else if (game.currentMode == 3) {
				//game.state.start('Mode3');
			}
		}



		//esc key also goes back to main menu
		if(game.input.keyboard.justPressed(Phaser.Keyboard.ESC)){
			game.sound.stopAll();
			game.state.start("MainMenu");
		}


	
	}
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

