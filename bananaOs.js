/**
 * BananaOS main object file. Who knows what we're going to do in here.
 * 
 * @author Chris Rodriguez
 */
$(document).ready(function(){
	console.log("Everything is loading. This is good.");
	$(document).get(0).t_bananaOs = new BananaOS();
});

function showWord(word, speed, pos, callback){
	if(pos < word.length){
		window.setTimeout(function(word_n, speed_n, pos_n, callback){
			$("body").append(word[pos_n]);
			showWord(word_n, speed_n, pos_n+1, callback);
		}, speed, word, speed, pos, callback);
	} else {
		$("body").append("<br>");
		
		if(typeof(callback) == "function"){
			callback();
		}
	}
}

function BananaOS(){
	this.loadingMessageNumber;
	this.loadingMessageTimeLetterSlow = 15;
	this.loadingMessageQueue = [
	                            ["BananaOS v0.0.1 Loading...<br>", 0, false],
	                            ["Oooooooooooooohhhhhhhhh", 2000, true, 50],
	                            ["Aaaaah", 2000, true, 45],
	                            ["Hmmmmmmmmmmmmmmmmmmmm", 2000, true, 40],
	                            [".", 1000, false],
	                            [".", 100, false],
	                            [".<br>", 100, false],
	                            ["But", 2000, false],
	                            ["ton<br>", 75, false],
	                            ["Book<br>", 2000, false],
	                            ["Book<br>", 500, false],
	                            ["Book<br>", 100, false],
	                            ["Book<br>", 100, false],
	                            ]
	
	this.init = function(){
		console.log("In bananaOS init function");
		this.loadingMessageNumber = 0;
		this.showLoadingMessagesN();
	}
	
	/*this.showLoadingMessages = function(){
		window.setTimeout(function(message, t_context, animateWord){
			t_context.loadingMessageNumber++;
			
			if(animateWord){
				showWord(message, 50, 0, function(){$(document).get(0).t_bananaOs.showLoadingMessages();});
			} else {
				$("body").append(message);
				if(t_context.loadingMessageNumber < t_context.loadingMessageQueue.length){
					t_context.showLoadingMessages();
				}
			}
		}, this.loadingMessageQueue[this.loadingMessageNumber][1], this.loadingMessageQueue[this.loadingMessageNumber][0], this, this.loadingMessageQueue[this.loadingMessageNumber][2]);
	}*/
	
	this.showLoadingMessagesN = function(){
		if(this.loadingMessageNumber < this.loadingMessageQueue.length){
			message = this.loadingMessageQueue[this.loadingMessageNumber++];
			window.setTimeout(function(message, t_context){
				if(message[2]){
					showWord(message[0], message[3], 0, function(){$(document).get(0).t_bananaOs.showLoadingMessagesN();});
				} else {
					$("body").append(message[0]);
					t_context.showLoadingMessagesN();
				}
			}, message[1], message, this);
		}
	}
	
	this.init();
}