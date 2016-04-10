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
	
	this.defaultApps = [{id:"consoleApp", icon:"public/images/console.png", callback:function(){new BananaOSConsole();}}];
	
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
				(new Audio("public/audio/bananaOsTone.ogg")).play();
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
		
		$(document).get(0).t_bananaOs.addWindow("bananaOsConsoleWindow", "Console", this.defaultWidth, this.defaultHeight, this.elementSrc);
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
			this.sendingAjax = true;
			$.ajax({
			  url: "/console/execute",
			  
			  method: "POST",
			  
			  t_context : this,
			  
			  data: { command : command },
			  
			  success : function(json){
				  this.t_status = true;
				  this.t_result = json.result;
			  },
			  
			  error : function(ex, eStr, eTh){
				  this.t_status = false;
				  this.t_result = eStr;
			  },
			  
			  complete: [function(){
				  if(this.t_status){
					  $(this.t_context.input).val("");
					  $(this.t_context.output).val(this.t_result);
				  } else {
					  $(this.t_context.input).val("");
					  $(this.t_context.output).val(eStr);
				  }
			  }, function(){
				  this.t_context.sendingAjax = false;
			  }]
			});
		} else {
			window.setTimeout(function(command, t_context){
				t_context.sendCommand(command);
			}, 50, command, this);
		}
	}
	
	this.init();
}