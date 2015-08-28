var app = require('../app');
app.controller("ExpenseController", ExpenseController);

ExpenseController.$inject = ["ExpenseService"];

function ExpenseController(ExpenseService) {
	var vm = this;

	//ExpenseService.getPopular().then(function(data) {
	//	vm.popular = data;
	//});
	//vm.periods = [
	//{
	//	value: 'today',
	//	text: 'Upcoming today'
	//},
	//{
	//	value: 'week',
	//	text: 'Upcoming this week'
	//},
	//{
	//	value: 'month',
	//	text: 'Upcoming this month'
	//}
	//];
	//vm.period = vm.periods[0];
//
	//vm.upcoming = ExpenseService.getPopular();
	//vm.upcoming.week = vm.upcoming.month.slice(0, 5);
	//vm.upcoming.today = vm.upcoming.month.slice(0, 2);
}