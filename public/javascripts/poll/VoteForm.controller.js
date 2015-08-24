var app = require('../app');
app.controller("VoteFormController", VoteFormController);

function VoteFormController() {
    var vm = this;
    vm.vote = {};
    vm.sendVote = sendVote;

    function sendVote() {

    }
}