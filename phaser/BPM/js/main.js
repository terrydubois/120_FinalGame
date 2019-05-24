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
game.state.add('Play', Play);
game.state.add('GameOver', GameOver);

// start on Logo
game.state.start('Boot');