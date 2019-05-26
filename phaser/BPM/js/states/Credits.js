// define boot state and methods
var Credits = function(game) {};
Credits.prototype = {
	preload: function() {
		console.log('credits: preload');

		
	},
	create: function() {
		console.log('credits: create');

	},
	update: function() {

		//esc key also goes back to play state
		if(game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)){
			game.state.start("LogoScreen");
		}



		//esc key also goes back to main menu
		if(game.input.keyboard.justPressed(Phaser.Keyboard.ESC)){
			game.state.start("LogoScreen");
		}

	}
}
