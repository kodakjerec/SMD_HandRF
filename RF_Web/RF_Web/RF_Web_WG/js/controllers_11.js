angular.module('starter.controllers')
.controller('CheckInCtrl', function ($rootScope, $scope, $ionicPopup, $timeout, $state, _11_CheckIn) {
    if ($rootScope.UserInf == undefined) 
        $state.go('login');

    $scope.data = { CarNo: '', viewColor: '', IsDisabled: true };  // IsDisabled控制"btn報到"是否顯示，預設不顯示：IsDisabled = true
    $scope.color = { green: '#79FF79', red: '#FF5151' }; // 控制已報到/未報到 顏色
    $scope.result = {};

    //重置btn
    $scope.reset = function () {
        $rootScope.UserInf.CarNo = '';
        $scope.data = { CarNo: '', viewColor: '', IsDisabled: true };
        $scope.result = {};       
    };

    //回上頁btn
    $scope.Back = function () {
        $scope.reset();
        window.history.back();
    };

    //查詢報到牌btn
    $scope.search = function () {        
        if ($scope.data.CarNo == '') 
            return;

        _11_CheckIn.QueryCarNo($scope.data.CarNo).then(function (response) {
            if (response == '' || response == undefined)
                return;
            else {
                var obj_response = response.data.rows[0];
                switch (obj_response.RT_CODE)
                {
                    case 0:
                        $scope.result = obj_response;
                        
                        //1.控制ui 已報到/未報到 顯示顏色
                        //2.控制ui 已報到/未報到 IsDisabled的 狀態，已報到：IsDisabled = true[不開放keyin]；未報到：IsDisabled = true[不開放keyin]
                        if ($scope.result.ROW10 == '未報到') 
                            $scope.data = {CarNo:$scope.data.CarNo, viewColor: $scope.color.red, IsDisabled: false };
                        else 
                            $scope.data = {CarNo:$scope.data.CarNo, viewColor: $scope.color.green, IsDisabled: true };
                        break;
                    case 1:
                        var msg = $ionicPopup.alert({ title: '錯誤', template: obj_response.RT_MSG });
                        msg.then(function (res) { //auto-focus
                            document.getElementById('txb_CarNo').select();
                        });
                        break;
                    default:
                        var msg = $ionicPopup.alert({ title: '錯誤', template: "未知的錯誤碼，RT_CODE回傳值為：" + obj_response.RT_CODE });
                        msg.then(function (res) { 
                            document.getElementById('txb_CarNo').select();
                        });
                        break;
                }
            }//else
        }); //_11_CheckIn      
    };//查詢報到牌btn END

    //20170613需求，加入溫度正負按鈕
    $scope.neg = { backColor: '#FFD306', fontColor: 'red' };
    $scope.pos = { backColor: 'black', fontColor: 'white' };

    $scope.VEHICLE_TEMP0_color = { backColor: 'black', fontColor: 'white' };
    $scope.VEHICLE_TEMP1_color = { backColor: 'black', fontColor: 'white' };
    $scope.VEHICLE_TEMP2_color = { backColor: 'black', fontColor: 'white' };

    $scope.VEHICLE_TEMP0_p = function () {
            $scope.VEHICLE_TEMP0_color = $scope.pos;
    }
    $scope.VEHICLE_TEMP0_n = function () {
            $scope.VEHICLE_TEMP0_color = $scope.neg;
    }
    $scope.VEHICLE_TEMP1_p = function () { 
            $scope.VEHICLE_TEMP1_color = $scope.pos;
    }
    $scope.VEHICLE_TEMP1_n = function () {
            $scope.VEHICLE_TEMP1_color = $scope.neg;
    }
    $scope.VEHICLE_TEMP2_p = function () {
            $scope.VEHICLE_TEMP2_color = $scope.pos;
    }
    $scope.VEHICLE_TEMP2_n = function () {
            $scope.VEHICLE_TEMP2_color = $scope.neg;
    }//溫度正負按鈕END

    //報到牌報到btn
    $scope.register = function () {
        if ($scope.data.CarNo == '')
            return;
        if ($scope.data.IsDisabled == false) {
            //20170613需求，加入溫度正負判斷，若選擇為負數，需將數值改成負，但ui不可顯示負號
            var TEMP0 = $scope.result.VEHICLE_TEMP0;
            var TEMP1 = $scope.result.VEHICLE_TEMP1;
            var TEMP2 = $scope.result.VEHICLE_TEMP2;

            if ($scope.VEHICLE_TEMP0_color == $scope.neg)
                TEMP0 = -TEMP0;
            if ($scope.VEHICLE_TEMP1_color == $scope.neg)
                TEMP1 = -TEMP1;
            if ($scope.VEHICLE_TEMP2_color == $scope.neg)
                TEMP2 = -TEMP2;

            console.log($scope.data.CarNo);
            _11_CheckIn.CarCheck($scope.data.CarNo, TEMP0, TEMP1, TEMP2, $rootScope.UserInf.UserName).then(function (response) {
                if (response == '' || response == undefined) 
                    return;  
                else {
                    var obj_response = response.data.rows[0];
                    switch (obj_response.RT_CODE) {
                        case 0:
                            var msg = $ionicPopup.alert({ title: '成功', template: obj_response.RT_MSG });
                            $scope.reset();
                            break;
                        default:
                            var msg = $ionicPopup.alert({ title: '錯誤', template: obj_response.RT_MSG });
                            msg.then(function (res) {
                                document.getElementById('txb_CarNo').select();
                            });
                            break;
                    }     
                }//else
            });
        }//if IsDisabled == false
    };//報到牌報到btn END
})
 ;