var app = require('../app');
var _ = require('lodash');
app.controller("ReviewController", ReviewController);

ReviewController.$inject = ["ReviewService", "$mdDialog"];

function ReviewController(ReviewService, $mdDialog) {
	var vm = this;

	vm.currentUser = {id: '1'};

	vm.periods = [
	{
		value: 'today',
		text: 'today'
	},
	{
		value: 'week',
		text: 'this week'
	},
	{
		value: 'month',
		text: 'this month'
	}
	];
	vm.period = vm.periods[0];

	vm.upcoming = ReviewService.getPopular();
	vm.upcoming.week = vm.upcoming.month.slice(0, 5);
	vm.upcoming.today = vm.upcoming.month.slice(0, 2);

	vm.getRequestStatus = function(request) {
		return _.find(request.users, {id: vm.currentUser.id});
	};

	vm.showDetails = function(ev, request) {
		$mdDialog.show(
			$mdDialog.alert()
				//.parent(angular.element(document.querySelector('#code-review-widget')))
				.clickOutsideToClose(true)
				.title(request.title)
				.content(request.details)
				.ariaLabel('Request Details')
				.ok('Close')
				.targetEvent(ev)
		);
	};
}