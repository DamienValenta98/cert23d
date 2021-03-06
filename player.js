var METER = TILE;

var GRAVITY = METER * 9.8 * 3;

var MAXDX = METER * 10;
var MAXDY = METER * 15;

var ACCEL = MAXDX * 2;
var FRICTION = MAXDX * 6;

var JUMP = METER * 1500;

var LEFT = 0;
var RIGHT = 1;

var ANIM_IDLE_LEFT = 0;
var ANIM_JUMP_LEFT = 1;
var ANIM_WALK_LEFT = 2;
var ANIM_SHOOT_LEFT = 3;
var ANIM_SHOOTWALK_LEFT = 4;
var ANIM_IDLE_RIGHT = 5;
var ANIM_JUMP_RIGHT = 6;
var ANIM_WALK_RIGHT = 7;
var ANIM_SHOOT_RIGHT = 8;
var ANIM_SHOOTWALK_RIGHT = 9;

var ANIM_MAX = 10;



var Player = function() 
{
	
	//this.image= document.createElement("img");
	this.sprite= new Sprite("ChuckNorris.png");
	//idle left
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
	[0, 1, 2, 3, 4, 5, 6, 7]);
	//jump left
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
	[8, 9, 10, 11, 12]);
	//walk left
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
	[13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]);
	//shoot left
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
	[28]);
	//shoot walk left
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
	[27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40]);
	
	//idle right
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
	[52, 53, 54, 55, 56, 57, 58, 59]);
	//jump right
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
	[60, 61, 62, 63, 64]);
	//walk right
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
	[65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78]);
	//shoot right
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
	[80]);
	//shoot walk right
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
	[79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93]);
	
	for(var i=0; i<ANIM_MAX; i++)
	{
		this.sprite.setAnimationOffset(i, -55, -87);
	}
	
	
	this.x= 0 * TILE;
	this.y= 9 * TILE;
	
	this.width = 159;
	this.height = 163;
	
	this.velocity_x = 0;
	this.velocity_y = 0;
	
	this.falling = true;
	this.jumping = true;
	this.shooting = true;
	
	this.direction = LEFT;
	//this.direction = RIGHT;
	this.lives = 3;
	this.respawn_x = this.x;
	this.respawn_y = this.y;
	
	this.lives_image = document.createElement("img");
	this.lives_image.src = "heart.png";
	
	this.max_bullets = 75;
	this.bullets = [];
	this.cur_bullet_idx = 0;
	for(var idx = 0; idx < this.max_bullets; idx++)
	{
		this.bullets[idx] = new Bullet();
	}
	this.shoot_cooldown = 0.0;
	this.shoot_timer = 0.75;
	
	var self = this;
	this.is_jump_sfx_playing = false;
	
	this.jump_sfx = new Howl(
	{
		urls: ["hup.wav"],
		buffer: true,
		volume: 1,
		onend: function()
		{
				self.is_jump_sfx_playing = false;
		}
	});
	
	this.is_shoot_sfx_playing = false;
	this.shoot_sfx = new Howl({
		urls: ["fireEffect.ogg"],
		buffer: true,
		volume: 1,
		onend: function()
		{
			self.is_shoot_sfx_playing = false;
		}

	});
	
}	


Player.prototype.update = function(deltaTime)
{	
	this.sprite.update(deltaTime);

	var left = false;
	var right = false;
	var jump = false;
	
	if (keyboard.isKeyDown(keyboard.KEY_LEFT))
	{
		left = true;
		this.direction = LEFT;
		if (this.sprite.currentAnimation != ANIM_WALK_LEFT
			&& this.sprite.currentAnimation != ANIM_SHOOT_LEFT
			&& !this.jumping)
			this.sprite.setAnimation(ANIM_WALK_LEFT);
	}
	else if (keyboard.isKeyDown(keyboard.KEY_RIGHT))
	{
		right = true;
		this.direction = RIGHT;
		if (this.sprite.currentAnimation != ANIM_WALK_RIGHT
			&& this.sprite.currentAnimation != ANIM_SHOOT_RIGHT
			&& !this.jumping)
			this.sprite.setAnimation(ANIM_WALK_RIGHT);
	}
	else
	{
		if (!this.jumping && !this.falling && !this.shooting)
		{
			if (this.direction == LEFT)
			{
				if (this.sprite.currentAnimation != ANIM_IDLE_LEFT)
					this.sprite.setAnimation(ANIM_IDLE_LEFT);
			}
			else
			{
				if (this.sprite.currentAnimation != ANIM_IDLE_RIGHT)
					this.sprite.setAnimation(ANIM_IDLE_RIGHT);
			}
		}
	}
	
	if (keyboard.isKeyDown(keyboard.KEY_SPACE))
	{
		jump = true;
		if (left) 
			this.sprite.setAnimation(ANIM_JUMP_LEFT);
		
		if (right)
			this.sprite.setAnimation(ANIM_JUMP_RIGHT);
		

	}
	
	if (keyboard.isKeyDown(keyboard.KEY_A))
	{
		if(left == false)
		{
			this.direction == LEFT
			if (this.sprite.currentAnimation != ANIM_SHOOT_RIGHT)
			this.sprite.setAnimation(ANIM_SHOOT_LEFT);
		}	
		else if(left == true)
		{
			this.direction == LEFT
			if (this.sprite.currentAnimation != ANIM_SHOOTWALK_LEFT)
			this.sprite.setAnimation(ANIM_SHOOTWALK_LEFT);
		}	
		if(this.shoot_cooldown <= 0)
		{
			if(!this.is_shoot_sfx_playing)
			{
				this.shoot_sfx
				this.shoot_sfx.play();
				this.is_shoot_sfx_playing = true;
			}
			var jitter = Math.random() * 0.2 - 0.1;
			if(this.direction == LEFT)	
				this.bullets[this.cur_bullet_idx].fire(this.x, this.y, - 1, jitter);
			else
				this.bullets[this.cur_bullet_idx].fire(this.x, this.y, 1, jitter);
			
			
			this.shoot_cooldown = this.shoot_timer;
			this.cur_bullet_idx ++;
			if(this.cur_bullet_idx >= this.max_bullets)
				this.cur_bullet_idx = 0;		
		}
	}
	
	if (keyboard.isKeyDown(keyboard.KEY_D))
	{
		if(right == false)
		{
			this.direction == RIGHT
			if (this.sprite.currentAnimation != ANIM_SHOOT_RIGHT)
			this.sprite.setAnimation(ANIM_SHOOT_RIGHT);
		}	
		else if(right == true)
		{
			this.direction == RIGHT
			if (this.sprite.currentAnimation != ANIM_SHOOTWALK_RIGHT)
			this.sprite.setAnimation(ANIM_SHOOTWALK_RIGHT);
		}	
		if(this.shoot_cooldown <= 0)
		{
			if(!this.is_shoot_sfx_playing)
			{
				this.shoot_sfx
				this.shoot_sfx.play();
				this.is_shoot_sfx_playing = true;
			}
			var jitter = Math.random() * 0.2 - 0.1;
			if(this.direction == LEFT)	
				this.bullets[this.cur_bullet_idx].fire(this.x, this.y, - 1, jitter);
			else
				this.bullets[this.cur_bullet_idx].fire(this.x, this.y, 1, jitter);
			
			
			this.shoot_cooldown = this.shoot_timer;
			this.cur_bullet_idx ++;
			if(this.cur_bullet_idx >= this.max_bullets)
				this.cur_bullet_idx = 0;
			
		}
	}
	if(this.shoot_cooldown > 0)
		this.shoot_cooldown -= deltaTime;
	
	for(var i = 0; i < this.max_bullets; i++)
	{
		this.bullets[i].update(deltaTime);
	}

	
	var wasleft = this.velocity_x < 0;
	var wasright = this.velocity_x > 0;
	var falling = this.falling;
	var ddx = 0;
	var ddy = GRAVITY;
	
	if (left)
		ddx = ddx - ACCEL;
	else if (wasleft)
		ddx = ddx + FRICTION;
	
	if (right)
		ddx = ddx + ACCEL
	else if (wasright)
		ddx = ddx - FRICTION;
	
	if (jump && !this.jumping && !falling)
	{
		this.jump_sfx.play();
		this.is_jump_sfx_playing = true;
		ddy = ddy - JUMP;
		this.jumping = true;
		if(this.direction == LEFT)
		{
			if(this.sprite.setAnimation != ANIM_JUMP_LEFT && !this.jumping)
				this.sprite.setAnimation = ANIM_JUMP_LEFT;
		}
		else
		{
			if(this.sprite.setAnimation != ANIM_JUMP_RIGHT && !this.jumping)
				this.sprite.setAnimation = ANIM_JUMP_RIGHT;
		}
	}

	this.x = Math.floor(this.x + (deltaTime * this.velocity_x)); 
	this.y = Math.floor(this.y + (deltaTime * this.velocity_y)); 
	this.velocity_x = bound(this.velocity_x + (deltaTime * ddx), -MAXDX, MAXDX);
	this.velocity_y = bound(this.velocity_y + (deltaTime * ddy), -MAXDY, MAXDY);
	
	if((wasleft && (this.velocity_x > 0)) ||
	(wasright && (this.velocity_x < 0)))
	{
		this.velocity_x = 0;
	}
	
	
	var tx = pixelToTile(this.x);
	var ty = pixelToTile(this.y);
	var nx = (this.x)%TILE;
	var ny = (this.y)%TILE;
	
	var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
	var cellright = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty);
	var celldown = cellAtTileCoord(LAYER_PLATFORMS, tx, ty + 1);
	var celldiag = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty + 1);
	
	if(this.velocity_y > 0)
	{
		if((celldown && !cell) || (celldiag && !cellright && nx))
		{
			this.y = tileToPixel(ty);
			this.velocity_y = 0;
			this.falling = false;
			this.jumping = false;
			ny = 0;
		}
	}
	else if (this.velocity_y < 0)
	{
		if ((cell && !celldown) || (cellright && !celldiag && nx))
		{
			this.y = tileToPixel(ty + 1);
			this.velocity_y = 0;
			cell = celldown;
			cellright = celldiag;
			ny = 0
	
		}
	}
	
	if(this.velocity_x > 0)
	{
		if((cellright && !cell) || (celldiag && !celldown && ny))
		{
			this.x = tileToPixel(tx);
			this.velocity_x = 0;
		}
	}
	else if(this.velocity_x < 0)
	{
		if ((cell && !cellright) || (celldown && !celldiag && ny))
		{
			this.x = tileToPixel(tx + 1);
			this.velocity_x = 0;
		}
	}
	if(this.y > MAP.th * TILE + 100)
	{
		this.x = this.respawn_x;
		this.y = this.respawn_y;
		this.lives --;
	}

}
Player.prototype.draw = function(_cam_x, _cam_y)
{
	//score
	context.fillStyle = "yellow";
	context.font= "32px Arial";
	var scoreText = "score:" + score;
	context.fillText(scoreText, SCREEN_WIDTH - 170, 35);
	
	this.sprite.draw(context, this.x -_cam_x, this.y -_cam_y);
	
	for(var idx = 0; idx < this.lives; idx++)
	{
		context.drawImage(this.lives_image, 40 + idx * (this.lives_image.width), 40);
	}
	
	for(var idx = 0; idx < this.max_bullets; idx++)
	{
		this.bullets[idx].draw(_cam_x, _cam_y);
	}
	
	//context.save();
		//context.translate(this.x - cam_x, this.y - cam_y);
		//context.drawImage(this.image, -55, -87);
	//context.restore();
}