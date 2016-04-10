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
			$("#loadingMessages").append(word[pos_n]);
			showWord(word_n, speed_n, pos_n+1, callback);
		}, speed, word, speed, pos, callback);
	} else {
		$("#loadingMessages").append("<br>");
		
		if(typeof(callback) == "function"){
			callback();
		}
	}
}

function BananaOS(){
	this.loadingMessageNumber;
	this.loadingMessageTimeLetterSlow = 15;
	this.loadingMessageQueue = [
	                            /*["BananaOS v0.0.1 Loading...<br>", 0, false],
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
	                            ["Book<br>", 100, false],*/
	                            ];
	
	this.defaultApps = [
	                    {id:"aboutApp", icon:"images/start.png", callback:function(){new BananaOSAboutPage();}},
	                    {id:"consoleApp", icon:"images/console.png", callback:function(){new BananaOSConsole();}},
	                    {id:"calculatorApp", icon:"images/calc.png", callback:function(){new BananaOSCalculator();}},
	                    ];
	
	this.apps = {};
	this.windows = {};
	
	this.init = function(){
		console.log("In bananaOS init function");
		this.loadingMessageNumber = 0;
		this.showLoadingMessagesN();
	}
	
	this.showLoadingMessagesN = function(){
		if(this.loadingMessageNumber < this.loadingMessageQueue.length){
			message = this.loadingMessageQueue[this.loadingMessageNumber++];
			window.setTimeout(function(message, t_context){
				if(message[2]){
					showWord(message[0], message[3], 0, function(){$(document).get(0).t_bananaOs.showLoadingMessagesN();});
				} else {
					$("#loadingMessages").append(message[0]);
					t_context.showLoadingMessagesN();
				}
			}, message[1], message, this);
		} else {
			$("#loadingMessages").fadeOut(1000, function(){
				(new Audio("audio/bananaOsTone.ogg")).play();
				$("#loadingBananaBoxHidingCont").fadeIn(1000);
				
				window.setTimeout(function(){
					$(document).get(0).t_bananaOs.loadDefaultApps();
					$("#bananaOsDesktop").show(0);
					$("#loadingBananaBoxHidingCont").fadeOut(1000);
				}, 2000);
			});
		}
	}
	
	this.loadDefaultApps = function(){
		for(key in this.defaultApps){
			app = this.defaultApps[key];
			this.addApp(app.id, app.icon, app.callback);
		}
	}
	
	this.addApp = function(id, icon, callback){
		if(typeof(this.apps[id]) != "object"){
			this.apps[id] = new BananaOSDesktopApp(id, icon, callback);
		} else {
			window.alert("Error: App already exists with this ID");
		}
	}
	
	this.addWindow = function(id, title, width, height, content){
		if(typeof(this.windows[id]) != "object"){
			this.windows[id] = (new BananaOSDesktopWindow(id, title, width, height, content));
		} else {
			window.alert("Error: Window already exists with this ID");
		} 
	}
	
	this.closeWindow = function(id){
		if(typeof(this.windows[id]) == "object"){
			delete this.windows[id];
		} else {
			window.alert("Error: No window exists with this ID");
		}
	}
	
	this.init();
}

function BananaOSDesktopApp(id, icon, callback){
	this.id;
	this.icon;
	this.callback;
	this.elementSrc;
	
	this.init = function(){
		this.id = id;
		this.icon = icon;
		this.callback = callback;
		
		this.generateDOMElement();
	}
	
	this.generateDOMElement = function(){
		this.elementSrc  = '<div id="' + this.id + '" class="bananaOsDesktopApp">';
		this.elementSrc += '	<img class="bananaOsDesktopAppIcon" src="' + this.icon + '"></img>';
		this.elementSrc += '</div>';
		
		$("#bananaOsDesktopApplicationBar").append(this.elementSrc);
		this.removeListeners();
		this.setListeners();
	}
	
	this.removeListeners = function(){
		$("#" + this.id).off("click" + this.id, null);
	}
	
	this.setListeners = function(){
		$("#" + this.id).get(0).t_context = this;
		$("#" + this.id).on("click." + this.id, function(){
			if(typeof($(this).get(0).t_context.callback) == "function"){
				$(this).get(0).t_context.callback();
			}
		});
	}
	
	this.init();
}

function BananaOSDesktopWindow(id, title, width, height, content){
	this.id;
	this.title;
	this.width;
	this.height;
	this.content;
	this.elementSrc;
	
	this.init = function(){
		this.id = id;
		this.title = title;
		this.width = width;
		this.height = height;
		this.content = content;
		
		this.generateDOMElement();
	}
	
	this.generateDOMElement = function(){
		this.elementSrc = '<div id="' + this.id + '" class="bananaOsDesktopWindow">';
		this.elementSrc += '	<div class="bananaOsDesktopWindowTitleBar">' + this.title + '<i class="bananaOsDesktopWindowTitleBarClose fa fa-close" data-windowid="' + this.id + '"></i></div>';
		this.elementSrc += '	<div class="bananaOsDesktopWindowContent">' + this.content + '</div>';
		this.elementSrc += '</div>';
		
		$("#bananaOsDesktopWindowArea").append(this.elementSrc);
		$("#" + this.id).css("width", this.width + "px");
		$("#" + this.id).css("height", this.height + "px");
		
		this.setListeners();
	}
	
	this.removeListeners = function(){
		// TODO: Figure out how to remove the draggable handlers
	}
	
	this.loadContent = function(newContent){
		this.content = newContent;
		$("#" + this.id + " > .bananaOsDesktopWindowContent").get(0).innerHTML = (newContent);
	}
	
	this.appendContent = function(newContent){
		this.content += newContent;
		$("#" + this.id + " > .bananaOsDesktopWindowContent").append(newContent);
	}
	
	this.setListeners = function(){
		$("#" + this.id + " > .bananaOsDesktopWindowTitleBar > .bananaOsDesktopWindowTitleBarClose").on("click." + this.id + "CloseButton", function(e){
			e.stopPropagation();
			$(document).get(0).t_bananaOs.closeWindow($(this).data("windowid"));
			$("#" + $(this).data("windowid")).remove(0);
		});
		
		$("#" + this.id).draggable({
			handle: ".bananaOsDesktopWindowTitleBar", 
			containment: "#bananaOsDesktopWindowArea", 
			scroll: false
		}).resizable();
	}
	
	this.init();
}

function BananaOSConsole(){
	this.window;
	this.defaultId = "bananaOsConsoleWindow";
	this.defaultWidth = 500;
	this.defaultHeight = 350;
	this.elementSrc = '<div class="bananaOsTerminalOutput"></div><input type="text" class="bananaOsTerminalInput"></input>';
	this.input;
	this.output;
	
	this.sendingAjax;

	this.init = function(){
		this.sendingAjax = false;
		
		$(document).get(0).t_bananaOs.addWindow(this.defaultId, "Console", this.defaultWidth, this.defaultHeight, this.elementSrc);
		this.setListeners();
	};
	
	this.setListeners = function(){
		if($("#" + this.defaultId).length == 0){
			window.setTimeout(function(t_context){
				t_context.setListeners();
			}, 50, this);
		} else {
			this.window = $(document).get(0).t_bananaOs.windows.bananaOsConsoleWindow;
			
			this.input = $("#" + this.defaultId + " > .bananaOsDesktopWindowContent > .bananaOsTerminalInput");
			this.output = $("#" + this.defaultId + " > .bananaOsDesktopWindowContent > .bananaOsTerminalOutput");
			
			$(this.input).get(0).t_context = this;
			$(this.output).get(0).t_context = this;
			
			$(this.input).on("keypress",function(e){
				if(e.which == 13){
					$(this).get(0).t_context.sendCommand($(this).val());
				}
			});
		}
	}
	
	this.sendCommand = function(command){
		if(!this.sendingAjax){
			if(command == "clear"){
				$(this.output).get(0).innerHTML = "";
			} else {
				this.sendingAjax = true;
				$.ajax({
				  url: "/console/execute",
				  
				  method: "POST",
				  
				  t_context : this,
				  t_command : command,
				  
				  data: { command : command },
				  
				  success : function(json){
					  this.t_result = json.result;
				  },
				  
				  error : function(ex, eStr, eTh){
					  this.t_result = eStr;
				  },
				  
				  complete: [function(){
					  $(this.t_context.output).append("> " + this.t_command + "<br>");  
					  $(this.t_context.input).val("");
					  $(this.t_context.output).append(this.t_result);
					  $(this.t_context.output).scrollTop($(this.t_context.output).get(0).scrollHeight);
				  }, function(){
					  this.t_context.sendingAjax = false;
				  }]
				});
			}
		} else {
			window.setTimeout(function(command, t_context){
				t_context.sendCommand(command);
			}, 50, command, this);
		}
	}
	
	this.init();
}

function BananaOSAboutPage(){
	this.window;
	this.defaultId = "bananaOsAboutWindow";
	this.defaultWidth = 500;
	this.defaultHeight = 350;
	this.elementSrc = '<div><div class="bananaOsDeveloperCont"><img class="bananaOsDeveloperPortrait" src="images/blue_martian.png"></img><div class="bananaOsDeveloperBio">Jeremy Krach : Backend<br>Jeremy is a UMD CS Major and banana afficionado</div></div><div class="bananaOsDeveloperCont"><img class="bananaOsDeveloperPortrait" src="images/red_martian.png"></img><div class="bananaOsDeveloperBio">Chris Rodriguez : Frontend<br>Chris is a UMBC CS Major and potassium addict</div></div></div>';

	this.init = function(){
		$(document).get(0).t_bananaOs.addWindow(this.defaultId, "About Banana OS", this.defaultWidth, this.defaultHeight, this.elementSrc);
	};
	
	this.init();
}

function BananaOSCalculator(){
	this.window;
	this.defaultId = "bananaOsCalculatorWindow";
	this.defaultWidth = 500;
	this.defaultHeight = 350;
	this.elementSrc = '<div class="bananaOsCalculatorOutput"></div><table class="bananaOsCalculatorPad"><tbody><tr><td>+</td><td>-</td><td>*</td><td>/</td></tr><tr><td>7</td><td>8</td><td>9</td><td rowspan="4">Enter</td></tr><tr><td>4</td><td>5</td><td>6</td></tr><tr><td>1</td><td>2</td><td>3</td></tr><tr><td colspan="2">0</td><td>.</td></tr></tbody></table>';
	this.output;
	
	this.sendingAjax;

	this.init = function(){
		this.sendingAjax = false;
		
		$(document).get(0).t_bananaOs.addWindow(this.defaultId, "Calculator", this.defaultWidth, this.defaultHeight, this.elementSrc);
		this.setListeners();
	};
	
	this.setListeners = function(){
		if($("#" + this.defaultId).length == 0){
			window.setTimeout(function(t_context){
				t_context.setListeners();
			}, 50, this);
		} else {
			this.window = $(document).get(0).t_bananaOs.windows.bananaOsConsoleWindow;
			this.output = $("#" + this.defaultId + " > .bananaOsDesktopWindowContent > .bananaOsCalculatorOutput");
			$(this.output).data("hasbananas", 0);
			$(this.output).get(0).t_context = this;
			var t_calcContext = this;
			$("#" + this.defaultId + " > .bananaOsDesktopWindowContent > .bananaOsCalculatorPad > tbody > tr > td").each(function(){
				$(this).get(0).t_context = t_calcContext;
			});
			
			$("#" + this.defaultId + " > .bananaOsDesktopWindowContent > .bananaOsCalculatorPad > tbody > tr > td").on("click", function(){
				if($(this).get(0).innerHTML != "Enter"){
					$($(this).get(0).t_context.output).append($(this).get(0).innerHTML);
				} else {
					$(this).get(0).t_context.calculate();
				}
			});
		}
	}
	
	this.calculate = function(){
		if($(this.output).data("hasbananas") != 0){
			$(this.output).get(0).innerHTML = "SO MANY BANANAS";
		} else {
			$(this.output).data("hasbananas", 1);
			$(this.output).get(0).innerHTML = "Banana";
		}
	}
	
	this.init();
}