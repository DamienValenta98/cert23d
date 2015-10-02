var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var bg = document.createElement("img");
bg.src = "bg.jpg"

var background	= document.createElement("img");
background.src = "background.jpg"

var win_background	= document.createElement("img");
win_background.src = "background.jpg"

var death_background	= document.createElement("img");
death_background.src = "background.jpg"



var startFrameMillis = Date.now();
var endFrameMillis = Date.now();

var heart = document.createElement("img");
heart.src = "heart.png"

var STATE_SPLASH = 0;
var STATE_GAME = 1;
var STATE_GAMEOVER = 2;
var STATE_GAMEWIN = 3;
var splashTimer = 4;
var gameState = STATE_SPLASH;



var score = 0;
var lives = 3;

var ENEMY_MAXDX = METER * 5;
var ENEMY_ACCEL = ENEMY_MAXDX * 2;

var enemies = [];

var LAYER_COUNT = 3;
var LAYER_BACKGROUND = 0;
var LAYER_PLATFORMS = 1;
var LAYER_LADDERS = 2;

var LAYER_OBJECT_ENEMIES = 3;
var LAYER_OBJECT_TRIGGERS = 4;

var GAME_OVER;
/*
function lose();
{
	context.fillStyle = "yellow";
	context.font="32px Arial";
	var youlose = "GAME OVER";
	context.fillText(youlose, SCREEN_WIDTH - 170, 35);
}
*/


function runSplash(deltaTime)
{
	context.fillStyle = "#ccc";		
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.drawImage(background, 0, 0, canvas.width, canvas.height)
	
	context.fillStyle = "#ccc";
	context.font = "24px Arial";
	context.fillText("Lets do this!", 220, 200);
	
	context.font = "17px Arial";
	context.fillText("Press Enter To PLAY!", 216, 250);
	
	if(keyboard.isKeyDown(keyboard.KEY_ENTER) && (gameState == STATE_SPLASH))
	{
		gameState = STATE_GAME;
		return;
	}
}

function runGame(deltaTime)
{
	for(var i=0; i < enemies.length; i++)
	{
		enemies[i].update(deltaTime);
	}
	
	//lives
	for (var i = 0; i < lives; i++)
	{
		context.drawImage(heart, 20 + ((heart.width+2)*i),10);
	}
	if(this.lives < 0)
	{
		this.x = this.respawn_x;
		this.y = this.respawn_y;
		this.lives --;
	}
		
	
	context.fillStyle = "#ccc";
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.drawImage(bg, 0, 0, canvas.width, canvas.height);
	
	var wanted_cam_x;
	var wanted_cam_y;
	
	wanted_cam_x = player.x - SCREEN_WIDTH/2;
	wanted_cam_y = player.y - SCREEN_HEIGHT/2;
	
	if(wanted_cam_x < 0)
		wanted_cam_x = 0;
	if(wanted_cam_y < 0)
		wanted_cam_y = 0;
	
	if(wanted_cam_x > MAP.tw * TILE - SCREEN_WIDTH)
		wanted_cam_x = MAP.tw * TILE - SCREEN_WIDTH;
	if(wanted_cam_y  > MAP.th * TILE - SCREEN_HEIGHT)
		wanted_cam_y = MAP.th * TILE - SCREEN_HEIGHT;
	
	cam_x = Math.floor(lerp(0.5, cam_x, wanted_cam_x));
	cam_y = Math.floor(lerp(0.5, cam_y, wanted_cam_y));
	
	drawMap(cam_x, cam_y);
	
	
	player.update(deltaTime);
	player.draw(cam_x, cam_y);
	
	/*
	for(var i=0; i < enemies.length; i++)
	{
		enemies[i].draw(cam_x, cam_y);
	}
	*/
	
	example_emitter.update(deltaTime);
		example_emitter.draw(cam_x, cam_y);
	
		// update the frame counter
	fpsTime += deltaTime;
	fpsCount++;
	if(fpsTime >= 1)
	{
		fpsTime -= 1;
		fps = fpsCount;
		fpsCount = 0;
	}
	
	// draw the FPS
	context.fillStyle = "#f00";
	context.font="14px Arial";
	context.fillText("FPS: " + fps, 5, 20, 100);
}

function runGameOver(deltaTime)
{
	context.fillStyle = "#ccc";		
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.drawImage(death_background, 0, 0, canvas.width, canvas.height)
	
	context.font = "40px Arial";
	context.fillStyle = "white";
	context.fillText("GAME OVER", 200, 200);
	
	context.font = "20px Arial";
	context.fillStyle = "white";
	context.fillText("You got wrecked!", 230, 220);
	
	context.font = "15px Arial";
	context.fillStyle = "white";
	context.fillText("Press R to Restart", 260, 250);
	
	if(keyboard.isKeyDown(keyboard.KEY_R) && (gameState == STATE_GAMEOVER))
		{
			gameState = STATE_GAME;
			player.isDead = false;
			player.lives = 4;
			return;
		}
}

function runGameWin(deltaTime)
{
	context.fillStyle = "#ccc";		
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.drawImage(win_background, 0, 0, canvas.width, canvas.height)
	
	context.font = "40px Arial";
	context.fillStyle = "white";
	context.fillText("You won!", 240, 200);
	
	context.font = "15px Arial";
	context.fillStyle = "white";
	context.fillText("Press R to Restart", 260, 250);
	
	if(keyboard.isKeyDown(keyboard.KEY_R) && (gameState == STATE_GAMEWIN))
		{
			gameState = STATE_GAME;
			player.isDead = false;
			player.lives = 4;
			return;
		}
}



function lerp(value, min, max)
{
	return value * (max - min) + min;
	
}

function getDeltaTime()
{
	endFrameMillis = startFrameMillis;
	startFrameMillis = Date.now();

	var deltaTime = (startFrameMillis - endFrameMillis) * 0.001;
	
	if(deltaTime > 1)
		deltaTime = 1;
		
	return deltaTime;
}

var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;

var background_sound = new Howl(
{
	urls: ["background.ogg"],
	loop: true, 
	buffer: true,
	volume: 0.5
	
});

background_sound.play();


var fps = 0;
var fpsCount = 0;
var fpsTime = 0;

enemies[0] = new Enemy();
enemies.x = TILE * 10;
enemies.y = TILE * 7;


var return_cells = [];
function initialize(input_level)
{
	//enemies
	idx = 0;
	for(var y = 0; y < level.layers[LAYER_OBJECT_ENEMIES].height; y++) 
	{
		for(var x = 0; x < level.layers[LAYER_OBJECT_ENEMIES].width; x++)
		{
			if(level.layers[LAYER_OBJECT_ENEMIES].data[idx] != 0)
			{
				var px = tileToPixel(x);
				var py = tileToPixel(y);
				var e = new Enemy(px,py);
				enemies.push(e);
			}
			idx++;
		}
	}
	var return_cells = [];
	
	for (var layerIdx = 0; layerIdx < LAYER_COUNT; layerIdx++)
	{
			return_cells[layerIdx] = [];
			var idx = 0;
			for (var y = 0; y < input_level.layers[layerIdx].height; y++)
			{
				return_cells[layerIdx][y] = []
				for (var x = 0; x < input_level.layers[layerIdx].width; x++)
				{
					if (input_level.layers[layerIdx].data[idx] != 0)
					{
						return_cells[layerIdx][y][x] = 1;
						return_cells[layerIdx][y][x+1] = 1;
						if (y != 0)
						{
						return_cells[layerIdx][y-1][x+1] = 1;
						return_cells[layerIdx][y-1][x] = 1;
						}
						
					}
					else if (return_cells[layerIdx][y][x] = 0)
					{
						return_cells[layerIdx][y][x] = 0;
					}
					idx++;
				}
			}
	}
	return return_cells;
}

var cells = initialize(level);

var keyboard = new Keyboard();
var player = new Player();

var cam_x = 0;
var cam_y = 0;

var example_emitter = new Emitter();
example_emitter.initialize(200, 200, 1, 0, 3000,  0.5, 100, 0.5, true);


function run()
{
	
	var deltaTime = getDeltaTime();
	
	switch(gameState)
	{
		case STATE_SPLASH:
			runSplash(deltaTime);
			break;
		case STATE_GAME:
			runGame(deltaTime);
			break;
		case STATE_GAMEOVER:
			runGameOver(deltaTime);
			break;
		case STATE_GAMEWIN:
			runGameWin(deltaTime);
			break;
	}
	
}

function update() 
{ 

   if(this.lives < 1){
	   this.x = this.respawn_x;
	this.y = this.respawn_y;
	this.lives --; 
   }
}

function restart()
{

  if(this.lives = 1); 
  {
    restart();
    return;
  }
}

(function() {
  var onEachFrame;
  if (window.requestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.requestAnimationFrame(_cb); }
      _cb();
    };
  } else if (window.mozRequestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.mozRequestAnimationFrame(_cb); }
      _cb();
    };
  } else {
    onEachFrame = function(cb) {
      setInterval(cb, 1000 / 60);
    }
  }
  
  window.onEachFrame = onEachFrame;
})();

window.onEachFrame(run);