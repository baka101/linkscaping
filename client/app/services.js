angular.module('linkscaping.services', [])

.factory('LinkChecker', function ($http) {
  var checkLink = function(uri) {
    var test = uri;

    return $http.post('/check', {uri: uri})
      .success(function (data) {
        return data;
      })
      .error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        console.log('ERROR:');
        console.log('data', data);
        console.log('status', status);
        console.log('headers', headers);
        console.log('config', config);
      });
  };

  return {
    checkLink: checkLink
  };

})