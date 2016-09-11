angular.module('myApp.controllers', [])
//定义常量
.constant('fooConfig', {
    apiHost: 'http://0.0.0.0:3000/api',
})

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('LeadPageCtrl', function($scope, $state, $ionicSlideBoxDelegate) {
  $scope.slideChanged = function(index) {
      $scope.slideIndex = index;
  };
})

.controller('LoginCtrl', function($scope, $state, fooConfig, $http) {
  $scope.username = '';
  $scope.password = '';
  $scope.doLogin = function(username, password){
    var registeUrl = fooConfig.apiHost+'/Users/login';
    var postData = {
      "username": username,
      "password": password
    };
    console.log(postData);
    $http.post(registeUrl, postData).
      success(function(data, status, headers, config) {
        console.log('login成功！！');
        event.preventDefault();
        $state.go('app.registe');
      }).
      error(function(data, status, headers, config) {
        console.log("login失败！！");
      });
    };
  
})

.controller('RegisteCtrl', function($scope, $state, fooConfig, $http) {
  $scope.username = '';
  $scope.email = '';
  $scope.password=
  $scope.doRegiste = function(){
    var registeUrl = fooConfig.apiHost+'/Users/login';
    var postData = {
      "username": $scope.username,
      "email": $scope.email,
      "emailVerified": false,
      "password": $scope.password
    };
    console.log(postData);
    $http.post(registeUrl, postData).
      success(function(data, status, headers, config) {
        console.log('注册成功！！');
      }).
      error(function(data, status, headers, config) {
        console.log("注册失败！！");
      });
    };
  
});