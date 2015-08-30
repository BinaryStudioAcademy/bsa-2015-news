var app = require('../app');
app.factory("ExpenseService", ExpenseService);

ExpenseService.$inject = ["$resource"];

function ExpenseService($resource) {
	return {
		getBudgets: getBudgets,
		getCategories: getCategories,
		createExpense: createExpense,
		getCurrentUser: getCurrentUser
	};

	function getBudgets(year) {
		return $resource("http://localhost:1335/budget", { where: {"year": year}}).query().$promise;
	}

	function getCategories() {
		return $resource("http://localhost:1335/category/:id", { id: "@id" }).query().$promise;
	}

	function createExpense(newExpense) {
		return $resource("http://localhost:1335/expense/:id", { id: "@id" }).save(newExpense).$promise;
	}

	function getCurrentUser() {
		return {
			id: "55ddbde6d636c0e46a23fc90",
			budget: {used: 0, left: 0}
		};
	}
}