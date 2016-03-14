/*
 * GameController: holds game logic and direct game
 */
var GameController = function() {
	
	this.updateStatus = function(message) {
		$("#gameStatus").html(message);
	}
	
	this.updateFirstPlayer = function() {
		var firstPlayer;
		if (this.player1.turn) {
			firstPlayer = this.player1;
		} else {
			firstPlayer = this.player2;
		}
		this.updateStatus("BATTLE!!<br>Move First: " + firstPlayer.name);
	}
	this.gameStop = function() {
		this.player1.turn = false;
		this.player2.turn = false;
	}
	this.gameDraw = function() {
		this.drawScore++;
		$("#drawScore").html(this.drawScore);
	}
	/*
	 * @param move, player
	 * .i.e move = {accept:true,type:'X',gameOver{status:true,type:"DRAW",style:['HORIZONTAL']}}
	 */
	this.checkMove = function(move, player) {
		
		if (!move.accept) {
			player.turn = true;
			return;
		}
		if (move.gameOver.status) {
			this.gameStop();
			if (move.gameOver.type === Config.DRAW) {
				this.updateStatus("GAME DRAW");
				this.gameDraw();
			}			
			if (move.gameOver.type === Config.WIN) {
				player.win();
				this.updateStatus("PLAYER " + player.name + " WIN!!<br>" + move.gameOver.style);
			}				
		} else {
			// if move accept, && !gameOver
			player.turn = false;
			player.enemy.turn = true;
		}	
	}
	
	this.autoMove = function() {
		var move2 = this.player2.randomMove();
		this.checkMove(move2, this.player2);
	}
	
	this.movePlayer = function(event) {
			
		var pixel = this.canvasController.getMousePos(event);
		var tile = this.canvasController.getTileFromPixel(pixel);
		if (this.player1.turn) {
			var move1 = this.player1.move(tile);
			this.checkMove(move1,this.player1);
			
		} else if (this.player2.turn) {
			var move2 = this.player2.move(tile);
			this.checkMove(move2, this.player2);
		}
		// autoMod is player2 
		if (this.autoMode && this.player2.turn) {
			var move2 = this.player2.randomMove();
			this.checkMove(move2, this.player2);
		}
	}
	
	/* This code will be upgraded for 1vs1 mode*/
	this.takeInput = function() {
		
		var automode = document.getElementById("computer").checked;
		if (automode) $("#username2").val("PC");
		var choice, otherChoice;
		if (document.getElementById("choice_X").checked) {
			choice = Config.X; 
			otherChoice = Config.O;
		} else {
			choice = Config.O;
			otherChoice = Config.X;
		}
		var moveFirst = document.getElementById("moveFirst").checked;
		
		return {
			player1 : {
			name : $("#username").val(),
			choice : choice,
			turn : moveFirst
			},
			player2 : {
			name: $("#username2").val(),
			choice : otherChoice,
			turn : !moveFirst
			},
			autoMode :automode};
	}
	
	this.createPlayer = function() {
		// init players
		var input = this.takeInput();
		
		this.player1 = new Player(input.player1.name,input.player1.choice);
		this.player1.turn = input.player1.turn;
		this.player1.moveFirst = input.player1.turn;
		this.player1.setGameBoard(this.gameBoard);
		
		this.player2 = new Player(input.player2.name,input.player2.choice);
		this.player2.turn = input.player2.turn;
		this.player2.setGameBoard(this.gameBoard);
		/* You don't say*/
		this.player1.enemy = this.player2;
		this.player2.enemy = this.player1;
		this.drawScore = 0;
		//set mode
		this.autoMode = input.autoMode;
	}	
	
	this.start = function() {
		this.updateFirstPlayer();
		if (!this.player1.moveFirst && this.autoMode) this.autoMove();
	}
	
	this.reload = function() {
		
		this.gameBoard.clearBoard();	
		/* switch player first turn*/
		this.player1.moveFirst = !this.player1.moveFirst;
		this.player1.turn = this.player1.moveFirst;
		this.player2.turn = !this.player1.turn;
		/* start game*/
		this.start();
	}
	
	this.reset = function() {
		ClassPlayer.reset();
		this.createPlayer();
		this.gameBoard.clearBoard();
		this.start();
	}
	
	this.dispatchEvent = function(type, event) {
		switch(type) {
			case "canvasClick":
				this.movePlayer(event);
				break;
			case "reload":
				this.reload();
				break;
			case "reset":
				this.reset();
				break;
		}
	}
		
	this.__init__ = function() {
		// init canvas
		this.canvas = document.getElementById('myCanvas');
		this.canvas.controller = this;
		this.canvas.onclick = EventHandler.canvasClick;
		this.canvas.onmousemove = EventHandler.canvasMousemove;
		// init button
		this.reloadButton = document.getElementById('reload');
		$("#reload").removeClass("disabled");
		this.reloadButton.controller = this;
		this.reloadButton.onclick = EventHandler.reload;
		
		this.resetButton = document.getElementById('triggerGame');
		this.resetButton.controller = this;
		this.resetButton.onclick = EventHandler.reset;
		// init canvas, gameboard
		this.canvasController = new CanvasController(this.canvas);
		this.gameBoard = new GameBoard();
		this.gameBoard.setCanvasController(this.canvasController);
		this.gameBoard.controller = this;
		
		this.createPlayer();
	}
	
	this.__init__();
}
/*
 * EventHandler: takes event and pass it to GameController 
 */
var EventHandler = {
	canvasClick : function(event) {
		this.controller.dispatchEvent('canvasClick',event);
	},
	canvasMousemove : function(event) {
		this.controller.dispatchEvent('canvasMousemove',event);
	},
	reload: function() {
		this.controller.dispatchEvent('reload',null);
	},
	reset : function() {
		this.controller.dispatchEvent('reset',null);
	}
	
}