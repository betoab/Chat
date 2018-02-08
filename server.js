var express = require('express');
var app = express();
var messages = new Array();
var http = require('http');
var server = http.Server(app);
const bodyParser = require('body-parser');

//configuracion base de datos
const mongoose = require('mongoose');
const session =require('express-session');
const MongoStore = require('connect-mongo') (session);
const Message = require('./Models/message');
mongoose.connect("mongodb://localhost:27017/chat");
const db = mongoose.connection;
db.on('error', () => {console.error('connection error:')});

app.use(express.static('client'));

var io = require('socket.io')(server);

io.on('connection', function (socket) {
    socket.emit('messages', messages)
    socket
        .on('message', function (msg) {
            io.emit('message', `${msg.initials}: ${msg.message}`);  
            Message.create(msg, (error, user) => {
                return false;
              })
            messages.push(msg);  
        });
});

server.listen(8080, function () {
    console.log('Chat server running');
});