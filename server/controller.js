'use strict';

module.exports = function (app, esClient, socket) {

    var config = require('../config');
    var fs = require('fs');
    var multer = require('multer');
    var _ = require('underscore');

    var upload = multer({
        dest: config.uploadDir
    });

    //initIndexIfNotExists();
    clearPercolator();

    app.post('/document', upload.single('document'), function (req, res) {
        var createdFileId = -1;
        if (!req.file) {
            res.status(400).end();
            return;
        }
        fs.readFile(req.file.path, 'utf-8', function (err, data) {
            if (err) {
                throw err;
            }
            esClient.create({
                'index': 'file',
                'type': 'document',
                'body': {
                    'title': req.file.originalname,
                    'content': data,
                    'published_at': new Date()
                }
            }, function (error, response) {
                if (error) {
                    throw error;
                }
                createdFileId = response._id;
                fs.unlink(req.file.path, function (err) {
                    if (err) {
                        throw err;
                    }
                });

                esClient.percolate({
                    index: 'file',
                    type: 'document',
                    id: createdFileId
                }, function (error, response) {
                    _.each(response.matches, function (match) {
                        esClient.get({
                            'id': match._id,
                            'index': 'file',
                            'type': '.percolator',
                            'fields': ['socket', 'keyword']
                        }, function (err, response) {
                            if (err) {
                                throw err;
                            }
                            var socketId = response.fields.socket,
                                notificationObject = {
                                    'filename': req.file.originalname,
                                    'fileId': createdFileId,
                                    'keyword': response.fields.keyword
                                };
                            socket.emitSocketId(socketId, notificationObject);
                        });
                    });

                });

                res.status(201).end();
            });
        });
    });

    app.get('/document', function (req, res) {
        if (!req.query.search) {
            res.status(400).send('no search value sent').end();
            return;
        }
        //remove all non alpha-numeric characters for security reasons regarding the inline scripting
        var search = req.query.search.replace(/[^\w\u00C0-\u017F]+/g, '').toLowerCase(),
            searchScript = '_index["content"]["{{searchvalue}}"].tf()'.replace('{{searchvalue}}', search);
        esClient.search({
                'body': {
                    'query': {
                        'function_score': {
                            'query': {
                                'match': {
                                    'content': search
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
                    'highlight': {
                        'fields': {
                            'content': {
                                'fragment_size': 50
                            },
                            'title': {
                                fragment_size: 0
                            }
                        }
                    },
                    fields: ['title']
                },
                'index': 'file',
                'type': 'document'
            },
            function (err, response) {
                if (err) {
                    throw err;
                }
                res.send(response.hits);
            });
    });

    function initIndexIfNotExists() {
        esClient.indices.delete({
            index: 'file'
        }, function () {
            console.log('creating index');
            esClient.indices.create({
                index: 'file'
            }, function () {
                esClient.indices.putMapping({
                    'body': {
                        'properties': {
                            'title': {
                                'type': 'string',
                                'index': 'not_analyzed',
                                'index_options': 'freqs'
                            },
                            'content': {
                                'type': 'string',
                            },
                            'published_at': {
                                'type': 'date'
                            }
                        }
                    },
                    'index': 'file',
                    'type': 'document'
                });
            });
        });
    }

    function clearPercolator() {
        var onDelete = function (error, response) {
            if (error) {
                console.log(error);
                console.log(response);
            }
        };
        esClient.search({
            'index': 'file',
            'type': '.percolator'
        }, function (error, response) {
            if (response.hits) {
                for (var i in response.hits.hits) {
                    var hit = response.hits.hits[i];
                    esClient.delete({
                        'index': 'file',
                        'type': '.percolator',
                        'id': hit._id
                    }, onDelete);
                }
            }
        });

    }
};