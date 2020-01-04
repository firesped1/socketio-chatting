const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', (req,res) => res.sendFile(__dirname + '/index.html'));
app.use('/static', express.static(__dirname + '/public'));

const users = {};

io.on('connection', function(socket){

    let user, code;

    socket.on('user enter', function(username){
        user = username;

        users[socket.id] = {username, is_typing: false};
        io.emit('user enter', user, users);
    });

    socket.on('chat message', function(msg, username){
        io.emit('chat message', msg, username);
    });

    socket.on('disconnect', function(){
        delete users[socket.id];
        io.emit('user exit', user, users);
    });

    socket.on('change typing status', function(status){
        users[socket.id].is_typing = status;
        io.emit('show typing userlist', users);
    });

})

http.listen(80, () => console.log('App launched succesfully'));