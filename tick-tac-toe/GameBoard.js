/* Some useful functions*/
function fillArray(value, len) {
  var arr = [];
  for (var i = 0; i < len; i++) {
    arr.push(value);
  }
  return arr;
}
function updateGameOver(gameOver,type,style) {
	gameOver.status = true;
	gameOver.type = type;
	if (style !== null)
		gameOver.style.push(style);
}
/**
 * GameBoard: holds logic board of game
 */
var GameBoard = function() {
	
	this.initBoard = function(){
		this.board = [];
		for ( var row = 0; row < this.rows; row++){
		  this.board[row] = fillArray(Config.BLANK, this.columns);
		}
	}
	
	this.setCanvasController = function(canvasController) {
		this.canvasController = canvasController;
	}
	
	this.clearBoard = function() {
		// create new board
		this.initBoard();
		// tell canvasController to clear
		this.canvasController.clearCanvas();
	}
	
	this.isValidMove = function(tile) {
		var valid = this.board[tile.y][tile.x] === Config.BLANK;
		return valid;
	}	
	/**
	 * isGameOver: check winning condition
	 * this method is only applied to 3x3
	 * @param tile: position tile of gameBoard
	 * @param type: type of player .i.e. 'X'
	 * @return gameOver: 
	 *	{status: boolean, 
	 *	type: String,
	 *	style: array of String i.e. HORIZONTAL, VERTICAL
	 *	}
	 */
	this.isGameOver = function(tile,type) {
		var i,j;
		var gameOver = {
			status: false,
			type: null, // type: 'DRAW', 'WIN'
			style: [] // can be both horizontal, vertical
		}
		//check draw
		var loop = true;
		for (i = 0; i < Config.GAME_ROW && loop;i++) {
			for (j = 0; j < Config.GAME_COLUMN; j++) {
				if (this.board[i][j] === Config.BLANK) {
					loop = false;
					break;
				}
				if ((i === Config.GAME_ROW - 1) && (j === Config.GAME_COLUMN - 1)) {
					updateGameOver(gameOver, Config.DRAW, null);
				}	
			}
		}
		
		//check horizontal
		for (i = 0; i < Config.WIN_NUMBER; i++) {
			if (this.board[tile.y][i] !== type) break;
			if (i === Config.WIN_NUMBER - 1) {
				updateGameOver(gameOver, Config.WIN, Config.HORIZONTAL);
			}
		}
		// check vertical
		for (i = 0; i < Config.WIN_NUMBER; i++) {
			if (this.board[i][tile.x] !== type) break;
			if (i === Config.WIN_NUMBER - 1) {
				updateGameOver(gameOver, Config.WIN, Config.VERTICAL);
			}
		}
		// check diagonal: y = x
		if (tile.y === tile.x) {
			for (i = 0; i < Config.WIN_NUMBER; i++) {
				if (this.board[i][i] !== type) break;
				if (i === Config.WIN_NUMBER - 1) {
					updateGameOver(gameOver, Config.WIN, Config.DIAGONAL);
				}
			}
		}
		
		// check anti-diagonal: y = 2 - x
		if (tile.y === Config.WIN_NUMBER - 1 - tile.x) {
			for (i = 0; i < Config.WIN_NUMBER; i++) {
				if (this.board[i][Config.WIN_NUMBER - i - 1] !== type) break;
				if (i === Config.WIN_NUMBER - 1) {
					updateGameOver(gameOver, Config.WIN, Config.ANTI_DIAGONAL);
				}
			}
		}
		
		return gameOver;
	}
	
	this.updateMove = function(tile, type) {
		// check valid
		var move = {
			accept : false,
			gameOver : null
		}
		if (!this.isValidMove(tile)) return move;
		// update board
		move.accept = true;
		this.board[tile.y][tile.x] = type;
		// check gameOver
		var gameOver = this.isGameOver(tile, type);
		move.gameOver = gameOver;
		this.canvasController.updateCanvas(tile, type);
		return move;
	}
	
	this.__init__ = function(){
		this.rows = Config.GAME_ROW;
		this.columns = Config.GAME_COLUMN;
		this.initBoard();
	}
	
	this.__init__();
}