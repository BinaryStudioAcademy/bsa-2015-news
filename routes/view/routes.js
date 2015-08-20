var common = require('./common');
module.exports = function(app){
	return {
		common: common(app)
	};
};