// bg Flash constructor
function Flash(game, key, frame, scale, rotation) {

	Phaser.Sprite.call(this, game, 0, 0, key, frame);

	// set other essential variables for this object
	this.anchor.set(0);
	this.scale.x = 1;
	this.scale.y = 1;
	this.rotation = rotation;
	this.alpha = 0.5;
}

Flash.prototype = Object.create(Phaser.Sprite.prototype);
Flash.prototype.constructor = Flash;

// override update function
Flash.prototype.update = function() {

	if (this.alpha > 0) {
		this.alpha -= 0.02;
	}
	else {
		this.destroy();
	}
	
}