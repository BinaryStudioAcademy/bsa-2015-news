var app = require('../app');
app.directive("pollWidget", PollDirective);

function PollDirective() {
    return {
        restrict: "E",
        templateUrl: "./templates/poll/poll.html",
				replace: true
    };
}