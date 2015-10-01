//particle 
var Particle = function()
{
	this.x = 0;
	this.y = 0;
	
	this.vel_x = 0;
	this.vel_y = 0;
	
	this.life_time = 0.5;
	this.cur_life_time = 0.0;
}



//emitter
var Emitter = function()
{
	this.x = 0;
	this.y = 0; 
	
	this.image = document.createElement("img");
	this.image.src = "particle.png";
	
	this.dir_x = 0.0;
	this.dir_y = 1.0;
	
	this.particles = [];
	
	this.pps = 0;
	this.particles_to_spawn = 0.0
	
	this.cur_particle_index = 0;
}

Emitter.prototype.initialize = function(x, y, dir_x, dir_y, max_particles, life_time, pps)
{
	this.x = x;
	this.y = y;
	this.dir_x = dir_x;
	this.dir_y = dir_y;
	
	this.pps = pps;
	
	for(var idx = 0; idx < max_particles; idx++)
	{
		this.particles[idx] = new.particle();
		this.particles[idx].life_time = life_time;
	}
}

Emitter.prototype.update = function(deltaTime);
{
	this.particles_to_spawn += pps * deltaTime;
	
	while (math.Floor(this.particles_to_spawn) > 0)
	{
		this.particles[this.cur_particle_index].x = this.x;
		this.particles[this.cur_particle_index].y = this.y;
		
		this.particles[this.cur_particle_index].cur_life_time = this.particles[this.cur_particle_index].life_time;
		
		this.particles[this.cur_particle_index].vel_x = this.dir_x;
		this.particles[this.cur_particle_index].vel_y = this.dir_y;
		
		
		this.cur_particle_index ++;
		if(this.cur_particle_index >= this.particles.length)
			this.cur_particle_index = 0;
		this.particles_to_spawn --;
	}
}
/*
	for(var idx = 0; idx< this.particles.length; idx++)	
	{
		if(this.particles[idx].cur_life_time > 0)
		{
			context.drawImage(this.image, this.particles[idx].x, this.particles[idx].y);
		}
	}
}
*/

	

Emitter.prototype.draw = function(cam_x, cam_y)
{
	for(var idx = 0; idx< this.particles.length; idx++)	
	{
		if(this.particles[idx].cur_life_time > 0)
		{
			context.drawImage(this.image, this.particles[idx].x, this.particles[idx].y);
		}
	}
}	