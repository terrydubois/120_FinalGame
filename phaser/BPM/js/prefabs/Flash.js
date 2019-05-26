// bg Flash constructor
function Flash(game, key, frame, scale, rotation) {

	Phaser.Sprite.call(this, game, game.world.width / 2, game.world.height / 2, key, frame);

	// set other essential variables for this object
	this.anchor.set(0.5);
	this.scale.x = scale;
	this.scale.y = scale;
	this.rotation = rotation;
	this.alpha = 1;
}

Flash.prototype = Object.create(Phaser.Sprite.prototype);
Flash.prototype.constructor = Avoid;

// override update function
Flash.prototype.update = function() {

	if (this.alpha > 0) {
		this.alpha -= 0.01;
	}
	else {
		this.destroy();
	}
}