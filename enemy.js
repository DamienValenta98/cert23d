var ANIM_IDLE_LEFT = 0;
var ANIM_MOVE_LEFT = 1;
var ANIM_MOVE_RIGHT = 2;
var ANIM_MAX = 3;


var Enemy = function(x, y)
{	

this.enemies = [];
	/*
	//enemy
	this.sprite = new Sprite("bat.png");
	//idleleft
	this.sprite.buildAnimation(2, 1, 88, 94, 0.3,
	[0,1]);
	
	//moveleft
	this.sprite.buildAnimation(2, 1, 88, 94, 0.3,
	[0,1]);
	
	//moveright
	this.sprite.buildAnimation(2, 1, 88, 94, 0.3,
	[0,1]);
	
	for(var i=0 i< ANIM_MAX; i++)
	{
	this.sprite.setAnimationOffset(0, -35, -40);
	}
	*/
	
	this.sprite = new Sprite("bat.png");
	this.sprite.buildAnimation(2, 1, 88, 94, 0.3, [0,1]);
	this.sprite.setAnimationOffset(0, -35, -40);
	
	this.x = 6 * TILE;
	this.y = 10 * TILE;
	
	this.vel_x = 0;
	this.vel_y = 0;
	
	this.moveRight = true;
	this.pause = 0;
}

Enemy.prototype.update = function(dt)
{
	this.sprite.update(dt);
	
	if(this.pause > 0)
	{
		this.pause -= dt;
	}
	else
	{
		var ddx = 0;    //acceleration
		
		var tx = pixelToTile(this.x);
		var ty = pixelToTile(this.y);
		var nx = (this.x)%TILE;
		var ny = (this.y)%TILE;
		var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
		var cellright = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty);
		var celldown = cellAtTileCoord(LAYER_PLATFORMS, tx, ty + 1);
		var celldiag = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty + 1);
		
		if(this.moveRight)
		{
			if(celldiag && !cellright)
			{
				ddx = ddx + ENEMY_ACCEL; //right
			}
			else
			{
				this.vel_x = 0;
				this.moveRight = false;
				this.pause = 0.5;
			}
		
		}
		if(!this.moveRight)
		{
			if(celldown && !cell)
			{
				ddx = ddx - ENEMY_ACCEL;
			}
			else
			{
				this.vel_x = 0;
				this.moveRight = true;
				this.pause = 0.5;
			}
		}
		this.x = Math.floor(this.x +(dt * this.vel_x));
		this.vel_x = bound(this.vel_x +(dt * ddx), -ENEMY_MAXDX, ENEMY_MAXDX);
	}
}

Enemy.prototype.draw = function(cam_x, cam_y)
{
	for(var i=0; i < enemies.length; i++)
	{
		context.drawImage[i](this.Enemy, cam_x, cam_y);
		this.enemies[i].draw(this.Enemy, cam_x, cam_y);
	}
	
}