var app = require('../app.js');

app.controller('StackController', stackController);

stackController.$inject = ['StackService'];

function stackController(StackService) {
	var vm = this;
	vm.questions = StackService.getQuestions();

	console.log(vm.questions);
}