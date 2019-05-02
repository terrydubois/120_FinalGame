// define logo state and methods
var LogoScreen = function(game) {};
LogoScreen.prototype = {
	preload: function() {
		console.log('LogoScreen: preload');

	},
	create: function() {
		console.log('LogoScreen: create');
	game.add.sprite(0,0,'sky');
	},
	update: function() {
		
		//start game
		if(game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)){
			    			game.sound.stopAll();
			game.state.start('Play');
		}
		
	//wow
	}
}
