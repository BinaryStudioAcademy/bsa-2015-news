var app = require('../app');
var _ = require('lodash');

app.controller('AdministrationController', AdministrationController);

AdministrationController.$inject = [
	'NewsService',
	'AdministrationService'
];

function AdministrationController(NewsService, AdministrationService) {
	var vm = this;

	NewsService.getFullUsers().then(function(data) {
		vm.users = data;
	});

	NewsService.getRoles().then(function(data) {
		vm.roles = data;
	});

	AdministrationService.getLocalUsers().then(function(data) {
		vm.localUsers = data;
	});

	AdministrationService.getLocalRoles().then(function(data) {
		vm.localRoles = data;
	});

	vm.localRoles = ['Admin', 'Manager', 'User'];
}