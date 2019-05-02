// define preload state and methods
var Preload = function(game) {};
Preload.prototype = {
	preload: function() {
		console.log('Preload: preload');

		game.load.image('sky', 'assets/img/background.png');
	},
	create: function() {
		console.log('Preload: create');

		game.state.start("LogoScreen");
	},
	update: function() {

	}
}
