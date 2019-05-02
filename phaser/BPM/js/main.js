/*
	CMPM 120 - Spring 2019
	Terrence DuBois

	Endless Runner: VIBE 206

	Technical achievement:
		I am happy with how smooth all of the movements and transitions in this project turned out.
		I tried my hardest to add motion to all of the UI elements of the game, which often took
		a bit of extra coding time. Making the oncoming objects move in properly was difficult, because
		I had to play with their acceleration to mimic perspective.
	Artistic achievement:
		I was able to stick with my original goal of having a pseudo-3D visual style to the game.
		I am really happy with the color scheme and custom vector art, both of which took me a while
		to create in Illustrator. 

*/

var game = new Phaser.Game(1000, 600, Phaser.AUTO);

// add states to StateManager
game.state.add('Boot', Boot);

// start on Logo
game.state.start('Boot');