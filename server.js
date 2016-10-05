var http = require('http');
var path = require('path');
var socketio = require('socket.io');
var express = require('express');
var chatComments = require("./db.js");

var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);
router.use(express.static(path.resolve(__dirname, 'client')));

router.get('/', function(req, res, next) {  
    res.sendFile(__dirname + 'client/index.html');
});

io.on('connection', function(client) {  
    console.log('Client connected...');

    client.on('messages', function(data) {
      if (data) {
        client.emit('broad', data);
        client.broadcast.emit('broad', data);
      }
    });
});

router.get("/comment", function(req, res) {
    req.setMaxListeners(0);
    res.setHeader("Access-Control-Allow-Origin", "*");
    chatComments.insertIntoDB(req.query.text, function(answer) {
        res.send(answer);

        return answer;
    });
});

router.get("/load", function(req, res) {
    req.setMaxListeners(0);
    res.setHeader("Access-Control-Allow-Origin", "*");
    chatComments.getFromDB(function(answer) {
        res.send(answer);

        return answer;
    });
});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
});