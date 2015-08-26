var app = require('../app');
app.directive("hrWidget", HRDirective);

function HRDirective() {
	return {
		restrict: "E",
		templateUrl: "./templates/hr-activity/HR.html",
		replace: true
	};
}