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
		gameover.scale.setTo(0.5);

	},
	update: function(){


		// game over text
		scoreText = game.add.text(game.world.width/2+100,game.world.height/2-35,highscore,{ fontSize: '96px',fill:'#FFCC33',fontStyle: 'italic'});


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