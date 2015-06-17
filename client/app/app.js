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

  //when url status comes in, add the data to $scope
  socket.on('urlStatus', function(status){
    $scope.$apply(function () {
      console.log('Received url status:', status);
      $scope.status = status;
    });
  });

  //as link statuses come in, add the data to $scope
  socket.on('linkStatus', function(status){
    $scope.$apply(function () {
      console.log('Received link status:', status);

      if (status.code !== 200) {
        status.displayClass = 'danger';
      }

      $scope.links.push(status);
    });
  });

  $scope.checkStatus = function (isValid) {
    //emit test event

    if (!isValid) {
      alert('Please enter valid URL');
      $scope.uri = '';
      return;
    };

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
      });
  }

});