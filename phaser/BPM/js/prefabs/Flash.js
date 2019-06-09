/*

	CMPM 120 and ARTG 120 - Spring 2019

	TEAM 16: THE WINGED BOYFRIENDS!
	Terrence DuBois, Brady Moore, Merita Lundstrom

	_______________________________
	|	 Final Project: B.P.M.    |
 	| (Bouncing Particle Madness) |
 	¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯
	 Github: https://github.com/terrydubois/120_FinalGame
	 Itch: https://kittynugget.itch.io/bpm-bouncing-particle-madness
*/

// bg Flash constructor
function Flash(game, key, frame, scale, rotation) {

	Phaser.Sprite.call(this, game, game.world.width / 2, game.world.height / 2, key, frame);

	// set other essential variables for this object
	this.anchor.set(0.5);
	this.scale.x = 1;
	this.scale.y = 1;
	this.rotation = rotation;
	this.alpha = 0.5;
}

Flash.prototype = Object.create(Phaser.Sprite.prototype);
Flash.prototype.constructor = Flash;

// override update function
Flash.prototype.update = function() {
	this.scale.x += 0.02;
	this.scale.y += 0.02;

	if (this.alpha > 0) {
		this.alpha -= 0.02;
	}
	else {
		this.destroy();
	}


}