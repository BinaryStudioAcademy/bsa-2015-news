var app = require('../app.js');

app.controller('StackController', StackController);

StackController.$inject = ['StackService'];

function StackController(StackService) {
	var vm = this;

	vm.collapsed = true;
	
	vm.questions = [];
	vm.type = 'recent';
	vm.getQuestions = getQuestions;

	getQuestions(vm.type);

	function getQuestions(type) {
		StackService.getQuestions(type).then(function(data) {
			vm.questions = data;
		});
	}
}