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

        // clear subscription list 
        socket.emit('subscription', []);

        socket.on('disconnect', function () {
            if (clients[socket.id]) {
                delete clients[socket.id];
            }
            /* clear subscription list */
            socket.emit('subscription', []);

            /* delete percolators */
            esClient.search({
                'index': 'file',
                'type': '.percolator',
                body: {
                    query: {
                        match: {
                            socket: socket.id
                        }
                    }
                }
            }, function (error, response) {
                if (response.hits) {
                    for (var i in response.hits.hits) {
                        var hit = response.hits.hits[i];
                        esClient.delete({
                            'index': 'file',
                            'type': '.percolator',
                            'id': hit._id
                        });
                    }
                }
            });
        });

        socket.on('subscribe', function (keyword) {
            var client = clients[socket.id];

            //remove all non alpha-numeric characters for security reasons regarding the inline scripting
            keyword = keyword.replace(/[^\w\s\u00C0-\u017F]+/g, '').toLowerCase();
            var searchScript = '_index["content"]["{{searchvalue}}"].tf()'.replace('{{searchValue}}', keyword);

            // create new percolator
            if (_.isString(keyword) && client.subscription.indexOf(keyword) <= -1) {
                esClient.index({
                    index: 'file',
                    type: '.percolator',
                    body: {
                        'query': {
                            'function_score': {
                                'query': {
                                    'match': {
                                        'content': keyword
                                    }
                                },
                                'boost_mode': 'replace',
                                'functions': [
                                    {
                                        'script_score': {
                                            'script': searchScript
                                        }
                                }
                            ]
                            }
                        },
                        socket: socket.id,
                        keyword: keyword
                    }
                }, function (error, response) {
                    if (error) {
                        throw error;
                    }
                    client.subscription.push(keyword);
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