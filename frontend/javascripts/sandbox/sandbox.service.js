var app = require('../app.js');
	app.factory('SandboxService', SandboxService);

	SandboxService.$inject = ["$resource"];

	function SandboxService($resource) {
		return {
		};
	}
