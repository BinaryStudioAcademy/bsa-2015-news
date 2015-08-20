var socketio = require('socket.io');
var config = require('../config/');
var mongoStore = require('../units/appContext');
var appContext = require('../units/appContext');
var socketManager = require('./socketManager');
var roomManager = require('./roomManager');
var mediator = require('../units/mediator');

module.exports = function(server){
	
	appContext.io = socketio(server);

	appContext.io.use(passportSocketIo.authorize({
		cookieParser: cookieParser,
		key: 'connect.sid',     
		secret: config.session.secret,  
		store: appContext.sessionStore
	}));

	appContext.io.on('connection', function (socket) {
		socketManager.addSocketForUser(socket.request.user.id, socket.id);

		socket.on('disconnect', function () {
			socketManager.removeSocketForUser(socket.request.user.id, socket.id);
		});

	});
	
 return appContext.io;
};