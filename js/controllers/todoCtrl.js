/*global todomvc, angular */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */
 (
   (region_id = 11)
   AND
   (
     (
       (NOT expired)
       AND
       (listing_type_id <> 2)
     )
     OR
 	   (
 	   	 funded AND
 	     (listing_type_id = 2)
 	   )
 	 )
 	 AND
 	 (
 	   (region_id = 11)
 	   OR
 	   (listing_type_id = 2)
 	 )
 )

todomvc.controller('TodoCtrl', function TodoCtrl($scope, $location, filterFilter, angularFire) {
	$scope.todos = [];

	var url = new Firebase("https://erik12.firebaseio.com/todos");
	angularFire(url, $scope, 'todos');

	$scope.newTodo = '';
	$scope.editedTodo = null;

	$scope.$watch('$scope.todos', function (newValue, oldValue) {
		$scope.remainingCount = filterFilter($scope.todos, { completed: false }).length;
		$scope.completedCount = $scope.todos.length - $scope.remainingCount;
		$scope.allChecked = !$scope.remainingCount;
	}, true);

	if ($location.path() === '') {
		$location.path('/');
	}

	$scope.location = $location;

	$scope.$watch('location.path()', function (path) {
		$scope.statusFilter = (path === '/active') ?
			{ completed: false } : (path === '/completed') ?
			{ completed: true } : null;
	});

	$scope.addTodo = function () {
		var newTodo = $scope.newTodo.trim();
		if (!newTodo.length) {
			return;
		}

		$scope.todos.push({
			title: newTodo,
			completed: false
		});

		$scope.newTodo = '';
	};

	$scope.editTodo = function (todo) {
		$scope.editedTodo = todo;
		// Clone the original todo to restore it on demand.
		$scope.originalTodo = angular.extend({}, todo);
	};

	$scope.doneEditing = function (todo) {
		$scope.editedTodo = null;
		todo.title = todo.title.trim();

		if (!todo.title) {
			$scope.removeTodo(todo);
		}
	};

	$scope.revertEditing = function (todo) {
		$scope.todos[$scope.todos.indexOf(todo)] = $scope.originalTodo;
		$scope.doneEditing($scope.originalTodo);
	};

	$scope.removeTodo = function (todo) {
		$scope.todos.splice($scope.todos.indexOf(todo), 1);
	};

	$scope.clearCompletedTodos = function () {
		$scope.$scope.todos = $scope.todos = $scope.todos.filter(function (val) {
			return !val.completed;
		});
	};

	$scope.markAll = function (completed) {
		$scope.todos.forEach(function (todo) {
			todo.completed = completed;
		});
	};

	// angularFire(url, $scope, 'todos');
});
