angular.module('linkscaping', [
  'linkscaping.services',
])

.controller('linkscapingCtrl', function ($scope, LinkChecker) {
  $scope.status = {};
  $scope.links = [];
  $scope.isLoading = false;
  var socket = io();


  socket.on('status', function(msg){
    console.log('Server status:', msg);
  });

  $scope.checkStatus = function () {
    
    socket.emit('request', 'checkStatus');

    //clear out existing data
    $scope.isLoading = true;
    $scope.status = {};
    $scope.links = [];

    //fetch new data
    LinkChecker.checkLink($scope.uri)
      .then(function (data) {
        $scope.uri = '';
        $scope.isLoading = false;
        $scope.status = data.data;

        data.data.links.forEach(function (item) {
          if (item.code !== 200) {
            item.displayClass = 'danger';
          }
        });

        $scope.links = data.data.links;
      });
  }

});