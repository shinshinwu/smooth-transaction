'use strict';


var myApp = angular.module('myApp', ['ngRoute'])
.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
	// $httpProvider.defaults.useXDomain = true;
 //  delete $httpProvider.defaults.headers.common['X-Requested-With'];
 //  $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

  // $routeProvider.when('/view1', {
  //   templateUrl: 'view1/view1.html',
  //   controller: 'View1Ctrl' 
  // });
}])

myApp.controller('mainCtrl', ['$scope', '$http', function($scope, $http){
	$scope.submit = function(user){
		console.log(user)
		$http.post('http://localhost:3000/users', user).
			success(function(data){
				console.log(data)
			}).
			error(function(){
				console.log('failed')
			});
	}

	$scope.test = function(){
		console.log('trying...');

		$http.get('http://localhost:3000/users').
			success(function(data){
				console.log(data)
			}).
			error(function(data){
				console.log('database lookup failed')
		})
	}

}]);
