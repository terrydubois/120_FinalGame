/*

	CMPM 120 - Spring 2019

	TEAM 16: THE WINGED BOYFRIENDS!
	Terrence DuBois, Brady Moore, Merita Lundstrom

	_______________________________
	|	 Final Project: B.P.M.    |
 	| (Bouncing Particle Madness) |
 	¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯
 	chaning github version
*/

var game = new Phaser.Game(1000, 600, Phaser.AUTO);


var highscore;
game.starsColl = 0;
game.debugControls = false;

var emitter;

// add states to StateManager
game.state.add('Boot', Boot);
game.state.add('Preload', Preload);
game.state.add('LogoScreen', LogoScreen);
game.state.add('MainMenu', MainMenu);
game.state.add('Mode1', Mode1);
game.state.add('GameOver', GameOver);
game.state.add('Credits', Credits);

// start on Logo
game.state.start('Boot');

function saveStarsColl() {

	// save highscore to browser (credit to Nathan Altice's Paddle Parkour)
	if (localStorage.getItem('starsColl') == null) {
		// in this case, we don't have a saved browser highscore yet, so we set this score as the new highscore
		game.starsColl = 0;
		localStorage.setItem('starsColl', game.starsColl.toString());
		console.log("first time playing game, setting starsColl to 0");
	}
	else {
		// in this case, we have a variable saved to the browser "starsColl"
		// so we get that and compare it to the player's current stars

		game.starsCollFromBrowser = parseInt(localStorage.getItem('starsColl'));

		if (game.starsColl > game.starsCollFromBrowser) {
			localStorage.setItem('starsColl', game.starsColl.toString());
		}
		else {
			game.starsColl = game.starsCollFromBrowser;
		}
		console.log("loading in previous stars");
	}
}