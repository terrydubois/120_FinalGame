// bg Circle constructor
function BGCircle(game, key, frame, scale, rotation) {

	Phaser.Sprite.call(this, game, game.world.width / 2, game.world.height / 2, key, frame);

	// set other essential variables for this object
	this.anchor.set(0.5);
	this.scale.x = scale;
	this.scale.y = scale;
	this.rotation = rotation;
	this.alpha = 1;
}

BGCircle.prototype = Object.create(Phaser.Sprite.prototype);
BGCircle.prototype.constructor = Avoid;

// override update function
BGCircle.prototype.update = function() {

	if (this.scale.x < 1) {
		this.scale.x += 0.005;
		this.scale.y = this.scale.x;
	}
	else {
		this.destroy();
	}

	this.angle = game.bgAngle;
}