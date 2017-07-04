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
.controller('IR_CarNoCtrl', function ($rootScope, $scope, $ionicPopup, $timeout, $ionicModal, $state, _11_CheckIn) {
    if ($rootScope.UserInf == undefined)
        $state.go('login');
    $scope.color = { green: '#79FF79', red: '#FF5151' };

    if ($rootScope.CarNo_result == undefined) {
        $scope.data = { CarNo: '', viewColor: '', IsDisabled: true };
        $scope.color = { green: '#79FF79', red: '#FF5151' }; 
        $scope.result = {};
    }
    else {
        $scope.result = $rootScope.CarNo_result;
        $scope.data = $rootScope.CarNo_data;
    }

    //重置btn
    $scope.reset = function () {
        $scope.data = { CarNo: '', viewColor: '', IsDisabled: true };
        $scope.result = {};

        $rootScope.UserInf.CarNo = '';
        $rootScope.CarNo_result = undefined;
        $rootScope.CarNo_data = undefined;
    };

    //回上頁btn
    $scope.Back = function () {
        $scope.reset();
        window.history.back();
    };

    //下一步btn
    $scope.Next = function () {
        if ($scope.data.IsDisabled == false) {
            $rootScope.CarNo_result = $scope.result;
            $rootScope.CarNo_data = $scope.data;
            $state.go('IR_PaperNo');
        }
    };
   
    //查詢報到牌btn
    $scope.search = function () {
        if ($scope.data.CarNo == '')
            return;
        else {
            //查詢報到車號
            _11_CheckIn.QueryCarNo($scope.data.CarNo).then(function (response) {
                if (response == '' || response == undefined)
                    return;
                else {
                    var obj_response = response.data.rows[0];
                    console.log(obj_response);
                    switch (obj_response.RT_CODE) {
                        case 0:
                            $scope.result = obj_response;
                            $scope.data.CarNo = obj_response.VEHICLE_NO;
                            $rootScope.UserInf.CarNo = obj_response.VEHICLE_NO;
                            $scope.data = { CarNo:$scope.data.CarNo, viewColor:$scope.color.green, IsDisabled:false};

                            if ($scope.result.ROW10 == '未報到') 
                                $scope.data = { CarNo: $scope.data.CarNo, viewColor: $scope.color.red, IsDisabled: true };
                            else
                                $scope.data = { CarNo: $scope.data.CarNo, viewColor: $scope.color.green, IsDisabled: false };
                            break;
                        default:
                            var msg = $ionicPopup.alert({ title: '錯誤', template: obj_response.RT_MSG });
                            msg.then(function (res) { //auto-focus
                                document.getElementById('txb_CarNo').select();
                            });
                            $scope.data.IsDisabled = true;
                            break;
                    }
                }//else
            }); //_11_CheckIn 
        }
    };//查詢報到牌btn END

    //查詢報到驗收明細btn
    $scope.QueryPaperDetail = function () {
        if ($scope.data.CarNo == '')
            return;

        //讀入明細清單
        $ionicModal.fromTemplateUrl('templates/_12_ItemReceive_PaperDetail.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        _11_CheckIn.QueryPaperDetail($scope.data.CarNo).then(function (response) {
            if (response == '' || response == undefined)
                return;
            else {
                var obj_response = response.data.rows[0];
                console.log(obj_response.RT_CODE);
                switch (obj_response.RT_CODE) {
                    case 0:
                        $rootScope.CommonListTable = response.data.rows;
                        $rootScope.$emit("Call_ListTable", {});
                        $scope.modal.show();
                        $scope.ListTableSource = [];
                        break;
                    default:
                        var msg = $ionicPopup.alert({ title: '錯誤', template: obj_response.RT_MSG });
                        msg.then(function (res) {//auto-focus
                            document.getElementById('txb_CarNo').select();
                        });
                        break;
                }
            }
        });
    }; //查詢報到牌驗收明細btn END

    //讀入多選清單(default)
    $ionicModal.fromTemplateUrl('templates/CommonListTable.html', {scope: $scope}).then(function (modal) {
        $scope.modal = modal;
    });

    //ListTable回傳清單
    $scope.AssignData = function () {
        if ($rootScope.CommonListTableAnswer.Value != '') {
            $scope.data.CarNo = $rootScope.CommonListTableAnswer.Value;
            $scope.search();
        }
    };
    $rootScope.$$listeners["Call_ListTable_AssignData"] = [];//移除  
    $rootScope.$on("Call_ListTable_AssignData", function () {//註冊
        $scope.AssignData();
    });
})
.controller('IR_PaperNoCtrl', function ($rootScope, $scope, $ionicPopup, $timeout, $ionicModal, $state, _12_PaperNo) {
    if ($rootScope.UserInf == undefined)
        $state.go('login');

    //宣告，全域可串
    if ($rootScope.PaperNo_result == undefined) {
        $scope.data = { PaperNo: '', IsDisabled: true };
        $scope.result = { ITEM_QTY: 0, ITEM_QTY0: 0, ITEM_QTY1: 0, ITEM_QTY2: 0};
    }
    else {
        $scope.result = $rootScope.PaperNo_result;
        $scope.data = $rootScope.PaperNo_data;
    }

    //回上頁btn
    $scope.Back = function () {
        $scope.reset();
        window.history.back();
    };

    //下一步btn
    $scope.Next = function () {
        if ($scope.data.IsDisabled == false) {
            $rootScope.PaperNo_result = $scope.result;
            $rootScope.PaperNo_data = $scope.data;
            $state.go('IR_ItemCode');
        }
    };

    //重置btn
    $scope.reset = function () {
        $scope.data = { PaperNo: '', IsDisabled: true };
        $scope.result = {};
        $rootScope.UserInf.PaperNo = '';
        $rootScope.UserInf.IDNo = '';
        $rootScope.PaperNo_result = undefined;
        $rootScope.PaperNo_data = undefined;
    };

    //讀入多選清單(default)
    $ionicModal.fromTemplateUrl('templates/CommonListTable.html', {scope: $scope}).then(function (modal) {
        $scope.modal = modal;
    });

    //ListTable回傳清單
    //return Object
    $scope.AssignData = function () {
        if ($rootScope.CommonListTableAnswer.Value != '') {
            $scope.data.PaperNo = $rootScope.CommonListTableAnswer.Value;
            $scope.search();
        }
    };
    //移除
    $rootScope.$$listeners["Call_ListTable_AssignData"] = [];
    //註冊
    $rootScope.$on("Call_ListTable_AssignData", function () {
        $scope.AssignData();
    });

    //查詢進貨單btn
    $scope.search = function () {
        if ($scope.data.PaperNo == '')
            return;
  
        $ionicModal.fromTemplateUrl('templates/CommonListTable.html', { scope: $scope }).then(function (modal) {
            $scope.modal = modal;
        });

        //reset
        $scope.data.IsDisabled = true;
        $scope.result = undefined;

        _12_PaperNo.Query($rootScope.UserInf.CarNo, $scope.data.PaperNo, $rootScope.UserInf.UserName).then(function (response) {
            if (response == '' || response == undefined) 
                return;
            else {
                //超過一筆查詢回來, 必定為多選
                if (response.data.rows.length > 1) {
                    
                    //多選小視窗必定要的內容
                    var dataTable = [];
                    angular.forEach(response.data.rows, function (value, key) {
                        dataTable.push({ Name: value.RT_MSG, Value: value.PO_ID });
                    });
                    $rootScope.CommonListTable = dataTable;
                    $rootScope.CommonListTableAnswer = undefined;
                    $rootScope.$emit("Call_ListTable", {});
                    $scope.modal.show();
                    $scope.ListTableSource = [];
                }
                else {
                    var obj_response = response.data.rows[0];
                    console.log(obj_response);
                    if (obj_response.RT_CODE != '0') {
                        var msg = $ionicPopup.alert({ title: '錯誤', template: obj_response.RT_MSG });
                        //auto-focus
                        msg.then(function (res) {
                            document.getElementById('txb_PaperNo').select();
                        });
                    }
                    else {
                        $scope.result = obj_response;
                        $scope.data.PaperNo = obj_response.PO_ID;
                        $scope.data.IsDisabled = false;
                        $rootScope.UserInf.PaperNo = obj_response.PO_ID;
                        $rootScope.UserInf.IDNo = obj_response.ID;
                    }
                }
            }
        });
    };

    //查詢進貨單驗收明細
    $scope.QueryPaperDetail = function () {
        if ($scope.data.CarNo == '')
            return;

        //讀入明細清單
        $ionicModal.fromTemplateUrl('templates/_12_ItemReceive_PaperDetail.html', {scope: $scope}).then(function (modal) {
            $scope.modal = modal;
        });

        _12_PaperNo.QueryPaperDetail($rootScope.UserInf.CarNo, $scope.data.PaperNo).then(function (response) {
            if (response == '' || response == undefined)
                return;
            else {
                var obj_response = response.data.rows[0];
                if (obj_response.RT_CODE != '0') {
                    var msg = $ionicPopup.alert({ title: '錯誤', template: obj_response.RT_MSG  });
                    msg.then(function (res) {
                        document.getElementById('txb_PaperNo').select();
                    });
                }
                else {
                    $rootScope.CommonListTable = response.data.rows;
                    $rootScope.CommonListTableAnswer = undefined;
                    $rootScope.$emit("Call_ListTable", {});
                    $scope.modal.show();
                    $scope.ListTableSource = [];
                }
            }
        });
    };

    //進貨單號驗收完成
    $scope.Finish = function () {
        if ($scope.data.CarNo == '')
            return;

        _12_PaperNo.Finish($rootScope.UserInf.CarNo, $rootScope.UserInf.PaperNo, $rootScope.UserInf.IDNo).then(function (response) {
            if (response == '' || response == undefined) {
                return;
            }
            else {
                var obj_response = response.data.rows[0];
                if (obj_response.RT_CODE != '0') {
                    var msg = $ionicPopup.alert({ title: '錯誤', template: obj_response.RT_MSG });
                    msg.then(function (res) {
                        document.getElementById('txb_CarNo').select();
                    });
                }
                else if (obj_response.ERR_CODE == '1') {
                    var msg = $ionicPopup.alert({ title: '錯誤', template: obj_response.MEG });
                    msg.then(function (res) {
                        document.getElementById('txb_CarNo').select();
                    });
                }
                else {
                    var msg = $ionicPopup.alert({ title: '成功', template: obj_response.RT_MSG });
                    $scope.reset();
                }
            }
        });
    };
})
.controller('IR_ItemCodeCtrl', function ($rootScope, $scope, $ionicPopup, $timeout, $ionicModal, $state, _12_ItemCode) {
    if ($rootScope.UserInf == undefined)
        $state.go('login');

    $scope.neg = { backColor: '#FFD306', fontColor: 'red' };
    $scope.pos = { backColor: 'black', fontColor: 'white' };

    $scope.Temp_color = { backColor: 'black', fontColor: 'white' };

    //20170613需求，加入溫度正負按鈕
    $scope.Tempr_p = function () {
        $scope.Temp_color = $scope.pos;
    }
    $scope.Tempr_n = function () {
        $scope.Temp_color = $scope.neg;
    }
    //加入溫度正負按鈕END

    //Init
    if ($rootScope.ItemCode_result == undefined) {
        $scope.data = {ItemCode: '',  viewColor: '#FF5151',  IsDisabled: true, SunDay_Text: '日期',  LOT: '', SunDay: '', Temp: '' };
        $scope.result = {};
    }
    else {
        $scope.result = $rootScope.ItemCode_result;
        $scope.data = $rootScope.ItemCode_data;
    }
    //上一頁
    $scope.Back = function () {
        $scope.reset();
        window.history.back();
    };
    //下一頁
    $scope.Next = function () {
        $state.go('IR_ItemReceive');
        if ($scope.data.IsDisabled == false) {
            $rootScope.ItemCode_result = $scope.result;
            $rootScope.ItemCode_data = $scope.data;
            $state.go('IR_ItemReceive');
        }
    };
    //重置
    $scope.reset = function () {
        $scope.data.ItemCode = '';
        $scope.data.IsDisabled = true;
        $scope.data.SunDay_Text = '日期';
        $scope.result = {};
        $rootScope.UserInf.ItemCode = '';
        $rootScope.ItemCode_result = undefined;
        $rootScope.ItemCode_data = undefined;
    };

    //讀入多選清單(default)
    $ionicModal.fromTemplateUrl('templates/CommonListTable.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    //ListTable回傳清單
    //return Object
    $scope.AssignData = function () {
        if ($rootScope.CommonListTableAnswer.Value != '') {
            $scope.data.ItemCode = $rootScope.CommonListTableAnswer.Value;
            $scope.search();
        }
    };
    //移除
    $rootScope.$$listeners["Call_ListTable_AssignData"] = [];
    //註冊
    $rootScope.$on("Call_ListTable_AssignData", function () {
        $scope.AssignData();
    });

        $scope.search = function () {
        if ($scope.data.PaperNo == '')
            return;

        //讀入多選清單
        $ionicModal.fromTemplateUrl('templates/CommonListTable.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        //reset
        $scope.data.IsDisabled = true;
        $scope.result = undefined;

        //查詢Paper
        $scope.search = function () {
        if ($scope.data.PaperNo == '')
            return;

        //讀入多選清單
        $ionicModal.fromTemplateUrl('templates/CommonListTable.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        //reset
        $scope.data.IsDisabled = true;
        $scope.result = undefined;




        _12_PaperNo.Query($rootScope.UserInf.CarNo, $scope.data.PaperNo, $rootScope.UserInf.UserName).then(function (response) {
            if (response == '' || response == undefined) {
                return;
            }
            else {
                //超過一筆查詢回來, 必定為多選
                if (response.data.rows.length > 1) {
                    //多選小視窗必定要的內容
                    var dataTable = [];
                    angular.forEach(response.data.rows, function (value, key) {
                        dataTable.push({ Name: value.RT_MSG, Value: value.PO_ID });
                    });
                    $rootScope.CommonListTable = dataTable;
                    $rootScope.CommonListTableAnswer = undefined;
                    $rootScope.$emit("Call_ListTable", {});
                    $scope.modal.show();
                    $scope.ListTableSource = [];
                }
                else {
                    var obj_response = response.data.rows[0];
                    if (obj_response.RT_CODE != '0') {
                        var msg = $ionicPopup.alert({ title: '錯誤',  template: obj_response.RT_MSG });
                        msg.then(function (res) {
                            document.getElementById('txb_PaperNo').select();
                        });
                    }
                    else {
                        $scope.result = obj_response;
                        $scope.data.PaperNo = obj_response.PO_ID;
                        $scope.data.IsDisabled = false;
                        $rootScope.UserInf.PaperNo = obj_response.PO_ID;
                        $rootScope.UserInf.IDNo = obj_response.ID;
                    }
                }
            }
        });
    };
        _12_PaperNo.Query($rootScope.UserInf.CarNo, $scope.data.PaperNo, $rootScope.UserInf.UserName).then(function (response) {
            if (response == '' || response == undefined) 
                return;
            else {
                //超過一筆查詢回來, 必定為多選
                if (response.data.rows.length > 1) {
                    //多選小視窗必定要的內容
                    var dataTable = [];
                    angular.forEach(response.data.rows, function (value, key) {
                        dataTable.push({ Name: value.RT_MSG, Value: value.PO_ID });
                    });
                    $rootScope.CommonListTable = dataTable;
                    $rootScope.CommonListTableAnswer = undefined;
                    $rootScope.$emit("Call_ListTable", {});
                    $scope.modal.show();
                    $scope.ListTableSource = [];
                }
                else {
                    var obj_response = response.data.rows[0];
                    if (obj_response.RT_CODE != '0') {
                        var msg = $ionicPopup.alert({title: '錯誤',template: obj_response.RT_MSG });
                        msg.then(function (res) {
                            document.getElementById('txb_PaperNo').select();
                        });
                    }
                    else {
                        $scope.result = obj_response;
                        $scope.data.PaperNo = obj_response.PO_ID;
                        $scope.data.IsDisabled = false;
                        $rootScope.UserInf.PaperNo = obj_response.PO_ID;
                        $rootScope.UserInf.IDNo = obj_response.ID;
                    }
                }
            }
        });
    };
    //查詢商品條碼
    $scope.search = function () {
        if ($scope.data.ItemCode == '')
            return;

        //讀入多選清單
        $ionicModal.fromTemplateUrl('templates/CommonListTable.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        //reset
        $scope.data.IsDisabled = true;
        $scope.result = undefined;
        $scope.color = { white: '#FFFFFF', red: '#FF5151', green: '#79FF79' };

        _12_ItemCode.Query($rootScope.UserInf.IDNo, $scope.data.ItemCode, $rootScope.UserInf.UserName).then(function (response) {
            if (response == '' || response == undefined) 
                return;
            else {
                //超過一筆查詢回來, 必定為多選
                if (response.data.rows.length > 1) {
                    //多選小視窗必定要的內容
                    var dataTable = [];
                    angular.forEach(response.data.rows, function (value, key) {
                        dataTable.push({ Name: value.RT_MSG, Value: value.BARCODE });
                    });
                    $rootScope.CommonListTable = dataTable;
                    $rootScope.CommonListTableAnswer = undefined;
                    $rootScope.$emit("Call_ListTable", {});
                    $scope.modal.show();
                    $scope.ListTableSource = [];
                }
                else {
                    var obj_response = response.data.rows[0];

                    //SHOW 待收百分比
                    var QTY = obj_response.PO_QTY.split("/");
                    $scope.QTY_left = QTY[0];
                    $scope.QTY_ShowTotal = QTY[1];
                    
                   //SHOW待收顏色
                    if ($scope.QTY_left <=0) 
                        $scope.data.viewColor = $scope.color.white;
                    else 
                        $scope.data.viewColor = $scope.color.red;


                    if (obj_response.RT_CODE != '0') {
                        var msg = $ionicPopup.alert({title: '錯誤', template: obj_response.RT_MSG });                 
                        msg.then(function (res) { 
                            document.getElementById('txb_ItemCode').select();
                        });
                    }
                    else {
                        //201705加上太陽日
                        _12_ItemCode.QuerySunDay().then(function (response) {
                            $scope.Sun = response.data[0].SunDay;
                        })
                        $scope.result = obj_response;
                        console.log($scope.result);
                        $scope.data.ItemCode = obj_response.ITEM_ID;
                        $scope.data.IsDisabled = false;
                        $rootScope.UserInf.ItemCode = obj_response.ITEM_ID;
                        $rootScope.UserInf.HOID = obj_response.ITEM_HOID;
                        $rootScope.ItemCode_result = $scope.result;

                        //介面顯示設定
                        $scope.data.SunDay_Text = obj_response.QE_TYPE_NAME;
                        $scope.data.SunDay = obj_response.QE_TYPE_TEXT;
                    }
                }
            }//else
        });
    };

    //開始驗收(鎖定)
    $scope.JOBID2 = function () {

        if ($scope.data.ItemCode == '')
            return;

        var Temp = $scope.data.Temp;
        if ($scope.Temp_color == $scope.neg)
            Temp = -Temp;

        console.log(Temp);

        /*
        _12_ItemCode.JOBID2($rootScope.UserInf.IDNo, $rootScope.UserInf.HOID, $scope.data.LOT, $scope.data.SunDay, $scope.data.Temp, $rootScope.UserInf.UserName).then(function (response) {
            if (response == '' || response == undefined)
                return;
            else {
                var obj_response = response.data.rows[0];
                if (obj_response.RT_CODE != '0') {
                    var msg = $ionicPopup.alert({ title: '錯誤',  template: obj_response.RT_MSG });
                    //auto-focus
                    msg.then(function (res) {
                        document.getElementById('txb_ItemCode').select();
                    });
                }
                else {        
                    $rootScope.UserInf.LOT_ID = obj_response.LOT_ID;
                    $scope.Next();
                }
            } //else
        });*/
    };

    //商品_單品完成
    $scope.JOBID45 = function () {
        if ($scope.data.ItemCode == '')
            return;

        _12_ItemCode.JOBID45($rootScope.UserInf.IDNo, $rootScope.UserInf.HOID, $rootScope.UserInf.UserName).then(function (response) {
            if (response == '' || response == undefined) 
                return;
            else {
                var obj_response = response.data.rows[0];
                console.log("單品完成：JOB45");
                console.log(response);
                if (obj_response.RT_CODE != '0') {
                    var msg = $ionicPopup.alert({ title: '錯誤', template: obj_response.RT_MSG });
                    //auto-focus
                    msg.then(function (res) {
                        document.getElementById('txb_ItemCode').select();
                    });
                    //因為現在沒有列印, 只會跳錯誤
                    $scope.reset();
                }
                else {
                    var msg = $ionicPopup.alert({  title: '成功', template: obj_response.RT_MSG });
                    $scope.reset();
                }
            }
        });
    };


    //測試
    /*
    $scope.getdata = {};
    $scope.resulttest = {};
    $scope.clickget = function () {
        _12_ItemCode.QueryTest().then(function (response) {
            $scope.resulttest = response.data.rows[0];
            console.log("result");
            console.log($scope.resulttest);
            $scope.tester = {};
            for (var idx in $scope.resulttest) {
                $scope.tester[idx] = idx;
                $scope.getdata[idx] = "";
            }
        })
         console.log($scope.getdata);
    };*/

})
.controller('IR_ItemReceiveCtrl', function ($rootScope, $scope, $ionicPopup, $timeout, $ionicModal, $state, _12_ItemReceive) {
    if ($rootScope.UserInf == undefined)
        $state.go('login');

    //Init
    $scope.data = { QTY: '', WEIGHT: '', viewColor: 'black', IsDisabled: false, QualityName: '良品', QualityValue: 1 };
    $scope.result = $rootScope.ItemCode_result;

    $scope.neg = { backColor: '#FFD306', fontColor: 'red' };
    $scope.pos = { backColor: 'black', fontColor: 'white' };

    $scope.QTY_color = { backColor: 'black', fontColor: 'white' };
    $scope.WEIGHT_color = { backColor: 'black', fontColor: 'white' };

    //上一頁
    $scope.Back = function () {
        $scope.reset();
        window.history.back();
    };
    //重置
    $scope.reset = function () {
        $scope.data = { QTY: '', WEIGHT: '', viewColor: 'black', IsDisabled: false, QualityName: '良品', QualityValue: 1 };
    };

    //ListTable回傳清單
    //return Object
    $scope.AssignData = function () {
        if ($rootScope.CommonListTableAnswer.Name != '') {
            $scope.data.QualityName = $rootScope.CommonListTableAnswer.Name;
            $scope.data.QualityValue = $rootScope.CommonListTableAnswer.Value;
            switch ($scope.data.QualityValue) {
                case 0:
                    $scope.data.viewColor = '#79FF79'; break;
                case 1:
                    $scope.data.viewColor = 'black'; break;
                default:
                    $scope.data.viewColor = '#FF5151'; break;
            }
        }
    };
    //移除
    $rootScope.$$listeners["Call_ListTable_AssignData"] = [];
    //註冊
    $rootScope.$on("Call_ListTable_AssignData", function () {
        $scope.AssignData();
    });

    //讀入多選清單
    $ionicModal.fromTemplateUrl('templates/CommonListTable.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    //測試
    $scope.QueryTest = function () {
        _12_ItemReceive.QueryTest().then(function (response) {})
    };
    //選品質
    $scope.QueryItemState = function () {
        _12_ItemReceive.QueryItemState().then(function (response) {
            if (response == '' || response == undefined) {
                return;
            }
            else {
                //超過一筆查詢回來, 必定為多選
                if (response.data.rows.length > 1) {
                    //多選小視窗必定要的內容
                    $rootScope.CommonListTable = response.data.rows;
                    $rootScope.CommonListTableAnswer = undefined;
                    $rootScope.$emit("Call_ListTable", {});
                    $scope.modal.show();
                    $scope.ListTableSource = [];
                }
            }
        });
    };


    //20170613需求，加入溫度正負按鈕
    $scope.QTY_p = function () {
        $scope.QTY_color = $scope.pos;
    }
    $scope.QTY_n = function () {
            $scope.QTY_color = $scope.neg;
    }
    $scope.WEIGHT_p = function () {
            $scope.WEIGHT_color = $scope.pos;
    }
    $scope.WEIGHT_n = function () {      
            $scope.WEIGHT_color = $scope.neg;
    }
    //加入溫度正負按鈕END

    //驗收
    $scope.Receive = function () {
        if ($scope.result.PRICE_TYPE == 0 && $scope.data.WEIGHT == '')
            var msg = $ionicPopup.alert({ title: '錯誤',  template: "秤重欄位尚未輸入 !!!" });
        else {
        var QTY = $scope.data.QTY;
        var WEIGHT = $scope.data.WEIGHT;

        if ($scope.QTY_color == $scope.neg)
            QTY = -QTY;
        if ($scope.WEIGHT_color == $scope.neg)
            WEIGHT = -WEIGHT;
            
            _12_ItemReceive.Receive($rootScope.UserInf.IDNo, $rootScope.UserInf.LOT_ID, $scope.data.QualityValue, $scope.data.QTY, $scope.data.WEIGHT, $rootScope.UserInf.UserName).then(function (response) {
                  if (response == '' || response == undefined)
                      return;
                  else {
                      var obj_response = response.data.rows[0];
                      if (obj_response.RT_CODE != '0') {
                          var msg = $ionicPopup.alert({ title: '錯誤', template: obj_response.RT_MSG });
                          msg.then(function (res) {
                              document.getElementById('txb_QTY').select();
                          });
                      }
                      else {
                          var msg = $ionicPopup.alert({ title: '成功', template: obj_response.RT_MSG });
                          msg.then(function (res) {
                              document.getElementById('txb_QTY').select();
                          });

                          //更新顯示
                          $scope.result.ADDON_QTY = obj_response.ADDON_QTY;
                          $scope.result.ADDON_WT = obj_response.ADDON_WT;
                          $scope.result.QTY = obj_response.QTY;
                          $scope.result.WT = obj_response.WT;
                          $scope.result.NG_QTY = obj_response.NG_QTY;
                          $scope.result.NG_WT = obj_response.NG_WT;
                          $scope.result.ROW3 = obj_response.ROW3;
                          $scope.result.ROW4 = obj_response.ROW4;
                          $scope.result.ROW5 = obj_response.ROW5;
                          $scope.result.ROW6 = obj_response.ROW6;

                          $scope.reset();
                      }//else
                  }
              });
        } //else
    };

    //驗收
    $scope.UnLock = function () {
        _12_ItemReceive.UnLock($rootScope.UserInf.IDNo, $rootScope.UserInf.LOT_ID, $rootScope.UserInf.UserName).then(function (response) {
            if (response == '' || response == undefined)
                return;
            else {
                var obj_response = response.data.rows[0];
                if (obj_response.RT_CODE != '0') {
                    var msg = $ionicPopup.alert({ title: '錯誤', template: obj_response.RT_MSG });
                    msg.then(function (res) {
                        document.getElementById('txb_QTY').select();
                    });
                }
                else 
                    $scope.Back();
            }//else
        });
    };
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