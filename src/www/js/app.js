// Ionic myApp App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'myApp' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'myApp.services' is found in services.js
// 'myApp.controllers' is found in controllers.js
angular.module('myApp', ['ionic', 'myApp.controllers', 'myApp.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
$ionicConfigProvider.tabs.position('bottom'); //top

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the apps directive
    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/apps.html'
  })

  // Each app has its own nav history stack:
  .state('app.leadPage', {
    url: '/leadPage',
    views: {
      'app-leadPage': {
        templateUrl: 'templates/app-leadPage.html',
        controller: 'LeadPageCtrl'
      }
    }
  })

  .state('app.login', {
    url: '/login',
    views: {
      'app-login': {
        templateUrl: 'templates/app-login.html',
        controller: 'LoginCtrl'
      }
    }
  })

  .state('app.registe', {
    url: '/registe',
    views: {
      'app-registe': {
        templateUrl: 'templates/app-registe.html',
        controller: 'RegisteCtrl'
      }
    }
  })

  .state('app.main', {
    url: '/main',
    views: {
      'app-main': {
        templateUrl: 'templates/app-main.html',
        controller: 'MainCtrl'
      }
    }
  })

  //main页面子页面路由
 .state('app.main.applist', {
    url: '/applist',
    views: {
      'main-applist': {
        templateUrl: 'templates/main/main-applist.html',
        controller: 'AppListCtrl'
      }
    }
  })

   .state('app.main.message', {
    url: '/message',
    views: {
      'main-message': {
        templateUrl: 'templates/main/main-message.html',
        controller: 'MessageCtrl'
      }
    }
  })

   .state('app.main.setting', {
    url: '/setting',
    views: {
      'main-setting': {
        templateUrl: 'templates/main/main-setting.html',
        controller: 'SettingCtrl'
      }
    }
  })

  // applist子页面路由
   .state('app.main.applist.faction', {
    url: '/faction',
    templateUrl: 'templates/main/applist/applist-faction.html',
    controller: 'FactionCtrl'
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/main');

});
