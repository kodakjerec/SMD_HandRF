// Ionic Starter App
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.directives'])
.run(function ($ionicPlatform) {
})
.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('CheckIn', {
        url: '/CheckIn',
        cache: false,
        templateUrl: 'templates/_11_CheckIn.html',
        controller: 'CheckInCtrl'
    })
    .state('IR_CarNo', {
        url: '/IR_CarNo',
        cache: false,
        templateUrl: 'templates/_12_ItemReceive_CarNo.html',
        controller: 'IR_CarNoCtrl'
    })
    .state('IR_PaperNo', {
        url: '/IR_PaperNo',
        cache: false,
        templateUrl: 'templates/_12_ItemReceive_PaperNo.html',
        controller: 'IR_PaperNoCtrl'
    })
    .state('IR_ItemCode', {
        url: '/IR_ItemCode',
        cache: false,
        templateUrl: 'templates/_12_ItemReceive_ItemCode.html',
        controller: 'IR_ItemCodeCtrl'
    })
    .state('IR_ItemReceive', {
        url: '/IR_ItemReceive',
        cache: false,
        templateUrl: 'templates/_12_ItemReceive_ItemReceive.html',
        controller: 'IR_ItemReceiveCtrl'
    })
    .state('test_ItemCombine', {
        url: '/test_ItemCombine',
        cache: false,
        templateUrl: 'templates/test_ItemCombine_ItemDetail.html',
        controller: 'test_ItemCombineCtrl'
    })
     .state('test_Barcode', {
         url: '/test_Barcode',
         cache: false,
         templateUrl: 'templates/test_Barcode.html',
         controller: 'test_BarcodeCtrl'
     })
     .state('test_ItemMenu', {
         url: '/test_ItemMenu',
         cache: false,
         templateUrl: 'templates/test_ItemMenu.html',
         controller: 'test_ItemMenuCtrl'
     })
    .state('test_menu', {
        url: '/test_menu',
        cache: false,
        templateUrl: 'templates/test_menu.html',
        controller: 'test_menuCtrl'
    })
     .state('block', {
         url: '/block',
         cache: false,
         templateUrl: 'templates/block.html',
         controller: 'blockCtrl'
     })
    
    .state('menu', {
        url: '/menu',
        cache: false,
        templateUrl: 'templates/menu.html',
        controller: 'menuCtrl'
    })
    .state('login', {
        url: '/login',
        cache: false,
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
    })
    ;
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');
});