angular.module('myApp.controllers', [])
  //定义常量
  .constant('fooConfig', {
    apiHost: 'http://0.0.0.0:3000/api',
  })

  .controller('LeadPageCtrl', function ($scope, $state, $ionicSlideBoxDelegate) {
    $scope.state = $state;
    $scope.slideChanged = function (index) {
      $scope.slideIndex = index;
    };
  })

  .controller('LoginCtrl', function ($scope, $state, fooConfig, $http) {
    $scope.state = $state;
    $scope.username = '';
    $scope.password = '';
    $scope.doLogin = function (username, password) {
      var registeUrl = fooConfig.apiHost + '/Users/login';
      var postData = {
        "username": username,
        "password": password
      };
      console.log(postData);
      $http.post(registeUrl, postData).
        success(function (data, status, headers, config) {
          console.log('login成功！！');
          $state.go('app.main', {}, { reload: true });
        }).
        error(function (data, status, headers, config) {
          console.log("login失败！！");
        });
    };

  })

  .controller('RegisteCtrl', function ($scope, $state, fooConfig, $http) {
    $scope.state = $state;
    $scope.username = '';
    $scope.email = '';
    $scope.password = '';
    $scope.doRegiste = function () {
      var registeUrl = fooConfig.apiHost + '/Users/login';
      var postData = {
        "username": $scope.username,
        "email": $scope.email,
        "emailVerified": false,
        "password": $scope.password
      };
      console.log(postData);
      $http.post(registeUrl, postData).
        success(function (data, status, headers, config) {
          console.log('注册成功！！');
        }).
        error(function (data, status, headers, config) {
          console.log("注册失败！！");
        });
    };

  })

  //主界面controller
  .controller('MainCtrl', function ($scope, $state, fooConfig, $http) {
    $scope.state = $state;
    // $state.go('app.main.applist');
  })

  /*
   *主界面main下面的子页面
   *AppListCtrl --- 列出所有的小应用
   *MessageCtrl --- 我的消息页面
   *SettingCtrl --- 设置页面
  */
  .controller('AppListCtrl', function ($scope, $state, fooConfig, $http) {
    $scope.state = $state;
    $scope.$on("$ionicView.afterLeave", function(event, data){
      // handle event
      console.log("State Params: ", data.stateParams);
    });
  })

  .controller('MessageCtrl', function ($scope, $state, fooConfig, $http) {
    $scope.state = $state;
  })

  .controller('SettingCtrl', function ($scope, $state, fooConfig, $http) {
    $scope.state = $state;
  })

  /*applist子页面的路由
   *applist-faction --- 小说页面
   *
  */
  .controller('FactionCtrl', function ($scope, $state, fooConfig, $http) {
    $scope.state = $state;
  })