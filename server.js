// Imports
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// Setting up express
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true	
}));

var _listFiles = function(dir) {
	var filesystem = require("fs");
  var results = [];

	filesystem.readdirSync(dir).forEach(function(file) {
		var tmp = file;
		file = dir+'/'+file;

		var stat = filesystem.statSync(file);
		if (stat && stat.isDirectory()) {
			results = results.concat(_listFiles(file))
		} else results.push(tmp);
	});

	var hashes = [];
	results.forEach(function(str) {
		hashes.push({name: str, type: str.split('.')[1]});
	})

	return hashes;
};

var _writeFile = function(fname, text) {
	var filesystem = require("fs");
	filesystem.writeFile(fname, text, function(err) {
		if(err) {
			return console.log(err);
		}
	});
	console.log(fname + " > " + text);
};

var _readFile = function(fname) {
	var filesystem = require("fs");
	return filesystem.readFileSync(fname, 'utf8');
}

// Landing page
app.get('/', function (req, res) {
	res.sendFile(__dirname + "/" + "index.html");
});


// API call to list files
app.get('/file/list', function(req, res) {
	var results = _listFiles(__dirname + "/" + "jail")
	var json = JSON.stringify(results);
	res.setHeader('Content-Type', 'application/json');
	res.send(json);
});

// API call to create a file
app.post('/file/write', function (req, res) {
	if (req.body.file == null || req.body.data == null) {
		res.status('400').send('params not met');
	} else {
		if (!/^[a-z0-9]+\.(txt|code)$/.test(req.body.file)) {
			console.log('illegal character');
			return res.status('400').send('illegal character');
		}
		_writeFile(__dirname + "/jail/" + req.body.file, req.body.data);
		res.status('200').send('OK');
	}
});

// API call to read a file
app.post('/file/read', function (req, res) {
	if (req.body.file == null) {
		res.status('400').send('params not met');
	} else {
		if (!/^[a-z0-9]+\.(txt|code)$/.test(req.body.file)) {
			console.log('illegal character');
			return res.status('400').send('illegal character');
		}	
		var str = _readFile(__dirname + "/jail/" + req.body.file);
		res.setHeader('Content-Type', 'application/json');
		res.status('200').send(JSON.stringify({data : str}));
	}
}); 

// API call to execute a command
app.post('/console/execute', function (req, res) {
	if (req.body.command == "banana") {
		var data = _readFile("/etc/motd").replace(/(?:\r\n|\r|\n)/g, '<br>').replace(/ /g, '&nbsp;');
		var results = {result : data};
	} else if (/^banana\s+.*$/.test(req.body.command)) {
		var out = /^banana\s+(.*)$/.exec(req.body.command)[1];
		console.log(out);
		var data = _readFile("/etc/motd").replace(/(?:\r\n|\r|\n)/g, '<br>');
		data = data.replace("Welcome to BananaOS!", out).replace(/ /g, '&nbsp;');
		var results = {result : data};
	}	else if (req.body.command == "help") {
		var results = {result : "Try 'banana'.<br>"}
	} else {
		var results = {result : "Invalid command!<br>"};
	}
	var json = JSON.stringify(results);
	res.setHeader('Content-Type', 'application/json');
	res.status('200').send(json);
});

app.get('*', function(req, res) {
	res.status('404').send('Error: 404');
});

var server = app.listen(80, function () {
  // Listening
  try {
    console.log('Old User ID: ' + process.getuid() + ', Old Group ID: ' + process.getgid());
    process.setgid('jeremy');
    process.setuid('jeremy');
    console.log('New User ID: ' + process.getuid() + ', New Group ID: ' + process.getgid());
  } catch (err) {
    console.log('Cowardly refusing to keep the process alive as root.');
    process.exit(1);
  }
	var host = server.address().address;
	var port = server.address().port;
	console.log("BananaOS app listening at http://%s:%s", host, port);
});
