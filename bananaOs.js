/**
 * BananaOS main object file. Who knows what we're going to do in here.
 * 
 * @author Chris Rodriguez
 */
$(document).ready(function(){
	console.log("Everything is loading. This is good.");
	$(document).get(0).t_bananaOs = new BananaOS();
});

function BananaOS(){
	this.loadingMessageNumber;
	this.loadingMessageQueue = [
	                            ["BananaOS v0.0.1 Loading...<br>", 0],
	                            ["Oooooooooooooohhhhhhhhh<br>", 2000],
	                            ["Aaaaah<br>", 2000],
	                            ["Hm", 2000],
	                            ["m", 5],
	                            ["m", 5],
	                            ["m", 5],
	                            ["m", 5],
	                            ["m", 5],
	                            ["m", 5],
	                            ["m", 5],
	                            ["m", 5],
	                            ["m", 5],
	                            ["m", 5],
	                            ["m", 5],
	                            ["m<br>", 5],
	                            [".", 1000],
	                            [".", 100],
	                            [".<br>", 100],
	                            ["But", 2000],
	                            ["ton<br>", 75],
	                            ["Book<br>", 2000],
	                            ["Book<br>", 500],
	                            ["Book<br>", 100],
	                            ["Book<br>", 100],
	                            ]
	
	this.init = function(){
		console.log("In bananaOS init function");
		this.loadingMessageNumber = 0;
		this.showLoadingMessages();
	}
	
	this.showLoadingMessages = function(){
		window.setTimeout(function(message, t_context){
			$("body").append(message);
			
			t_context.loadingMessageNumber++;
			if(t_context.loadingMessageNumber < t_context.loadingMessageQueue.length){
				t_context.showLoadingMessages();
			}
		}, this.loadingMessageQueue[this.loadingMessageNumber][1], this.loadingMessageQueue[this.loadingMessageNumber][0], this);
	}
	
	this.init();
}