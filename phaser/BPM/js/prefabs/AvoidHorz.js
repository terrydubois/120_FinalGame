// avoid constructor
function AvoidHorz(game, key, frame, scale, rotation, goingUp, ySpeed) {

	this.goingUp = goingUp;

	yPos = Math.random() * game.world.height;
	yPos = Phaser.Math.clamp(yPos, game.posTop + 50, game.posBottom - 50);

	var yPosTries = 0;
	while (Math.abs(yPos - game.lastSpawnY) < 45 && yPosTries < 10) {
		yPos = Math.random() * game.world.height;
		yPos = Phaser.Math.clamp(yPos, game.posTop + 50, game.posBottom - 50);
		yPosTries++;
	}
	game.lastSpawnY = yPos;
	//console.log("NEW LASTSPAWNX: " + game.lastSpawnX);


	if (goingUp) {
		xPos = game.world.width + 100;
		this.xVelocity = -ySpeed; 
	}
	else {
		xPos = -100;
		this.xVelocity = ySpeed; 	
	}

		this.colliderEmitter = game.add.emitter(xPos,yPos, 50);
		this.colliderEmitter.minParticleScale = 0.2;
		this.colliderEmitter.maxParticleScale = 0.5;

	if(key == 'heart'){

			this.colliderEmitter.makeParticles('heartP');
	}

	else if(key == 'plus'){

			this.colliderEmitter.makeParticles('plusP');
	}

	else if(key == 'star'){

			this.colliderEmitter.makeParticles('starP');
	}
	else{
			this.colliderEmitter.makeParticles('skullP');

	}

	
		this.colliderEmitter.setAlpha(1, 0, 500);
    	this.colliderEmitter.start(false, 5000, 250);



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
	this.star = (key =='star');




	game.physics.enable(this);
}

AvoidHorz.prototype = Object.create(Phaser.Sprite.prototype);
AvoidHorz.prototype.constructor = AvoidHorz;

// override update function
AvoidHorz.prototype.update = function() {

	// make this move forward
	this.body.velocity.x = this.xVelocity;

	this.colliderEmitter.x = this.x;


	// destroy this obstacle if it is out of bounds
	if (this.goingUp && this.x < -100) {
		this.destroy();
			this.colliderEmitter.destroy();
	}
	else if (!this.goingUp && this.x > game.world.width + 100) {
		this.destroy();
		this.colliderEmitter.destroy();
	}


	if (Math.abs(game.player.x - this.x) < this.collisionRad + game.playerCollisionRad
	&& Math.abs(game.player.y - this.y) < this.collisionRad + game.playerCollisionRad
	&& !game.hasHitPlayer && !this.hasHitPlayer) {
		
		this.hasHitPlayer = true;
		this.destroy();
		this.colliderEmitter.destroy();

		if (this.heart) {
			console.log("collision with heart");
			if(game.currentHearts == 7 ){
				game.currentScore += 10 * game.heartMulti;
				game.scoreAddText = new ScoreAddText(game, '', '', 0, 0, this.x, this.y, '+'+ 10*game.heartMulti +'  ');
				game.add.existing(game.scoreAddText);
				game.heartMulti += 1 ;
			}
			game.currentHearts++;
			if(game.sfxOn){
				game.hitHeartSound.play('', 0, 0.5, false);
			}
			spawnFlash(2);
		}
		else if (this.plus) {
			console.log("collision with levelup");
			game.currentPlussesToLevelUp--;
			game.currentScore += 10;
			if (game.currentPlussesToLevelUp > 0) {
				if(game.sfxOn){
					game.hitPlusSound.play('', 0, 0.5, false);
				}
			}
			spawnFlash(1);
			game.scoreAddText = new ScoreAddText(game, '', '', 0, 0, this.x, this.y, '+10  ');
			game.add.existing(game.scoreAddText);
		}
		else if (this.star) {
			console.log("collision with star");

			game.starsColl++;
			saveStarsColl();
			game.currentScore += 50;
			if(game.sfxOn){
				game.hitStarSound.play('', 0, 0.5, false);
			}
			spawnFlash(3);
			game.scoreAddText = new ScoreAddText(game, '', '', 0, 0, this.x, this.y, '+50  ');
			game.add.existing(game.scoreAddText);
		}
		else {
			console.log("collision with skull");
			game.hasHitPlayer = true;
			game.heartMulti = 1;
			game.currentHearts--;
			if(game.sfxOn){
				game.hitEnemySound.play('', 0, 0.3, false);
			}
			spawnFlash(0);
		}
	}
}