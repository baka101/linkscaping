angular.module('linkscaping', [
  'linkscaping.services'
])

.controller('linkscapingCtrl', function ($scope, LinkChecker) {
  $scope.status = {};
  $scope.links = [];

  $scope.checkStatus = function () {
    LinkChecker.checkLink($scope.uri)
      .then(function (data) {
        $scope.status = data.data;
        $scope.links = data.data.links;
      });
  }

});