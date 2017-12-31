var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var data = fs.readFileSync('./helperFiles/messages.json');
var messages = JSON.parse(data);

io.on('connection', function(socket){
	console.log('we have a connection');
	socket.on('new-message', function(msg){
		messages.push(msg);
		fs.writeFile('./helperFiles/messages.json',JSON.stringify(messages, null, 2));
		io.emit('receive-message', msg)
	});
});

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.get('/', function(req, res) {
	res.send(messages);
});

http.listen('3001', function(){
	console.log('we are connected');
});

