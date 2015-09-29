var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var startFrameMillis = Date.now();
var endFrameMillis = Date.now();

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


var fps = 0;
var fpsCount = 0;
var fpsTime = 0;

var return_cells = [];
function initialize(input_level)
{
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

function run()
{
	context.fillStyle = "#ccc";
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	var deltaTime = getDeltaTime();
	
	cam_x = player.x - SCREEN_WIDTH / 2;
	cam_y = player.y - SCREEN_HEIGHT / 2;
	
	if(cam_x < 0)
		cam_x = 0;
	if(cam_y < 0)
		cam_y = 0;
	
	if(cam_x > MAP.tw * TILE - SCREEN_WIDTH)
		cam_x > MAP.tw * TILE - SCREEN_WIDTH;
	if(cam_y  > MAP.th * TILE - SCREEN_HEIGHT)
		cam_y > MAP.th * TILE - SCREEN_HEIGHT;
	
	drawMap(cam_x, cam_y);
	
	player.update(deltaTime);
	player.draw(cam_x, cam_y);
	
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