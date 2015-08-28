var app = require('../app');
app.factory("ExpenseService", ExpenseService);

ExpenseService.$inject = ["$resource"];

function ExpenseService($resource) {
	return {
		getWorld: getWorld
	};

	function getWorld() {
		return 'Hello world';
		//return $resource("http://team.binary-studio.com/Expenser/api/v1/Expenserequest/popular").query().$promise;
	}
}