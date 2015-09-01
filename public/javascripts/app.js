module.exports = angular.module('news', ['ngRoute', 'ngResource', 'ui.tinymce','ngMaterial', 'btford.socket-io'])
	.config(['$routeProvider', '$resourceProvider', '$httpProvider', '$locationProvider', '$mdThemingProvider',
		function($routeProvider, $resourceProvider, $httpProvider, $locationProvider, $mdThemingProvider) {
			$httpProvider.defaults.useXDomain = true;
			$httpProvider.defaults.withCredentials = true;
			delete $httpProvider.defaults.headers.common["X-Requested-With"];
			$httpProvider.defaults.headers.common["Accept"] = "application/json";
			$httpProvider.defaults.headers.common["Content-Type"] = "application/json";
			$routeProvider
			.when('/company', {
				templateUrl: './templates/news/company.html',
				controller: 'NewsController',
				controllerAs: 'newsCtrl',
				reloadOnSearch: false,
				activetab: 'company'
			})
				.when('/sandbox', {
					templateUrl: './templates/news/sandbox.html',
					reloadOnSearch: false,
					activetab:'sandbox'
				})
				.when('/post/:postId/', {
					templateUrl: './templates/news/news.html',
					reloadOnSearch: false
				})
				.when('/weekly', {
					templateUrl: './templates/news/weekly.html',
					reloadOnSearch: false,
					activetab: 'weekly'
				})
				.when('/activity', {
					templateUrl: './templates/news/activity.html',
					reloadOnSearch: false,
					activetab: 'activity'
				})
				.otherwise({
					redirectTo: '/company'
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
			$mdThemingProvider.theme('addExpenseWidget')
				.primaryPalette('green', {
					'default': '800'
				});
			$mdThemingProvider.theme('pollWidget')
				.primaryPalette('indigo', {
					'default': '800'
				});
			$mdThemingProvider.theme('stackWidget')
				.primaryPalette('pink', {
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