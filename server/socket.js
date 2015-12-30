'use strict'

module.exports = function (http, esClient) {
    var io = require('socket.io')(http);
    var _ = require('underscore');

    var clients = {};

    io.on('connection', function (socket) {
        clients[socket.id] = {
            'socket': socket,
            subscription: []
        };

        socket.on('disconnect', function () {
            if (clients[socket.id]) {
                delete clients[socket.id];
            }
        });

        socket.on('subscribe', function (message) {
            var client = clients[socket.id];
            if (_.isString(message) && client.subscription.indexOf(message) <= -1) {
                esClient.index({
                    index: 'file',
                    type: '.percolator',
                    body: {
                        query: {
                            'bool': {
                                should: [
                                    {
                                        'match': {
                                            'content': message
                                        }
                                },
                                    {
                                        'wildcard': {
                                            'title': '*' + message + '*'
                                        }
                                }
                            ]
                            }
                        },
                        socket: socket.id,
                        term: message
                    }
                }, function (error, response) {
                    if (error) {
                        throw error;
                    }
                    client.subscription.push(message);
                    socket.emit('subscription', client.subscription);
                });
            }
        });

    });

    var emitSocketId = function (id, msg) {
        var notifyingClient = clients[id];
        if (notifyingClient) {
            notifyingClient.socket.emit('newdocfound', msg);
        }
    };

    return {
        emitSocketId: emitSocketId
    };
};