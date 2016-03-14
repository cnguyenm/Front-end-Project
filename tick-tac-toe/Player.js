
/* hold static variable for Class Player*/
var ClassPlayer = {
	number : 1,
	reset : function() {this.number = 1;}
}
var Player = function(name,type){
	
	this.__init__ = function() {
		this.name = name;
		this.type = type;
		this.score = 0;
		this.id = ClassPlayer.number;
		this.turn = true;
		$("#name" + this.id).html(this.name);
		$("#score" + this.id).html(this.score);
		ClassPlayer.number++;
	}
	this.setGameBoard = function(gameBoard) {
		this.gameBoard = gameBoard;
	}
  
	this.move = function(tile){
		var move = this.gameBoard.updateMove(tile,this.type);
		return move;
	}
	/**
	 * randomMove: this function will be upgraded for AI
	 */
	this.randomMove = function() {
		var tile = {
			x : Math.floor(Math.random()*Config.GAME_ROW),
			y : Math.floor(Math.random()*Config.GAME_COLUMN)
		}
		var move = this.gameBoard.updateMove(tile,this.type);
		if (!move.accept) return this.randomMove();
		return move;
	}
	
	this.updateScore = function() {
		$("#score" + this.id).html(this.score);
	}
	this.win = function() {
		this.score++;
		this.updateScore();
	}
	
	this.__init__();
}
