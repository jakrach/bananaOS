var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/', function (req, res) {
	res.sendFile(__dirname + "/" + "index.html");
});

app.get('*', function(req, res) {
	res.status('404').send('Error: 404');
});

var server = app.listen(80, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log("Example app listening at http://%s:%s", host, port);
});
