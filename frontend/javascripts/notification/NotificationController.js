var app = require('../app');

app.controller('NotificationController', NotificationController);

function NotificationController() {

	var vm = this;

	vm.text = 'notifications';

}