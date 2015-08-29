var app = require('../app');
app.factory("ExpenseService", ExpenseService);

ExpenseService.$inject = ["$resource"];

function ExpenseService($resource) {
	return {
		getBudgets: getBudgets
	};

	function getBudgets(year) {
		return $resource("http://localhost:1335/budget", { where: {"year": year}}).query().$promise;
	}
}