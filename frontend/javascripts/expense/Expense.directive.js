var app = require('../app');
app.directive("expenseWidget", ExpenseDirective);

function ExpenseDirective() {
	return {
		restrict: "E",
		templateUrl: "./templates/expense/Expense.html",
		replace: true,
		controller: "ExpenseController",
		controllerAs: "expCtrl"
	};
}