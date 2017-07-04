// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','starter.directives'])
.run(function ($ionicPlatform) {
})
.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
    .state('login', {
        url: '/login',
        cache: false,
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
    })
    .state('menu', {
        url: '/menu',
        cache: false,
        templateUrl: 'templates/menu.html',
        controller: 'menuCtrl'
    })
;
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');
})

;