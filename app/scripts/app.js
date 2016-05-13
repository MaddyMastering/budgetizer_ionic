angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.add_member', {
    url: '/add_member',
    views: {
      'menuContent': {
        templateUrl: 'templates/add_member.html',
        controller: 'AddMemberCtrl'
      }
    }
  })

  .state('app.add_item', {
      url: '/add_item/:id',
      views: {
        'menuContent': {
          templateUrl: 'templates/add_item.html',
          controller: 'AddItemCtrl'
        }
      }
    })
    .state('app.home', {
      url: '/home',
      views: {
        'menuContent': {
          templateUrl: 'templates/home.html',
          controller: 'HomeCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/member/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/member.html',
        controller: 'MemberCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
