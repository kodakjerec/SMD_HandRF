angular.module('starter.controllers', [])
.controller('CommonListTableCtrl', function ($rootScope, $scope, $ionicPopup) {
    //以下為選取清單
    //assign to Global
    $rootScope.$on("Call_ListTable", function () {
        $scope.LoadData();
    });

    //Load Data 
    $scope.LoadData = function () {
        //清單
        if ($rootScope.CommonListTable != undefined) 
            $scope.Lists = $rootScope.CommonListTable;

        //回傳選擇
        if ($rootScope.CommonListTableAnswer == undefined) 
            $rootScope.CommonListTableAnswer = { Name: '', Value: '' };
        
        $scope.data = $rootScope.CommonListTableAnswer;

        if ($scope.data.Value == '' || $scope.data.Value == undefined) {
            $scope.data.Value = $scope.Lists[0].Value;
            $scope.data.Name = $scope.Lists[0].Name;
        }
    }

    //return Object
    $scope.data = { Name: '', Value: '' };

    //Confirm-Click
    $scope.SelectItem = function (item) {
        $scope.data = item;

        $scope.modal.hide();
        $rootScope.CommonListTableAnswer = $scope.data;
        $rootScope.$emit('Call_ListTable_AssignData', {});
    };
    $scope.Confirm = function (flag) {
        if (flag != 'OK') 
            $scope.data = { Name: '', Value: '' };
        
        $scope.modal.hide();
        $rootScope.CommonListTableAnswer = $scope.data;
        $rootScope.$emit('Call_ListTable_AssignData', {});
    };

    ///以下為數字小鍵盤///
    //assign to Global
    $rootScope.$on("Call_KeyboardNumber", function () {
        $scope.LoadKeyboardNumber();
    });
    var popup;
    $scope.click = function (flag) {
        switch (flag) {
            case 'OK':
                $rootScope.CommonListTableAnswer = $scope.data.Value;
                $rootScope.$emit('Call_KeyboardNumber_AssignData', {});
                popup.close();
                break;
            case 'AC':
                $scope.data.Value = '';
                break;
            default:
                $scope.data.Value += flag;
        }
    };
    $scope.LoadKeyboardNumber = function () {
        $scope.data.Value = $rootScope.CommonListTableAnswer;

        popup = $ionicPopup.show({
            cssClass: 'KeyboardNumber',
            templateUrl: 'templates/KeyboardNumber.html',
            scope: $scope
        });
    };
})
.controller('loginCtrl', function ($rootScope, $scope, $http, $ionicPopup, $state, $timeout, login) {
    //$rootScope.ServerIP = 'localhost:1793';
    $rootScope.ServerIP = '192.168.100.134/RF_DB'; 
    $rootScope.UserInf = { UserName: '', CarNo: '', PaperNo: '', IDNo: '', ItemCode: '', HOID: '', LOT_ID: '' };
    $rootScope.BLOCK_fromdb = { ID: '', BLOCK_ID: '', BLOCK_NAME: '' };// 單一帳號可登入的區域，[可能多區]
    $rootScope.BLOCK_uiselect = { ID: '', BLOCK_ID: '', BLOCK_NAME: '' };// 單一帳號選擇登入區域，[只能一區]
    $scope.loginData = { username: '', password: '' };// login 資訊

    //登入。驗證帳號密碼，SP：[sys.spDCS_LOGIN]     
    $scope.doLogin = function () { 
        login.spDCS_LOGIN($scope.loginData.username, $scope.loginData.password).then(function (response) {
            if (response.data[0].LOGIN_RESULT != "0") 
                var msg = $ionicPopup.alert({ title: '錯誤', template: response.data[0].LOGIN_MESSAGE});
            else {
                $rootScope.UserInf.UserName = $scope.loginData.username;
                $rootScope.BLOCK_fromdb = response.data;

                switch ($rootScope.BLOCK_fromdb.length) {
                    case 0:
                        var msg = $ionicPopup.alert({ title: '錯誤', template: '此帳號沒有可使用區域' });
                        break;
                    case 1:
                        $rootScope.BLOCK_uiselect = response.data[0].BLOCK_ID;
                        $state.go('menu');
                        break;
                    default:
                        $state.go('block');
                        break;
                }
            }
        })
    };
})
.controller('menuCtrl', function ($rootScope, $scope, $state, login) {

    if ($rootScope.UserInf == undefined) {
        $state.go('login');
        window.history.pushState(null, null, 'login');
    }
    else {

            //選單內容
            $scope.Lists = [
                { Name: '進貨報到', Value: 'CheckIn' },
                { Name: '進貨檢品', Value: 'IR_CarNo' },
                { Name: '測試功能', Value: 'test_menu' },
                { Name: '離開', Value: 'login' }
            ];

            //回上頁btn
            $scope.Back = function () {
                window.history.back();
            };

            //選功能
            $scope.click = function (url) {
                $state.go(url);
                if (url == "login")
                    window.history.pushState(null, null, 'login');
            };

    }//else

      

})
.controller('blockCtrl', function ($rootScope, $scope, $state) {
     if ($rootScope.UserInf == undefined)
         $state.go('login');

     //選區域
     $scope.click = function (res) {
         $rootScope.BLOCK_uiselect = res;
         $state.go('menu');
        }
 })

.controller('test_menuCtrl', function ($rootScope, $scope, $state) {
    if ($rootScope.UserInf == undefined)
        $state.go('login');

    $scope.Lists = [
        { Name: '[test]明細', Value: 'test_Barcode' },
        { Name: '[test]併藍', Value: 'test_ItemCombine' },
        {Name: '[test]MENU', Value: 'test_ItemMenu'}
    ];

    //回上頁btn
    $scope.Back = function () {
        window.history.back();
    };

    //選功能
    $scope.click = function (url) {
        $state.go(url);

        if (url == "login")
            window.history.pushState(null, null, 'login');
    };
})
.controller('test_BarcodeCtrl', function ($rootScope, $scope, $state, testBarcode) {
    $scope.data = {
        ItemCode: ''
    }

    $scope.search = function () {
        testBarcode.Q_DCS_ITEM_HO($rootScope).then(function (response) {
            $scope.DCSresult = response.data;
        })
    }

    $scope.reset = function () {
        $scope.data.ItemCode = '';
    };


    $scope.Back = function () {
        window.history.back();
    };

})
.controller('test_ItemCombineCtrl', function ($rootScope, $scope, $ionicPopup, $timeout, $ionicModal, $state) {

    if ($rootScope.UserInf == undefined) {
        $state.go('login');
        window.history.pushState(null, null, 'login');
    }


    $scope.Back = function () {
        window.history.back();
    };

})
.controller('test_ItemMenuCtrl', function ($rootScope, $scope, $ionicPopup, $timeout, $ionicModal, $state, login) {
    $rootScope.Now_Parent_ID = 0;
    $rootScope.menu_show = {};

    $scope.Back = function () {
        window.history.back();
    };

    if ($rootScope.UserInf == undefined) {
        $state.go('login');
        window.history.pushState(null, null, 'login');
    }
    else {
        //讀取MENU
        login.spMENU().then(function (response) {
            $scope.menu = response.data;

            for (var i = 0; i < $scope.menu.length; i++) {
                if ($scope.menu[i].PARENT_ID == $rootScope.Now_Parent_ID)
                    $rootScope.menu_show[i] = $scope.menu[i]             
            }
        })

        //下層
        $scope.Menu_Get = function (Menu_ID) {           
            $rootScope.menu_show = {};
            var j = 0;
            for (var i = 0; i < $scope.menu.length; i++) {
                if ($scope.menu[i].MENU_ID == Menu_ID) //紀錄上層
                    $rootScope.Now_Parent_ID = $scope.menu[i].PARENT_ID;             
                if ($scope.menu[i].PARENT_ID == Menu_ID) {  //找下層                
                    $rootScope.menu_show[j] = $scope.menu[i];
                    j++;
                }
            }
        }
        //上層
        $scope.Menu_Back = function () {
            $rootScope.menu_show = {};
            var j = 0;
            for (var i = 0; i < $scope.menu.length; i++) { 
                if ($scope.menu[i].PARENT_ID == $rootScope.Now_Parent_ID) {//找上層
                    $rootScope.menu_show[j] = $scope.menu[i];
                    j++;
                }
            }          
            for (var i = 0; i < $scope.menu.length; i++) { 
                if ($scope.menu[i].MENU_ID == $scope.Now_Parent_ID)//紀錄上層
                    $rootScope.Now_Parent_ID = $scope.menu[i].PARENT_ID;
            }
        }
    }//else

})

 ;