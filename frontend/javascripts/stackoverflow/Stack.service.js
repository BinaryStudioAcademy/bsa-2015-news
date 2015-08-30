var app = require('../app.js');

app.factory('StackService', stackService);

stackService.$inject = ['$resource'];

function stackService(resource) {
	return {
		getQuestions: getQuestions
	};

	function getQuestions(type) {
		var data = resource('http://team.binary-studio.com/asciit/api/v1/widget/questions/:type', {type: '@type'});
		return data.get(type).$promise;
	}
}


