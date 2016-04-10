var express = require('express');
var bodyParser = require('body-parser');
var app = express();

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

	return results;
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

app.get('/', function (req, res) {
	res.sendFile(__dirname + "/" + "index.html");
});

app.get('/file/list', function(req, res) {
	var results = _listFiles(__dirname + "/" + "jail")
	var json = JSON.stringify(results);
	res.setHeader('Content-Type', 'application/json');
	res.send(json);
});

app.post('/file/write', function (req, res) {
	if (req.body.file == null || req.body.data == null) {
		res.status('400').send('params not met');
	} else {
		if (!/^[a-z0-9]+$/.test(req.body.file)) {
			console.log('illegal character');
			return res.status('400').send('illegal character');
		}
		_writeFile(__dirname + "/jail/" + req.body.file, req.body.data);
		res.status('200').send('OK');
	}
});

app.post('/file/read', function (req, res) {
	if (req.body.file == null) {
		res.status('400').send('params not met');
	} else {
		if (!/^[a-z0-9]+$/.test(req.body.file)) {
			console.log('illegal character');
			return res.status('400').send('illegal character');
		}	
		_readFile(__dirname + "/jail/" + req.body.file);
		res.status('200').send('OK');
	}
}); 

app.post('/console/execute', function (req, res) {
	if (req.body.command != "banana") {
		var results = {result : "Invalid command!<br>"};
	} else {
		var data = _readFile("/etc/motd").replace(/(?:\r\n|\r|\n)/g, '<br>').replace(/ /g, '&nbsp;');
		var results = {result : data};
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
