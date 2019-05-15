// define logo state and methods
var LogoScreen = function(game) {};
LogoScreen.prototype = {
	preload: function() {
		console.log('LogoScreen: preload');

	},
	create: function() {
		console.log('LogoScreen: create');
	game.add.sprite(0,0,'sky');
	var menu = game.add.sprite(0,0,'title');

	game.instructionText = game.add.text(game.world.width / 2, game.world.height - 25, "UP and DOWN arrows to move!", { fontSize: '24px',fill:'#4669FE',fontStyle: 'italic'});
	game.instructionText.anchor.setTo(0.5);


	},
	update: function() {
		
		//start game
		if(game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)){
			    			game.sound.stopAll();
			game.state.start('Play');
		}
	}
}
