// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers_teach', 'starter.services', 'starter.directives'])
.value('UserData', {
    SignDate: "",    //選擇的發注日期
    Group: {},       //選擇的部門
    Orders: [],      //訂單明細
    LastPageCount:-1 //上一頁要跳幾次, 專門為訂單設計
})
.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {

    });
})
.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('app', {
        url: '/app',
        templateUrl: 'templates/menu.html',
        controller: 'menuCtrl'
    })
    .state('app.001', {
        url: '/001',
        views: {
            'menuContent': {
                templateUrl: 'templates/001ChooseDate.html',
                controller: '001Ctrl'
            }
        }
    })
    .state('app.002', {
        url: '/002',
        views: {
            'menuContent': {
                templateUrl: 'templates/002ChooseGroup.html',
                controller: '002Ctrl'
            }
        }
    })
    .state('app.003', {
        url: '/003',
        cache:false,
        views: {
            'menuContent': {
                templateUrl: 'templates/003OrderItem.html',
                controller: '003Ctrl'
            }
        }
    })
    .state('app.101', {
        url: '/101',
        views: {
            'menuContent': {
                templateUrl: 'templates/101OrderDetail.html',
                controller: '101Ctrl'
            }
        }
    })
    .state('app.102', {
        url: '/102',
        views: {
            'menuContent': {
                templateUrl: 'templates/102OrderHistory.html',
                controller: '102Ctrl'
            }
        }
    })
    ;
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/001');
})
;