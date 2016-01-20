var app = require('./app');
app.factory('socket', SocketFactory);

SocketFactory.$inject = ['socketFactory'];

function SocketFactory(socketFactory) {
    return socketFactory({
        //ioSocket: io.connect('http://localhost:4035')
        ioSocket: io.connect('http://216.86.147.185:4035')
    });
}