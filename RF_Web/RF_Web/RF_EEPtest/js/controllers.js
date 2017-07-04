angular.module('starter.controllers', [])
.controller('loginCtrl', function ($rootScope, $scope, $http, $ionicPopover, $state, EEPtest_Query) {

    $rootScope.ServerIP = '192.168.120.162/JQWebClient/';
    //Init
    $scope.data = {
        FileName: 'config.txt',
        userData: {
            userID: '001',
            password: '',
            database: 'ERPS',
            solution: 'Apptest',
            deviceID: '7eb21a9a-e822-4cd6-a72d-03a6260f47e4'
        },
        mode: 'logon',
        popoverTarget: 'database',
        objDatabase: [],
        objSolution: []
    };

    //讀入預設的database, solution
    EEPtest_Query.Query('getDatabases', undefined)
    .then(function (response) {
        //轉成制定形式
        var result = [];
        angular.forEach(response, function (value, key) {
            result.push({ "Name": value, "Value": value });
        });
        $scope.data.objDatabase = result;

        EEPtest_Query.Query('getSolutions', undefined)
        .then(function (response) {
            var result = [];
            angular.forEach(response, function (value, key) {
                result.push({ "Name": value.Name, "Value": value.Name });
            });
            $scope.data.objSolution = result;
        });
    });


    $scope.login = function () {
        //login沒有回傳資料, 強制接收json會發生錯誤
        EEPtest_Query.Query2('logon', $scope.data.userData)
        .then(function (response) {
            if (response == '') {
                //go to Menu
                $state.go('menu');
            }
        });
        ;
    };

    //PopOver
    //宣告PopOver
    $ionicPopover.fromTemplateUrl('templates/SamplePopOver.html', {
        scope: $scope
    }).then(function (popover) {
        $scope.popover = popover;
    });
    //Popover內容物
    $scope.Lists = [];
    //PopOver關閉
    $scope.closePopover = function (ListItem) {
        //console.log(ListItem);
        switch (popoverTarget) {
            case 'database':
                $scope.data.userData.database = ListItem.Value; break;
            case 'solution':
                $scope.data.userData.solution = ListItem.Value; break;
        }
        $scope.popover.hide();
    };

    //PopOver_選擇資料庫
    $scope.ShowPopOver_database = function ($event) {
        popoverTarget = 'database';
        $scope.Lists = $scope.data.objDatabase;
        $scope.popover.show($event);
    };
    //PopOver_選擇解決方案
    $scope.ShowPopOver_solution = function ($event) {
        popoverTarget = 'solution';
        $scope.Lists = $scope.data.objSolution;
        $scope.popover.show($event);
    };

})
.controller('menuCtrl', function ($rootScope, $scope, $state, EEPtest_Query) {
    //test
    $scope.parentMenus = [];
    $scope.childMenus = [];

    //Init
    EEPtest_Query.Query('getMenus', undefined)
    .then(function (response) {
        angular.forEach(response, function (value, key) {
            if (value.PARENT == '' || value.PARENT == null)
                $scope.parentMenus.push(value);
        });
        console.log($scope.parentMenus);
        angular.forEach($scope.parentMenus, function (valueP, key) {
            angular.forEach(response, function (valueC, key) {
                if (valueC.PARENT == valueP.MENUID)
                    $scope.childMenus.push(valueC);
            });
        });
        console.log($scope.childMenus);
    })
    .then(function () {
        console.log($scope.parentMenus);
        console.log($scope.childMenus);
    })
    ;

    $scope.Leave = function () {
        window.history.go(-1);
    };

    $scope.Navigator = function (url) {
        $state.go(url);
    };
})
;