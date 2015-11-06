var http = require('http');
var port = 8080;
var server = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hallo Welt!');
});
server.listen(port);

console.log('Der Server ist erreichbar unter http://127.0.0.1:' + port + '/');
