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
	                    {id:"fileBrowserApp", icon:"images/folder.png", callback:function(){new BananaOSFileBrowser();}},
	                    ];
	
	this.apps = {};
	this.windows = {};
	this.n_files = 0;
	
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
	
	this.getUniqueFileId = function(){
		return this.n_files++;
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
		this.elementSrc += '	<div class="bananaOsDesktopWindowTitleBar" disabled>' + this.title + '<i class="bananaOsDesktopWindowTitleBarClose fa fa-close" data-windowid="' + this.id + '"></i></div>';
		this.elementSrc += '	<div class="bananaOsDesktopWindowContent">' + this.content + '</div>';
		this.elementSrc += '</div>';
		
		$("#bananaOsDesktopWindowArea").append(this.elementSrc);
		
		this.setListeners();
		this.setActiveWindow();
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
		if($("#" + this.id).length > 0){
			$("#" + this.id).css("left", "calc(25% - " + (this.width/2) + "px)");
			$("#" + this.id).css("top", "calc(25% - " + (this.height/2) + "px)");
			$("#" + this.id).css("width", this.width + "px");
			$("#" + this.id).css("height", this.height + "px");
			$("#" + this.id).css("z-index", (50 + $(document).get(0).t_bananaOs.getUniqueFileId()));
			
			$("#" + this.id).get(0).t_context = this;
			$("#" + this.id).on("mousedown.activeWindowListener", function(){
				$(this).get(0).t_context.setActiveWindow();
			});
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
		} else {
			window.setTimeout(function(t_context){
				t_context.setListeners();
			}, 20, this);
		}
	}
	
	this.setActiveWindow = function(){
		$(".bananaOsDesktopWindow.bananaOsDesktopWindowActive").removeClass("bananaOsDesktopWindowActive");
		$("#" + this.id).addClass("bananaOsDesktopWindowActive");
	}
	
	this.init();
}

function BananaOSConsole(){
	this.window;
	this.defaultId = "bananaOsConsoleWindow";
	this.defaultWidth = 500;
	this.defaultHeight = 350;
	this.elementSrc = '<div class="bananaOsTerminalOutput" disabled></div><input type="text" class="bananaOsTerminalInput"></input>';
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
			$(this.input).focus();
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
				$(this.input).val("");
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
	this.defaultWidth = 660;
	this.defaultHeight = 600;
	this.elementSrc = '<div class="bananaOsAboutVideo"><iframe width="420" height="315" src="https://www.youtube.com/embed/8d4RtvMQp10" frameborder="0" allowfullscreen></iframe></div><div class="bananaOsDeveloperCont"><img class="bananaOsDeveloperPortrait" src="images/blue_martian.png"></img><div class="bananaOsDeveloperBio">Jeremy Krach : Backend<br>Jeremy is a UMD CS Major and banana afficionado</div></div><div class="bananaOsDeveloperCont"><img class="bananaOsDeveloperPortrait" src="images/red_martian.png"></img><div class="bananaOsDeveloperBio">Chris Rodriguez : Frontend<br>Chris is a UMBC CS Major and potassium addict</div></div>';

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
	this.elementSrc = '<div class="bananaOsCalculatorOutput"></div><table class="bananaOsCalculatorPad"><tbody><tr><td>+</td><td>-</td><td>*</td><td>/</td></tr><tr><td>7</td><td>8</td><td>9</td><td rowspan="2">Clear</td></tr><tr><td>4</td><td>5</td><td>6</td></tr><tr><td>1</td><td>2</td><td>3</td><td rowspan="2">Enter</td></tr><tr><td colspan="2">0</td><td>.</td></tr></tbody></table>';
	this.output;

	this.init = function(){
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
				if($(this).get(0).innerHTML == "Clear"){
					$($(this).get(0).t_context.output).get(0).innerHTML = "";
					$($(this).get(0).t_context.output).data("hasbananas", 0);
				} else if($(this).get(0).innerHTML == "Enter"){
					$(this).get(0).t_context.calculate();
				} else {
					$($(this).get(0).t_context.output).append($(this).get(0).innerHTML);
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

function BananaOSFileBrowser(){
	this.window;
	this.defaultId = "bananaOsFileBrowserWindow";
	this.defaultWidth = 500;
	this.defaultHeight = 350;
	this.elementSrc = '<div id="bananaOsFileBrowserContent"></div>';
	this.input;
	this.output;
	
	this.files = {};
	
	this.sendingAjax;

	this.init = function(){
		this.sendingAjax = false;
		this.getFileList();
		$(document).get(0).t_bananaOs.addWindow(this.defaultId, "File Browser", this.defaultWidth, this.defaultHeight, this.elementSrc);
		this.setListeners();
	};
	
	this.setListeners = function(){}
	
	this.getFileList = function(){
		if(!this.sendingAjax){
			this.sendingAjax = true;
			$.ajax({
			  url: "/file/list",
			  
			  method: "GET",
			  
			  t_context : this,
			  
			  data: {},
			  
			  success : function(json){
				  for(i in json){
					  this.t_context.files[json[i].name] = new BananaOSFile(json[i].name, json[i].type, "bananaOsFileBrowserContent");
				  }
			  },
			  
			  error : function(ex, eStr, eTh){
				  this.t_result = eStr;
			  },
			  
			  complete: function(){
				  console.log(this.t_context.files);
			  }
			});
		} else {
			window.setTimeout(function(t_context){
				t_context.getFileList();
			}, 50, this);
		}
	}
	
	this.init();
}

function BananaOSFile(name, type, containerId){
	this.id;
	this.containerId;
	this.name;
	this.type;
	this.icon;
	this.elementSrc;
	
	this.init = function(){
		this.id = "file" + $(document).get(0).t_bananaOs.getUniqueFileId();
		this.name = name;
		this.type = type;
		this.containerId = containerId;
		
		switch(this.type){
			case "txt":
				this.icon = '<i class="fa fa-2x fa-file-text-o bananaOsFileIcon"></i>';
				break;
			case "code":
				this.icon = '<i class="fa fa-2x fa-file-code-o bananaOsFileIcon"></i>';
				break;
			default:
				this.icon = '<i class="fa fa-2x fa-file-o bananaOsFileIcon"></i>';
				break;
		}
		
		this.generateDOMElement();
	}
	
	this.generateDOMElement = function(){
		this.elementSrc = '<div id="' + this.id + '" class="bananaOsFile">';
		this.elementSrc += '	<div class="bananaOsFileIcon">' + this.icon + '</div>';
		this.elementSrc += '	<div class="bananaOsFileName">' + this.name + '</div>';
		this.elementSrc += '</div>';
		
		$("#" + this.containerId).append(this.elementSrc);
		this.setListeners();
	}
	
	this.removeListeners = function(){
		$("#" + this.id).off("click", null);
	}
	
	this.setListeners = function(){
		if($("#" + this.id).length > 0){
			$("#" + this.id).get(0).t_context = this;
			$("#" + this.id).on("click", function(){
				$(".bananaOsFile.selected").removeClass("selected");
				$(this).addClass("selected");
				$(this).get(0).t_context.open();
			});
		} else {
			window.setTimeout(function(t_context){
				t_context.setListeners();
			}, 50, this);
		}
	}
	
	this.open = function(){
		new BananaOSFileData(this.name, this.type, true);
	}
	
	this.init();
}

function BananaOSFileData(name, type, openOnLoad){
	this.name;
	this.type;
	this.content;

	this.sendingAjax;
	this.openOnLoad;
	
	this.init = function(){
		this.name = name;
		this.type = type;
		this.sendingAjax = false;
		this.openOnLoad = openOnLoad;
		
		this.acquireContent();
	}
	
	this.acquireContent = function(){
		if(!this.sendingAjax){
			this.sendingAjax = true;
			$.ajax({
			  url: "/file/read",
			  
			  method: "POST",
			  
			  t_context : this,
			  
			  data: {file : this.name},
			  
			  success : function(json){
				  this.t_result = "success";
				  this.t_context.content = json.data;
			  },
			  
			  error : function(ex, eStr, eTh){
				  this.t_result = eStr;
			  },
			  
			  complete: function(){
				  this.t_context.sendingAjax = false;
				  if(this.t_context.openOnLoad){
					  switch(this.t_context.type){
						  case "code":
							  new BananaOSCodeEditor(this.t_context);
							  break;
						  case "text":
							  new BananaOSTextEditor(this.t_context);
							  break;
						  default:
							  new BananaOSTextEditor(this.t_context);
						  	  break;
					  }
				  }
			  }
			});
		} else {
			window.setTimeout(function(t_context){
				t_context.acquireContent();
			}, 50, this);
		}
	}
	
	this.setContent = function(newContent){
		this.content = newContent;
	}
	
	this.saveFile = function(callback){
		if(!this.sendingAjax){
			this.sendingAjax = true;
			$.ajax({
			  url: "/file/write",
			  
			  method: "POST",
			  
			  t_context : this,
			  t_callback : callback,
			  
			  data: {
				  file : this.name,
				  data: this.content
				  },
			  
			  success : function(json){
			  },
			  
			  error : function(ex, eStr, eTh){
				  this.t_result = eStr;
			  },
			  
			  complete: function(){
				  if(typeof(this.t_callback) == "function"){
					  this.t_callback();
				  }
			  }
			});
		} else {
			window.setTimeout(function(t_context, callback){
				t_context.acquireContent(callback);
			}, 50, this, callback);
		}
	}
	
	this.init();
}

function BananaOSCodeEditor(file){
	this.window;
	this.editorId = "bananaOsCodeEditor" + $(document).get(0).t_bananaOs.getUniqueFileId();
	this.editor;
	this.defaultId = "bananaOsCodeEditorWindow";
	this.defaultWidth = 500;
	this.defaultHeight = 350;
	this.elementSrc = '<div id="' + this.editorId + '" class="bananaOsCodeEditor"></div>';
	this.content;
	this.file;
	
	this.sendingAjax;

	this.init = function(){
		this.sendingAjax = false;
		this.file = file;
		this.content = this.file.content;
		$(document).get(0).t_bananaOs.addWindow(this.defaultId, "Code Editor", this.defaultWidth, this.defaultHeight, this.elementSrc);
		this.setListeners();
	};
	
	this.setListeners = function(){
		if($("#" + this.defaultId).length == 0){
			window.setTimeout(function(t_context){
				t_context.setListeners();
			}, 50, this);
		} else {
			this.window = $(document).get(0).t_bananaOs.windows.bananaOsCodeEditorWindow;
			$("#" + this.defaultId + " > .bananaOsDesktopWindowTitleBar > .bananaOsDesktopWindowTitleBarClose").get(0).t_editorContext = this;
			$("#" + this.defaultId + " > .bananaOsDesktopWindowTitleBar > .bananaOsDesktopWindowTitleBarClose").on("click", function(e){
				$(this).get(0).t_editorContext.file.setContent($(this).get(0).t_editorContext.editor.getValue());
				$(this).get(0).t_editorContext.file.saveFile();
			});
			
			this.editor = ace.edit(this.editorId);
			this.editor.setTheme("ace/theme/monokai");
			this.editor.getSession().setMode("ace/mode/javascript");
			this.editor.setValue(this.content);
		}
	}

	this.init();
}

function BananaOSTextEditor(file){
	this.window;
	this.editorId = "bananaOsTextEditor" + $(document).get(0).t_bananaOs.getUniqueFileId();
	this.editor;
	this.defaultId = "bananaOsTextEditorWindow";
	this.defaultWidth = 500;
	this.defaultHeight = 350;
	this.elementSrc = '<div id="' + this.editorId + '" class="bananaOsTextEditor"></div>';
	this.content;
	this.file;
	
	this.sendingAjax;

	this.init = function(){
		this.sendingAjax = false;
		this.file = file;
		this.content = this.file.content;
		$(document).get(0).t_bananaOs.addWindow(this.defaultId, "Text Editor", this.defaultWidth, this.defaultHeight, this.elementSrc);
		this.setListeners();
	};
	
	this.setListeners = function(){
		if($("#" + this.defaultId).length == 0){
			window.setTimeout(function(t_context){
				t_context.setListeners();
			}, 50, this);
		} else {
			this.window = $(document).get(0).t_bananaOs.windows.bananaOsTextEditorWindow;
			$("#" + this.defaultId + " > .bananaOsDesktopWindowTitleBar > .bananaOsDesktopWindowTitleBarClose").get(0).t_editorContext = this;
			$("#" + this.defaultId + " > .bananaOsDesktopWindowTitleBar > .bananaOsDesktopWindowTitleBarClose").on("click", function(e){
				$(this).get(0).t_editorContext.file.setContent($(this).get(0).t_editorContext.editor.getValue());
				$(this).get(0).t_editorContext.file.saveFile();
			});
			
			this.editor = ace.edit(this.editorId);
			this.editor.setTheme("ace/theme/clouds");
			this.editor.getSession().setMode("ace/mode/text");
			this.editor.setValue(this.content);
		}
	}

	this.init();
}