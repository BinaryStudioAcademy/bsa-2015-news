var app = require('../app');
app.directive("stackWidget", StackDirective);

function StackDirective() {
	return {
		restrict: "E",
		templateUrl: "./templates/stackoverflow/stack.html",
		replace: true,
		controller: 'StackController',
		controllerAs: 'stackCtrl'
	};
}