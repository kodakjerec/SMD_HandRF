// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', [
    'ionic'
    , 'starter.controllers_teach'
    , 'starter.services'
    , 'starter.directives'
    , 'chart.js'
])
//teach006_constant
.constant('version', '1')
//teach006_value
.value('company', 'PXMART')
.value('members', function () {
    return 'list members:';
})
.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {

    });
})
.config(function ($stateProvider, $urlRouterProvider, myProviderProvider, $provide, version) {
    //Provider 中途指定
    myProviderProvider.setVersion('Reloaded');

    //teach006_value_with_decorator
    //value可在config中被decorator修改資料
    $provide.decorator('company', function ($delegate) {
        return $delegate + '-RD2';
    });
    //teach006_constant_used in config
    console.log("Version: " + version);

    $stateProvider
    .state('Others001', {
        url: '/Others001',
        templateUrl: 'templates/Others001_PixeltoCM.html',
        controller: 'Others001Ctrl'
    })
    .state('app', {
        url: '/app',
        templateUrl: 'templates/menu.html'
    })
    .state('app.teach001', {
        url: '/teach001',
        views: {
            'menuContent': {
                templateUrl: 'templates/teach001.html',
                controller: 'teach001Ctrl'
            }
        }
    })
    .state('app.teach002', {
        url: '/teach002',
        views: {
            'menuContent': {
                templateUrl: 'templates/teach002.html',
                controller: 'teach002Ctrl'
            }
        }
    })
    .state('app.teach003', {
        url: '/teach003',
        views: {
            'menuContent': {
                templateUrl: 'templates/teach003.html',
                controller: 'teach003Ctrl'
            }
        }
    })
    .state('app.teach004', {
        url: '/teach004',
        views: {
            'menuContent': {
                templateUrl: 'templates/teach004.html',
                controller: 'teach004Ctrl'
            }
        }
    })
    .state('app.teach005', {
        url: '/teach005',
        views: {
            'menuContent': {
                templateUrl: 'templates/teach005.html',
                controller: 'teach005Ctrl'
            }
        }
    })
    .state('app.teach006', {
        url: '/teach006',
        views: {
            'menuContent': {
                templateUrl: 'templates/teach006.html'
            }
        }
    })
    .state('app.teach007', {
        url: '/teach007',
        views: {
            'menuContent': {
                templateUrl: 'templates/teach007.html'
            }
        }
    })
    .state('app.teach008', {
        url: '/teach008',
        views: {
            'menuContent': {
                templateUrl: 'templates/teach008_Table.html',
                controller: 'teach008Ctrl'
            }
        }
    })
    .state('app.teach009', {
        url: '/teach009',
        views: {
            'menuContent': {
                templateUrl: 'templates/teach009_FlexTable.html',
                controller: 'teach008Ctrl'
            }
        }
    })
    .state('app.WebSocketClient', {
        url: '/WebSocketClient',
        views: {
            'menuContent': {
                templateUrl: 'templates/WebSocketClient.html',
                controller: 'WebSocketClientCtrl'
            }
        }
    })
    ;
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/teach006');
});