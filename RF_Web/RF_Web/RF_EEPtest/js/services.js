angular.module('starter.services', [])
.factory('EEPtest_Query', function ($rootScope, $http, $ionicPopup, $timeout) {
    return {
        //查詢
        Query: function (param_mode, param_data) {
            var returnObj = undefined;
            var sendData = 'mode=' + param_mode;
            if (param_data != undefined)
                sendData += '&data=' + angular.toJson(param_data);
            console.log(sendData);
            return $.ajax({
                type: "POST",
                dataType: 'json',
                url: 'http://' + $rootScope.ServerIP + 'handler/JQMobileHandler.ashx',
                data: sendData,
                cache: false,
                async: true,
                success: function (output, status, xhr) {
                    returnObj = output;
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(ajaxOptions);
                    $ionicPopup.alert({
                        title: '錯誤'
                        , template: xhr.responseText
                    });
                },
                complete: function () {
                    returnObj = '';
                }
            })
            .then(function () {
                return returnObj;
            });
        },
        //查詢
        Query2: function (param_mode, param_data) {
            var returnObj = undefined;
            var sendData = 'mode=' + param_mode;
            if (param_data != undefined)
                sendData += '&data=' + angular.toJson(param_data);
            console.log(sendData);
            return $.ajax({
                type: "POST",
                url: 'http://' + $rootScope.ServerIP + 'handler/JQMobileHandler.ashx',
                data: sendData,
                cache: false,
                async: true,
                success: function (output, status, xhr) {
                    returnObj = output;
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(ajaxOptions);
                    $ionicPopup.alert({
                        title: '錯誤'
                        , template: xhr.responseText
                    });
                },
                complete: function () {
                    returnObj = '';
                }
            })
            .then(function () {
                return returnObj;
            });
        }
    }
})
;