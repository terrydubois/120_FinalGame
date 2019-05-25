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

		game.player = game.add.sprite(game.world.width/2,game.world.height/2+180,'player');
		game.player.anchor.setTo(.5);
		game.player.scale.setTo(1);

		game.player.animations.add('squiggle', [0,1,2,3,4,5,6,7,8,9],8,true);
		game.player.animations.play('squiggle');



		// save highscore to browser (credit to Nathan Altice's Paddle Parkour)
		var newHS = false;
		if (localStorage.getItem('highscore') == null) {
			
			// in this case, we don't have a saved browser highscore yet, so we set this score as the new highscore
			game.highScore = game.currentScore;
			localStorage.setItem('highscore', game.highScore.toString());
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

		// game over text
		game.scoreText = game.add.text(game.world.width / 2 + 80 ,(game.world.height / 2) - 115, game.currentScore+"  ", { fontSize: '80px',fill:'#FFCC33',fontStyle: 'italic'});
		game.highScoreText = game.add.text(game.world.width / 2 + 80 ,(game.world.height / 2) - 30, game.highScore+"  ", { fontSize: '80px',fill:'#FFCC33',fontStyle: 'italic'});


		if (newHS) {
			game.newHSText = game.add.text(game.world.width / 2 - 300 ,(game.world.height / 2) - 40, "NEW", { fontSize: '40px',fill:'#FFCC33',fontStyle: 'italic'});
		}
	},
	update: function(){
		


		//esc key also goes back to play state
		if(game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)){
			game.sound.stopAll();
			game.state.start("Play");
		}



		//esc key also goes back to main menu
		if(game.input.keyboard.justPressed(Phaser.Keyboard.ESC)){
			game.sound.stopAll();
			game.state.start("LogoScreen");
		}


	
	}
}