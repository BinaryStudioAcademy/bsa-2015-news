var app = require('../app');
app.directive("codeReviewWidget", ReviewDirective);

function ReviewDirective() {
	return {
		restrict: "E",
		templateUrl: "./templates/code-review/Review.html",
		replace: true
	};
}