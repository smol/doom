var express = require('express');
var app = express();
var http = require('http').Server(app);

console.warn('-------\nNODE SERVER START\n\n--------\n');

app.use(express.static(__dirname + '/../client/.build/'));

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.get('/debug', function (req, res) {
	res.sendFile(__dirname + '/debug.html');
});

http.listen(8080, function () {
	console.log('Example app listening on port 8080');
});
