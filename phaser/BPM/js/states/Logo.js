// define logo state and methods
var LogoScreen = function(game) {};
LogoScreen.prototype = {
	preload: function() {
		console.log('LogoScreen: preload');

	},
	create: function() {
		console.log('LogoScreen: create');
		game.add.sprite(0,0,'sky');
		game.menu = game.add.sprite(0,0,'title');
		game.modes = game.add.sprite (0,0,'title');
		game.modes.frameName = 'titlep';
		game.arrows = game.add.sprite(0,0,'title');


		game.choice = 0;
		game.playingr = false;
		game.playingl = false;
		game.mode = 0;
		game.currentMode = 0;


		//game.arrows.animations.add('left', ['titlel1','titlel2','titlel3','titlel4','titlel5','titlel6','titlel5','titlel4','titlel3','titlel2','titlel1'],30,false);
		//game.arrows.animations.add('right', ['titler1','titler2','titler3','titler4','titler5','titler6','titler5','titler4','titler3','titler2','titler1'],30,false);

		//game.arrows.animations.play('left');

		//game.instructionText = game.add.text(game.world.width / 2, game.world.height - 25, "UP and DOWN arrows to move!", { fontSize: '24px',fill:'#4669FE',fontStyle: 'italic'});
		//game.instructionText.anchor.setTo(0.5);

		game.song1 = game.add.audio('BETA');

		game.state.start('MainMenu');
		

	},



	update: function() {

	}
}
	