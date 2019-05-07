// avoid constructor
function Avoid(game, key, frame, scale, rotation, goingUp, ySpeed) {

	this.goingUp = goingUp;

	xPos = Math.random() * game.world.width;
	xPos = Phaser.Math.clamp(xPos, game.posLeft + 150, game.posRight - 150);

	var xPosTries = 0;
	while (Math.abs(xPos - game.lastSpawnX) < 60 && xPosTries < 10) {
		xPos = Math.random() * game.world.width;
		xPos = Phaser.Math.clamp(xPos, game.posLeft + 150, game.posRight - 150);
		xPosTries++;
	}
	game.lastSpawnX = xPos;
	console.log("NEW LASTSPAWNX: " + game.lastSpawnX);


	if (goingUp) {
		yPos = game.world.height + 100;
		this.yVelocity = -ySpeed; 
	}
	else {
		yPos = -100;
		this.yVelocity = ySpeed; 	
	}

	Phaser.Sprite.call(this, game, xPos, yPos, key, frame);

	// set other essential variables for this object
	this.anchor.set(0.5);
	this.scale.x = scale;
	this.scale.y = scale;
	this.rotation = rotation;
	this.alpha = 1;

	this.collisionRad = this.width / 2;
	this.hasHitPlayer = false;

	this.heart = (key == 'heart');
	this.plus = (key == 'plus');

	game.physics.enable(this);
}

Avoid.prototype = Object.create(Phaser.Sprite.prototype);
Avoid.prototype.constructor = Avoid;

// override update function
Avoid.prototype.update = function() {

	// make this move forward
	this.body.velocity.y = this.yVelocity;


	// destroy this obstacle if it is out of bounds
	if (this.goingUp && this.y < -100) {
		this.kill();
	}
	else if (!this.goingUp && this.y > game.world.height + 100) {
		this.kill();
	}


	if (Math.abs(game.player.x - this.x) < this.collisionRad + game.playerCollisionRad
	&& Math.abs(game.player.y - this.y) < this.collisionRad + game.playerCollisionRad
	&& !this.hasHitPlayer) {
		
		this.hasHitPlayer = true;
		this.kill();

		if (this.heart) {
			console.log("collision with heart");
			game.currentHearts++;
		}
		else if (this.plus) {
			console.log("collision with levelup");
			game.plussesToLevelUp--;
		}
		else {
			console.log("collision with skull");
			game.currentHearts--;
		}
	}
}