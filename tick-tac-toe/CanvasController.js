var CanvasController = function(canvas) {
	
	this.drawBorder = function(){
		// draw horizontal border
		var curLine = {
		  x : 0,
		  y : 0
		};
		for (var i = 0; i<= this.row; i++){          
			this.context.fillRect(curLine.x,curLine.y,Config.CANVAS_WIDTH,Config.LINE_WIDTH);
			curLine.y += Config.LINE_WIDTH + Config.TILE_WIDTH;      
		}
		// draw vertical border
		curLine = {
		  x : 0,
		  y : 0
		};
		for (var j = 0; j<= this.column; j++){          
		  this.context.fillRect(curLine.x,curLine.y,Config.LINE_WIDTH, Config.CANVAS_WIDTH);
		  curLine.x += Config.LINE_WIDTH + Config.TILE_WIDTH;      
		}
	}
	
	this.getMousePos = function(event) {
		var rect = this.canvas.getBoundingClientRect();
		return {
		x: event.clientX - rect.left,
		y: event.clientY - rect.top
		}
	}
	
	this.getPixelFromTile = function(tile){

		var pixelX = (tile.x+1)*Config.LINE_WIDTH + tile.x*Config.TILE_WIDTH;
		var pixelY = (tile.y+1)*Config.LINE_WIDTH + tile.y*Config.TILE_WIDTH;
		var pixel = {
		  x : pixelX,
		  y : pixelY
		}
		return pixel;
    }
	
	this.getTileFromPixel = function(pixel){
		var TileX = Math.floor(pixel.x / Config.TILE_WIDTH);
		var TileY = Math.floor(pixel.y / Config.TILE_WIDTH);
		var tile = {
		  x : TileX,
		  y : TileY
		}
		return tile;
	}
	
	this.isPixelInTile = function(pixel){
		var tile = this.getTileFromPixel(pixel);
		var topLeft = this.getPixelFromTile(tile);
		var bottomRight = {
		  x : topLeft.x + Config.TILE_WIDTH,
		  y : topLeft.y + Config.TILE_WIDTH
		};
		if (pixel.x >= topLeft.x && pixel.x <= bottomRight.x
		   && pixel.y >= topLeft.y && pixel.y <= bottomRight.y) return true;
		return false;  
	}
	
	this.drawX = function(tile){
		var offset = Config.OFFSET;
		var topLeft = this.getPixelFromTile(tile);
		var bottomRight = {
		  x : topLeft.x + Config.TILE_WIDTH - offset,
		  y : topLeft.y + Config.TILE_WIDTH - offset
		};
		
		topLeft.x += offset;
		topLeft.y += offset;
		this.context.beginPath();
		this.context.strokeStyle = Config.RED;
		this.context.moveTo(topLeft.x,topLeft.y);
		this.context.lineTo(bottomRight.x,bottomRight.y);
		this.context.moveTo(bottomRight.x,topLeft.y);
		this.context.lineTo(topLeft.x,bottomRight.y);
		this.context.stroke();
	}
	
	this.drawO = function(tile){
		var topLeft = this.getPixelFromTile(tile);
		var center = {
		  x : topLeft.x + Config.TILE_WIDTH / 2,
		  y : topLeft.y + Config.TILE_WIDTH / 2
		}
		var radius = Config.TILE_WIDTH / 2 - Config.OFFSET;
		var start = 0;
		var stop = 2 * Math.PI;
		this.context.beginPath();
		this.context.strokeStyle = Config.BLUE;
		this.context.arc(center.x,center.y,radius,start,stop);
		this.context.stroke();
	}
	
	/**
	 * @param tile{x:int, y:int}
	 * @param type : String
	 * @param overStyle: Array of String, .i.e HORIZONTAL, VERTICAL
	 */
	this.updateCanvas = function(tile, type) {
	
		if (type === Config.X) {
			this.drawX(tile);
		} else if (type === Config.O) {
			this.drawO(tile);
		} else {
			$("#error").html("Sory, I don't support that style :(");
		}
		
	}
	
	this.clearCanvas = function() {
		this.context.clearRect(0,0,Config.CANVAS_WIDTH,Config.CANVAS_HEIGHT);
		this.drawBorder();
	}
	
	this.__init__ = function() {
		this.canvas = canvas;
		this.context = this.canvas.getContext('2d');
		this.context.lineWidth = Config.STROKE_WIDTH;
		
		this.row = Config.GAME_ROW;
		this.column = Config.GAME_COLUMN;
		/* clear canvas before drawing*/
		this.clearCanvas();
		this.drawBorder();
	}
	
	this.__init__();
}