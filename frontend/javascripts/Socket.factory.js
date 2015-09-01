var app = require('./app');
app.factory('socket', SocketFactory);

SocketFactory.$inject = ['socketFactory'];

function SocketFactory(socketFactory) {
    return socketFactory({
        ioSocket: io.connect('/')
    });
}