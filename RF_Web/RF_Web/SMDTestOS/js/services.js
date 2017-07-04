angular.module('starter.services', [])
//基本資料
.factory('SampleData', function ($http, $httpParamSerializerJQLike) {
    var strURL = "http://192.168.120.162/RF_teach_DB/handler/HandlerSMDTestOS.ashx";
    //var strURL = "http://localhost:62869/handler/HandlerSMDTestOS.ashx";
    return {
        //取得到貨日
        ArriveDates: function () {
            return $http({
                method: 'POST',
                url: strURL,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },   //必要
                params: { mode: 'Order', param1: '0', param2: '' },
                responseType: "json"
            })
            .success(function (response) {
                return response;
            })
            .error(function (response) {
                console.log(response);
            })
            .finally(function () {
            });
        },
        //取得部門
        Groups: function Group(Date) {
            return $http({
                method: 'POST',
                url: strURL,
                params: { mode: 'Order', param1: '1', param2: Date },
                data: {},
                responseType: "json"
            })
            .success(function (response) {
                return response;
            })
            .error(function (response) {
                console.log(response);
            })
            .finally(function () {
            });
        },
        //取得發注本
        ListItems: function Items(Date) {
            return $http({
                method: 'POST',
                url: strURL,
                params: { mode: 'Order', param1: '2', param2: Date },
                data: {},
                responseType: "json"
            })
            .success(function (response) {
                return response;
            })
            .error(function (response) {
                console.log(response);
            })
            .finally(function () {
            });
        },
        //取得訂單明細
        Orders: function Orders() {
            return $http({
                method: 'POST',
                url: strURL,
                params: { mode: 'Order', param1: '3', param2: '' },
                data: {},
                responseType: "json"
            })
            .success(function (response) {
                return response;
            })
            .error(function (response) {
                console.log(response);
            })
            .finally(function () {
            });
        }
    }
})
//新增訂單
.factory('InsertOrder', function ($http, $httpParamSerializerJQLike) {
    var strURL = "http://192.168.120.162/RF_teach_DB/handler/HandlerSMDTestOS.ashx";
    //var strURL = "http://localhost:62869/handler/HandlerSMDTestOS.ashx";
    return {
        NewOrder: function (params) {
            return $http({
                method: 'POST',
                url: strURL,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },   //必要
                params: { mode: 'NewOrder', param1: params.pDate, param2: params.pCALLING_NUM, param3: params.pQty, param4: params.pUser },
                responseType: "json"
            })
            .success(function (response) {
                return response;
            })
            .error(function (response) {
                console.log(response);
            })
            .finally(function () {
            });
        }
    }
})
//訂單前端UI加減
.factory('UIOrderControl', function ($rootScope) {
    return {
        //加量
        add: function (item) {
            if (item != undefined) {
                item.OrderQty++;
            }
        },
        //減量
        del: function (item) {
            item.OrderQty--;

            if (item.QTY + item.OrderQty < 0) {
                item.OrderQty++;
            }
        },
        //送出訂單
        send: function (item) {
            //檢查輸入是否合理
            if (Number.isFinite(item.OrderQty)) {
                //不允許扣到負值
                if (item.QTY + item.OrderQty < 0) {
                    item.OrderQty = 0;
                    return;
                }
                //遞交更新
                $rootScope.$emit('Orders.Refresh', item);

                var INTorderQty = parseInt(item.OrderQty);
                item.QTY += INTorderQty;
                item.OrderQty = 0;
            }
            else {
                item.OrderQty = 0;
            }
        }
    }
})
;