var app = require('../app.js');

app.controller('StackController', stackController);

stackController.$inject = ['StackService'];

function stackController(StackService) {
	var vm = this;
	vm.questions = [];
	vm.type = 'recent';
	vm.getQuestions = getQuestions;

	getQuestions(vm.type);

	function getQuestions(type) {
		vm.questions = StackService.getQuestions(type);
	}
}