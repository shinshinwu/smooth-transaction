(function() {
  var app = angular.module('smooth-transaction', []);

  app.controller('MainCtrl', ['$scope', '$http', function($scope, $http) {

  }]);

  app.directive('login', function() {
    return {
      restrict: 'E',
      templateUrl: '/views/login.html'
    }
  });

  app.directive('signup', function() {
    return {
      restirct: 'E',
      templateUrl: '/views/signup.html'
    }
  });

})();