angular.module('starter.controllers_teach', [])
.controller('menuCtrl', function ($rootScope, UserData, $scope, $state, $filter, $ionicPopup, InsertOrder) {
    $scope.data = {
        SignDate: UserData.SignDate
    };

    $scope.Back = function () {
        window.history.go(UserData.LastPageCount);
        UserData.LastPageCount = -1;
    };

    $scope.Cart = function () {
        $state.go('app.101');
    };

    $scope.Logout = function () {
        var confirmPopup = $ionicPopup.confirm({
            title: '回到登入畫面',
            template: '確定回到選擇日期畫面嗎？'
        });

        confirmPopup.then(function (res) {
            if (res) {
                $state.go('app.001');
            }
        });
    };

    $rootScope.$on('Orders.Refresh', function (event, data) {
        //新增訂單資料
        InsertOrder.NewOrder({
            pDate: data.RECEIVE_DATE
            , pCALLING_NUM: data.CALLING_NUM
            , pQty: data.OrderQty
            , pUser: '115543'
        });
    });
})
.controller('001Ctrl', function (UserData, $scope, $state, $ionicModal, $window, SampleData) {
    //Init
    $scope.data = {
        FullScreen: false
    };

    SampleData.ArriveDates()
    .then(function (response) {
        $scope.dates = response.data;
    });


    $scope.click = function (chooseDate) {
        UserData.SignDate = chooseDate.RECEIVE_DATE;
        $state.go('app.002');
    };

    //變為全螢幕
    $scope.changeFullScreen = function () {
        $scope.data.FullScreen = !$scope.data.FullScreen;

        if ($scope.data.FullScreen) {
            var docElm = document.documentElement;
            if (docElm.requestFullscreen) {
                docElm.requestFullscreen();
            }
            else if (docElm.mozRequestFullScreen) {
                docElm.mozRequestFullScreen();
            }
            else if (docElm.webkitRequestFullScreen) {
                docElm.webkitRequestFullScreen();
            }
            else if (docElm.msRequestFullscreen) {
                docElm.msRequestFullscreen();
            }
        }
        else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            }
            else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
            else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    };

    //重新整理
    $scope.reload = function () {
        $window.location.reload();
    };
})
.controller('002Ctrl', function (UserData, $scope, $state, SampleData) {
    //讀進部門別
    SampleData.Groups(UserData.SignDate)
    .then(function (response) {
        $scope.Groups = response.data;
    });

    $scope.click = function (group) {
        UserData.Group = group;
        $state.go("app.003");
    };
})
.controller('003Ctrl', function (UserData, $scope, $window, $filter, $ionicModal, $ionicPopup, $ionicScrollDelegate, $interval, SampleData, UIOrderControl) {
    //test
    UserData.SignDate = '2017-02-07';
    UserData.Group = { Name: '蔬菜', Value: 1, SECONDS: 65535 };

    ///Init
    $scope.data = {
        PageLimit: 30,
        noMoreItemsAvailable: false,
        filters: {
            string: '',
            hasFilter: false,
            check1: { Name: '已有訂購量或欲訂量', Value: false }
        }
    };
    $scope.SignDate = UserData.SignDate;
    $scope.ChooseGroup = null;
    $scope.columnNOR = { width: '13%' };    //頁面有十個元素, 先預設每個元素寬度
    $scope.columnQTY = { width: '22%' };    //有四個元素為一組


    ///讀進發注本
    SampleData.ListItems(UserData.SignDate)
    .then(function (response) {
        $scope.Items = $filter('orderBy')(response.data, 'CALLING_NUM');
    })
    .then(function () {
        //讀進部門別
        SampleData.Groups(UserData.SignDate)
        .then(function (response) {
            $scope.Groups = response.data;

            //找尋預設部門
            angular.forEach($scope.Groups, function (value, key) {
                if (value.Value == UserData.Group.Value)
                    $scope.ChooseGroup = value;
            });
            if ($scope.ChooseGroup == null)
                $scope.ChooseGroup = $scope.Groups[0];
        })
        .then(function () {
            //帶入之前選擇的部門別
            if ($scope.ChooseGroup.Name == undefined) {
                $scope.ChooseGroup = $scope.Groups[0];
            }
        })
        .then(function () {
            $scope.ScrollInit();
        });
    })

    //切換部門
    $scope.click = function (index) {
        UserData.Group = $scope.Groups[index];
        $scope.ChooseGroup = UserData.Group;
        $scope.ScrollInit();
    };

    ///Scroll
    //無限scroll
    $scope.originfilteredArray = [{}];
    //起始
    $scope.ScrollInit = function () {
        //reset scroll
        $scope.data.PageLimit = 30;
        $scope.data.noMoreItemsAvailable = false;
        $scope.customFilter();
    };
    //篩選
    $scope.customFilter = function () {
        //angularJS Filter
        $scope.originfilteredArray = $filter('filter')($scope.Items,
            {
                DPD_ID: $scope.ChooseGroup.Value,
                $: $scope.data.filters.string,
            });

        //angularJS limit
        $scope.filtered = $filter('limitTo')($scope.originfilteredArray, $scope.data.PageLimit, 0);
    };
    //自訂篩選
    $scope.customFilter2 = function () {
        return function (item) {
            if ($scope.data.filters.check1.Value) {
                if (item.QTY != 0 || item.OrderQty != 0)
                    return true;
                else
                    return false;
            }
            return true;
        };
    };
    //到頁底繼續讀取
    $scope.loadMore = function () {
        $scope.data.PageLimit += 10;
        $scope.customFilter();

        //不用再加長了
        if ($scope.data.PageLimit >= $scope.originfilteredArray.length) {
            $scope.data.noMoreItemsAvailable = true;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
    };

    ///購物車
    //購物車-加量
    $scope.AddQty = function (item) {
        UIOrderControl.add(item);
    };
    //購物車-改量 GotFocus全選
    $scope.onTextClick = function ($event) {
        $event.target.select();
    };
    //購物車-減量
    $scope.DelQty = function (item) {
        UIOrderControl.del(item);
    };
    //購物車-送出訂單
    $scope.SendOrder = function (item) {
        UIOrderControl.send(item);
    };

    ///篩選
    //Modal
    $ionicModal.fromTemplateUrl('templates/0031OrderItemFilter.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function () {
        $scope.modal.show();
    };
    $scope.closeModal = function () {
        $scope.modal.hide();
    };
    $scope.$on('modal.hidden', function () {
        if ($scope.data.filters.check1.Value) {
            $scope.data.filters.hasFilter = true;
            $ionicScrollDelegate.scrollTop();
        }
        else {
            $scope.data.filters.hasFilter = false;
        }
    });

    ///倒數計時
    //開始倒數
    var myCountdown = $interval(function () {
        var IsStopCountdown = true;
        angular.forEach($scope.Groups, function (value, key) {
            value.SECONDS--;
            if (value.SECONDS > 0) {
                IsStopCountdown = false;
            }
            //最後五分鐘，跳出提醒視窗
            if(value.SECONDS<=300 && value.SECONDS>0) {
                //$ionicPopup.alert({
                //    title: '提醒',
                //    template: '部門：'+value.Name+' 快要停止下單了‧請盡快提交訂單！'
                //});
            }
        });
        if (IsStopCountdown) {
            $scope.StopCountdown();
        }
    }, 1000);
    //停止倒數
    $scope.StopCountdown = function () {
        $interval.cancel(myCountdown);
    };

    ///Exit
    $scope.$on('$destroy', function () {
        // Make sure that the interval is destroyed too
        $scope.StopCountdown();
    });
})
.controller('101Ctrl', function (UserData, $scope, $state, SampleData, UIOrderControl) {
    //Init
    var unique = {};
    $scope.dateGroups = [];
    $scope.OrdersDetail = [];
    $scope.columnNOR = { width: '13%' };    //頁面有十個元素, 先預設每個元素寬度
    $scope.columnQTY = { width: '22%' };    //有四個元素為一組

    //取得訂單明細
    SampleData.Orders()
    .then(function (response) {
        var rawOrders = response.data;
        var IsNewObject = true;

        //分離出日期
        for (var i in rawOrders) {
            if (typeof (unique[rawOrders[i].RECEIVE_DATE]) == "undefined") {
                $scope.dateGroups.push({ RECEIVE_DATE: rawOrders[i].RECEIVE_DATE, IsShownGroup: true, Items: [] });
            }
            unique[rawOrders[i].RECEIVE_DATE] = 0;
        }

        //塞入訂單
        angular.forEach(rawOrders, function (value1, key) {
            angular.forEach($scope.dateGroups, function (value2, key) {
                if (value1.RECEIVE_DATE == value2.RECEIVE_DATE) {
                    value2.Items.push(value1);
                }
            });
        });
    });

    //購物車-加量
    $scope.AddQty = function (item) {
        UIOrderControl.add(item);
    };
    //購物車-改量 GotFocus全選
    $scope.onTextClick = function ($event) {
        $event.target.select();
    };
    //購物車-減量
    $scope.DelQty = function (item) {
        UIOrderControl.del(item);
    };
    //購物車-送出訂單
    $scope.SendOrder = function (item) {
        UIOrderControl.send(item);
    };

    //切換到歷史紀錄分頁
    $scope.changePage = function () {
        //UserData.LastPageCount -= 1;
        $state.go('app.102');
    };

    //排版
    //群組縮放
    $scope.toggleGroup = function (index) {
        $scope.dateGroups[index].IsShownGroup = !$scope.dateGroups[index].IsShownGroup;
    };
    $scope.isGroupShown = function (index) {
        return $scope.dateGroups[index].IsShownGroup;
    };
})
.controller('102Ctrl', function ($rootScope, UserData, $scope, $state) {
    $scope.data.Orders = UserData.Orders;
    //切換到訂單分頁
    $scope.changePage = function () {
        UserData.LastPageCount -= 1;
        $state.go('app.101');
    };
})
;