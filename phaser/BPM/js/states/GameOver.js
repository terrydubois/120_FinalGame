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

		//scoreText = game.add.text(game.world.width/2-300,game.world.height/2-65,"GAME OVER",{ fontSize: '108px',fill:'#000'});


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