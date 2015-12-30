var app = require('../app');
var _ = require('lodash');

app.controller('AdministrationController', AdministrationController);

AdministrationController.$inject = [
	'NewsService',
	'AdministrationService',
	'$q'
];

function AdministrationController(NewsService, AdministrationService, $q) {
	var vm = this;

	function reloadRoles() {
		NewsService.getRoles().then(function(data) {
			vm.roles = data;
			AdministrationService.getLocalRoles().then(function(data) {
				vm.roles.forEach(function(role) {
					var local = _.find(data, {global_role: role.role});
					role.local_role = local ? local.local_role : 'User';
					role.local_role_id = local ? local._id : undefined;
				});
			}, function(data) {
				vm.roles.forEach(function(role) {
					role.local_role = 'User';
				});
			});
		});
	}

	function reloadUsers() {
		NewsService.getFullUsers().then(function(data) {
			vm.users = data;
			AdministrationService.getLocalUsers().then(function(data) {
				vm.users.forEach(function(user) {
					var local = _.find(data, {global_id: user.serverUserId});
					user.local_role = local ? local.local_role : 'By global role';
					user.local_user_id = local ? local._id : undefined;
				});
				vm.localUsers = data;
			}, function(data) {
				vm.users.forEach(function(user) {
					user.local_role = 'By global role';
				});
			});
		});
	}

	reloadRoles();
	reloadUsers();

	vm.localRoleNames = ['User', 'Content Manager', 'Admin'];

	vm.updateRole = function(role) {
		if (role.local_role_id) {
			AdministrationService.updateLocalRole(role).then(function(data) {
				reloadRoles();
			});
		}
		else {
			AdministrationService.createLocalRole(role).then(function(data) {
				reloadRoles();
			});
		}
	};

	vm.updateUserRole = function(user) {
		if (user.local_user_id) {
			AdministrationService.updateLocalUser(user).then(function(data) {
				reloadRoles();
			});
		}
		else {
			AdministrationService.createLocalUser(user).then(function(data) {
				reloadRoles();
			});
		}
	};
}