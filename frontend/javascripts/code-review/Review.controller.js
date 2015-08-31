var app = require('../app');
var _ = require('lodash');
app.controller("ReviewController", ReviewController);

ReviewController.$inject = ["ReviewService"];

function ReviewController(ReviewService) {
	var vm = this;

	vm.currentUser = {id: '1'};

	vm.periods = [
	{
		value: 'today',
		text: 'Upcoming today'
	},
	{
		value: 'week',
		text: 'Upcoming this week'
	},
	{
		value: 'month',
		text: 'Upcoming this month'
	}
	];
	vm.period = vm.periods[0];

	vm.upcoming = ReviewService.getPopular();
	vm.upcoming.week = vm.upcoming.month.slice(0, 5);
	vm.upcoming.today = vm.upcoming.month.slice(0, 2);

	vm.getRequestStatus = function(request) {
		return _.find(request.users, {id: vm.currentUser.id});
	};
}