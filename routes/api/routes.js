var notification = require('./notification');
module.exports = function(app){
	return {
		notification: notification(app)
	};
};