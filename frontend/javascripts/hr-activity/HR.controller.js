var app = require('../app');
app.controller("HRController", HRController);

HRController.$inject = ["HRService"];

function HRController(HRService) {
	var vm = this;

	vm.activities = HRService.getActivities();
}