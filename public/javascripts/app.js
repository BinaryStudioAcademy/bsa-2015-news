module.exports = angular.module('news', ['ngRoute', 'ngResource', 'ui.tinymce','ngMaterial'])
	.config(['$routeProvider', '$resourceProvider', '$httpProvider', '$locationProvider', '$mdThemingProvider',
		function($routeProvider, $resourceProvider, $httpProvider, $locationProvider, $mdThemingProvider) {
			$routeProvider
				.when('/', {
					templateUrl: './templates/news/news.html',
					controller: 'NewsController',
					controllerAs: 'newsCtrl'
				})
				.otherwise({
					redirectTo: '/'
				});
			$resourceProvider.defaults.stripTrailingSlashes = false;
			$mdThemingProvider.theme('reviewWidget')
				.primaryPalette('orange', {
					'default': '800'
				});
			$mdThemingProvider.theme('hrWidget')
				.primaryPalette('teal', {
					'default': '800'
				});
<<<<<<< HEAD
=======
			$mdThemingProvider.theme('addExpenseWidget')
				.primaryPalette('green', {
					'default': '800'
				});
>>>>>>> ef8a1fd8ca3b8fdb9f52071f27442b9f80c14da8
			$mdThemingProvider.theme('pollWidget')
				.primaryPalette('indigo', {
					'default': '800'
				});
			// Приклад теми:
			//$mdThemingProvider.theme('default')
			//	.primaryPalette('blue')
			//	.accentPalette('indigo')
			//	.warnPalette('red')
			//	.backgroundPalette('grey');
		}
	]);