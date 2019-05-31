// define boot state and methods
var Credits = function(game) {};
Credits.prototype = {
	preload: function() {
		console.log('credits: preload');

		
	},
	create: function() {
		console.log('credits: create');
		game.add.sprite(0, 0, 'sky');
		credits = game.add.sprite(0, 0, 'credits');

	},
	update: function() {

		//esc key also goes back to play state
		if(game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)){
			game.state.start("MainMenu");
		}



		//esc key also goes back to main menu
		if(game.input.keyboard.justPressed(Phaser.Keyboard.ESC)){
			game.state.start("MainMenu");
		}

	}
}
