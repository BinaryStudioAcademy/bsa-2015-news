var app = require('../app');
app.factory("ExpenseService", ExpenseService);

var _ = require('lodash');

ExpenseService.$inject = ["$resource", "$q"];

function ExpenseService($resource, $q) {
	return {
		getFirstRate: getFirstRate,
		getBudgets: getBudgets,
		getAccUser: getAccUser,
		createExpense: createExpense
	};

	function getFirstRate() {
		return $resource("/accounting/currency").query({sort: "time ASC", limit: 1}).$promise;
	}

	function getBudgets(year) {
		var usersPromise = $resource('/profile/api/users').query().$promise;
		var budgetsPromise = $resource("/accounting/budget", { where: {"year": year}}).query().$promise;

		return $q.all([usersPromise, budgetsPromise]).then(function(data) {
			var users = data[0] || [];
			var budgets = data[1] || [];

			budgets.forEach(function(budget) {
				var user = _.find(users, {serverUserId: budget.creatorId}) || {serverUserId: "unknown id", name: "someone", surname: "unknown"};
				budget.creator = {
					global_id: user.serverUserId,
					name: user.name + " " + user.surname
				};
				delete budget.creatorId;
			});
			return budgets;
		});
	}

	function getAccUser() {
		return $q(function(resolve, reject) {
			$resource("/accounting/user/current").get().$promise.then(function(local_user) {
				$resource('/profile/api/users?serverUserId=' + local_user.global_id).query().$promise.then(function(global_user) {
					local_user.name = global_user[0].name + " " + global_user[0].surname;
					resolve(local_user);
				});
			});
		});
	}

	function createExpense(newExpense) {
		return $resource("/accounting/expense").save(newExpense).$promise;
	}

}