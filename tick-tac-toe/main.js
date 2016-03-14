
/* Function for modal*/
$("#player2Input").hide();
$("input[type=radio][name=playMode]").change(function(){
	if (this.value === "AUTO_ON") $("#player2Input").hide();
	if (this.value === "AUTO_OFF") $("#player2Input").show();
});

/* Function toggle for Game Rule*/
function showRule() {
	$("#gameRule").toggle("slide",{},500);
	// effects: blind, fold, slide, clip, ...	
}
/* Put placeholder image on canvas*/
window.onload = function() {
	var img = new Image();
	img.src = "http://www.manga-tr.com/app/manga/uploads/covers/5f6639b89dbe846e38d90e988ea590f7.jpg";
	var canvas = document.getElementById("myCanvas");
    var context= canvas.getContext("2d");
    context.drawImage(img,0,0,img.width,img.height,0,0,Config.CANVAS_WIDTH,Config.CANVAS_HEIGHT);
    
}

/* Validate Input, then start game*/
function main() {
	var gameController = new GameController();
	gameController.start();
}

$("#triggerModal").click(function(){
	$("#userInput").modal("toggle");
});
$("#triggerGame").click(function(){
	var error = false;
	var userName = $("#username").val();
	var userName2 = $("#username2").val();
	var choice;
	var moveFirst;
	if (userName === "") {
		error = true;
		$("#nameError").html("Please enter your awesome name!!");
	}
	if (userName2 === "") {
		error = true;
		$("#nameError2").html("Please enter your awesome name!!");
	}
	if (!(document.getElementById("choice_X").checked || document.getElementById("choice_O").checked)) {
		error = true;
		$("#choiceError").html("Pick one plzz");
	}
	if (!error) {
		$("#userInput").modal("hide");
		$("#triggerModal").html("Reset Game <i class=\"fa fa-refresh\"></i>");
		/* create GameController object*/
		main(); 
	}
});

