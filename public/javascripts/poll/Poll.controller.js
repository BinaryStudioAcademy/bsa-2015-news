var app = require('../app');
app.controller("PollController", PollController);

PollController.$inject = ["PollService"];

function PollController(PollService) {
    var vm = this;

    vm.sections = [];
    vm.questions = [];
    vm.currentQuestion = {};
    vm.currentSection = {};
    vm.isShowConfirm = false;
    var currentQuestionCounter = 0;
    var currentSectionCounter = 0;

    vm.selectedElement = "";

    getQuestions();

    function getQuestions() {
        vm.sections = PollService.getQuestionnaire().template.sections;
        vm.currentSection = vm.sections[currentSectionCounter];
        vm.questions = vm.currentSection.questions;
        vm.currentQuestion = vm.questions[currentQuestionCounter];
        vm.selectedElement = vm.currentQuestion.options[0];
    }

    vm.showResults = showResults;
    function showResults() {
        currentQuestionCounter++;
        if(currentQuestionCounter == vm.questions.length) {
            currentQuestionCounter = 0;
            currentSectionCounter++;
            if(currentSectionCounter == vm.sections.length) {
                currentSectionCounter = 0;
                vm.isShowConfirm = true;
            }
            getQuestions();
        } else {
            vm.currentQuestion = vm.questions[currentQuestionCounter];
        }
        vm.selectedElement = vm.currentQuestion.options[0];
    }
}