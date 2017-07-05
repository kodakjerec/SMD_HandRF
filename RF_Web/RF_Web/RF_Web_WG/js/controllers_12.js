angular.module('starter.controllers')
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
                            $scope.data = { CarNo: $scope.data.CarNo, viewColor: $scope.color.green, IsDisabled: false };

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
    $ionicModal.fromTemplateUrl('templates/CommonListTable.html', { scope: $scope }).then(function (modal) {
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
        $scope.result = { ITEM_QTY: 0, ITEM_QTY0: 0, ITEM_QTY1: 0, ITEM_QTY2: 0 };
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
    $ionicModal.fromTemplateUrl('templates/CommonListTable.html', { scope: $scope }).then(function (modal) {
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
        $ionicModal.fromTemplateUrl('templates/_12_ItemReceive_PaperDetail.html', { scope: $scope }).then(function (modal) {
            $scope.modal = modal;
        });

        _12_PaperNo.QueryPaperDetail($rootScope.UserInf.CarNo, $scope.data.PaperNo).then(function (response) {
            if (response == '' || response == undefined)
                return;
            else {
                var obj_response = response.data.rows[0];
                if (obj_response.RT_CODE != '0') {
                    var msg = $ionicPopup.alert({ title: '錯誤', template: obj_response.RT_MSG });
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
        $scope.data = { ItemCode: '', viewColor: '#FF5151', IsDisabled: true, SunDay_Text: '日期', LOT: '', SunDay: '', Temp: '' };
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
                            var msg = $ionicPopup.alert({ title: '錯誤', template: obj_response.RT_MSG });
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
                        var msg = $ionicPopup.alert({ title: '錯誤', template: obj_response.RT_MSG });
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
                    if ($scope.QTY_left <= 0)
                        $scope.data.viewColor = $scope.color.white;
                    else
                        $scope.data.viewColor = $scope.color.red;


                    if (obj_response.RT_CODE != '0') {
                        var msg = $ionicPopup.alert({ title: '錯誤', template: obj_response.RT_MSG });
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
                    var msg = $ionicPopup.alert({ title: '成功', template: obj_response.RT_MSG });
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
        _12_ItemReceive.QueryTest().then(function (response) { })
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
            var msg = $ionicPopup.alert({ title: '錯誤', template: "秤重欄位尚未輸入 !!!" });
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

 ;