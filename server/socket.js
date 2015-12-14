module.exports = function (http) {
    var io = require('socket.io')(http);
    var _ = require("underscore");
    
    var clients = {};
    
    io.on('connection', function (socket) {
        console.log('a user connected');
        clients[socket.id] = socket;
        console.log(Object.keys(clients));
        socket.on('disconnect', function () {
            if(clients[socket.id]) {
                delete clients[socket.id];
            }
            console.log(Object.keys(clients));
        });
        
        socket.on("subscribe", function(message) {
           if(_.isString(message)) {
               socket.emit("response","thanks for subscribing '"+message+"'!");
           }
        });
        
    });
    return {
        emit: io.emit
    }
}