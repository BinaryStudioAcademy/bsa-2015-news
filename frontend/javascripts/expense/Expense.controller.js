var app = require('../app');
app.controller("ExpenseController", ExpenseController);

var _ = require('lodash');

ExpenseController.$inject = ["ExpenseService", "$filter", "$scope"];

function ExpenseController(ExpenseService, $filter, $scope) {
	var vm = this;

	vm.collapsed = true;

	vm.minDate = new Date(0);

	vm.currencies = ['UAH', 'USD'];

	$scope.format = 'dd-MMMM-yyyy';
	$scope.status = {
		opened: false
	};
	$scope.open = function() {
		$scope.status.opened = true;
	};
	$scope.dateOptions = {
		formatYear: 'yy',
		startingDay: 1
	};

	ExpenseService.getFirstRate().then(function(data) {
		vm.minDate = new Date(data[0].time * 1000);
		vm.minDate.setHours(0);
		vm.minDate.setMinutes(0);
		vm.minDate.setSeconds(0);
		vm.minDate.setMilliseconds(0);
	});

	vm.updateAnnualCategories = function() {
		vm.maxDate = new Date();
		if (vm.newExpense.date) {
			ExpenseService.getBudgets(vm.newExpense.date.getFullYear()).then(function(data) {

				vm.annualCategories = [];
				data.forEach(function(budget) {
					var access = _.find(vm.accUser.categories, function(cat) {
						return cat.id === budget.category.id;
					});
					access = access && access.level > 1;
					if (access || vm.accUser.admin || vm.accUser.role === 'ADMIN') {
						vm.annualCategories.push({
							id: budget.category.id,
							name: budget.category.name,
							left: budget.category.budget - budget.category.used,
							subcategories: _.map(budget.category.subcategories, function(subcategory) {
								return {
									id: subcategory.id,
									name: subcategory.name,
									left: subcategory.budget - subcategory.used
								};
							})
						});
					}
				});
			});
		}
	};

	function resetNewExpense() {
		var date = new Date();
		date.setHours(0);//
		date.setMinutes(0);//
		date.setSeconds(0);
		date.setMilliseconds(0);
		vm.maxDate = new Date();
		vm.newExpense = { date: date, currency: "UAH" };
	}

	resetNewExpense();

	ExpenseService.getAccUser().then(function(user) {
		vm.accUser = user;
		vm.updateAnnualCategories();
	});

	vm.createExpense = function() {
		vm.newExpense.creatorId = vm.accUser.global_id;
		vm.newExpense.time = Number((vm.newExpense.date.getTime() / 1000).toFixed());
		delete vm.newExpense.date;
		ExpenseService.createExpense(vm.newExpense).then(function() {
			resetNewExpense();
			$scope.expenseForm.$setPristine();
		});
	};

	vm.getAnnualCategory = function() {
		return _.find(vm.annualCategories, function(category) {
			return category.id === vm.newExpense.categoryId;
		});
	};

	vm.getAnnualSubcategory = function() {
		return _.find(vm.getAnnualSubcategories(), function(subcategory) {
			return subcategory.id === vm.newExpense.subcategoryId;
		});
	};

	vm.getAnnualSubcategories = function() {
		var cat = vm.getAnnualCategory();
		return cat ? cat.subcategories : [];
	};
	/*
	// Create new expense
	vm.expense = {};
	vm.expense.currency = "UAH";
	vm.currencies = ["UAH", "USD"];

	vm.setPersonal = setPersonal;
	function setPersonal(isPersonal) {
		vm.expense.personal = !isPersonal;
	}

	vm.date = new Date();
	vm.createExpense = createExpense;

	vm.currentUser = {
		id: "55ddbde6d636c0e46a23fc90",
		budget: {used: 0, left: 0}
	};
	vm.exchangeRate = 22.0;

	vm.budgets = [];
	getBudgets();
	function getBudgets() {
		ExpenseService.getBudgets(vm.date.getFullYear()).then(function(data) {
			vm.budgets = data;
		});
	}

	function createExpense(categoryModel, subcategoryModel) {
		// Setting id's
		vm.expense.categoryId = categoryModel.id;
		vm.expense.subcategoryId = subcategoryModel.id;
		vm.expense.creatorId = vm.currentUser.id;
		// Convert time to timestamp
		vm.expense.time = Math.round(new Date(vm.date).getTime() / 1000);
		// Personal
		if(!vm.expense.personal) delete vm.expense.personal;

		// Posting
		ExpenseService.createExpense(vm.expense).then(function() {
			vm.expense = {};
		});
	}

	// Categories, subcategories for the post form
	vm.categories = [];
	vm.subcategories = [];
	vm.getSubcategories = getSubcategories;

	getCategories();

	function getCategories() {
		ExpenseService.getCategories().then(function(data) {
			vm.categories = data;
		});
	}

	function getSubcategories(categoryModel) {
		vm.leftBudget = 0;
		vm.expense.personal = false;

		if(typeof categoryModel != "undefined") {
			for(var category in vm.categories) {
				if(vm.categories[category].id == categoryModel.id) {
					vm.subcategories = [];
					vm.categories[category].subcategories.forEach(function(subcategory) {
						vm.subcategories.push(subcategory);
					});
					break;
				}
			}
			setLeftBudget(categoryModel);
		} else vm.subcategories = [];
	}

	vm.leftBudget = 0;
	vm.leftSubcategoryBudget = 0;
	vm.setPersonalLeftBudget = setPersonalLeftBudget;
	vm.budgetType = "";

	function setPersonalLeftBudget(categoryModel, subcategoryModel) {
		if(categoryModel) {
			vm.currentUser = ExpenseService.getCurrentUser();
			if(vm.expense.personal) {
				if(vm.expense.currency == "UAH") {
					vm.leftBudget = vm.currentUser.budget.left;
				} else {
					vm.leftBudget = vm.currentUser.budget.left / vm.exchangeRate;
				}
				vm.budgetType = "Personal";
			} else {
				setLeftBudget(categoryModel);
				setLeftSubcategoryBudget(categoryModel, subcategoryModel);
			}
		}
	}

	vm.setLeftBudget = setLeftBudget;
	function setLeftBudget(categoryModel) {
		if(!vm.expense.personal && categoryModel) {
			var budget = $filter('filter')(vm.budgets, {category: {id: categoryModel.id}});
			if(vm.expense.currency == "UAH") {
				vm.leftBudget = (budget[0].category.budget - budget[0].category.used) * vm.exchangeRate;
			} else {
				vm.leftBudget = budget[0].category.budget - budget[0].category.used;
			}
			vm.budgetType = categoryModel.name;
		} else vm.leftBudget = 0;
	}

	vm.setLeftSubcategoryBudget = setLeftSubcategoryBudget;
	function setLeftSubcategoryBudget(categoryModel, subcategoryModel) {
		if(!vm.expense.personal && subcategoryModel) {
			var budget = $filter('filter')(vm.budgets, {category: {id: categoryModel.id}});
			var subcategory = $filter('filter')(budget[0].category.subcategories, {id: subcategoryModel.id});
			if(subcategory.length !== 0) {
				if(vm.expense.currency == "UAH") {
					vm.leftSubcategoryBudget = (subcategory[0].budget - subcategory[0].used) * vm.exchangeRate;
				} else {
					vm.leftSubcategoryBudget = subcategory[0].budget - subcategory[0].used;
				}
			}
			else vm.leftSubcategoryBudget = 0;
		} else vm.leftSubcategoryBudget = 0;
	}

	vm.changeCurrency = changeCurrency;
	function changeCurrency(categoryModel, subcategoryModel) {
		setPersonalLeftBudget(categoryModel);
		setLeftSubcategoryBudget(categoryModel, subcategoryModel);
	}*/
}