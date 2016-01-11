var app = require('../app');
var _ = require('lodash');
app.controller("ReviewController", ReviewController);

ReviewController.$inject = ["ReviewService", "$mdDialog"];

function ReviewController(ReviewService, $mdDialog) {
	var vm = this;

	vm.collapsed = true;

	vm.periods = [
	{
		value: 'today',
		text: 'today'
	},
	{
		value: 'week',
		text: 'in a week'
	},
	{
		value: 'month',
		text: 'in a month'
	}
	];
	vm.period = vm.periods[1];

	ReviewService.getUser().then(function(data) {
		vm.currentUser = data;
	});

	vm.getRequestStatus = function(request) {
		return _.find(request.users, {binary_id: vm.currentUser.id});
	};

	vm.updateUpcoming = function() {
		ReviewService.getRequests(vm.period.value).then(function(data) {
			vm.upcoming = data;
		});
	};

	vm.updateUpcoming();

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

	vm.sendOffer = function(request) {
		ReviewService.sendOffer(request, vm.currentUser).then(function(data) {
			vm.updateUpcoming();
		});
	};

	vm.cancelOffer = function(request) {
		ReviewService.cancelOffer(request).then(function(data) {
			vm.updateUpcoming();
		});
	};
}