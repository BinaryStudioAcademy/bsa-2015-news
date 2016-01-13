var app = require('../app.js');
	app.factory('CompanyService', CompanyService);

	CompanyService.$inject = ["$resource"];

	function CompanyService($resource) {
		return {
		};
	}
