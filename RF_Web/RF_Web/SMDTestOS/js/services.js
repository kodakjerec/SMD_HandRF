angular.module('starter.services', [])
//�򥻸��
.factory('SampleData', function ($http, $httpParamSerializerJQLike) {
    var strURL = "http://192.168.120.162/RF_teach_DB/handler/HandlerSMDTestOS.ashx";
    //var strURL = "http://localhost:62869/handler/HandlerSMDTestOS.ashx";
    return {
        //���o��f��
        ArriveDates: function () {
            return $http({
                method: 'POST',
                url: strURL,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },   //���n
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
        //���o����
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
        //���o�o�`��
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
        //���o�q�����
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
//�s�W�q��
.factory('InsertOrder', function ($http, $httpParamSerializerJQLike) {
    var strURL = "http://192.168.120.162/RF_teach_DB/handler/HandlerSMDTestOS.ashx";
    //var strURL = "http://localhost:62869/handler/HandlerSMDTestOS.ashx";
    return {
        NewOrder: function (params) {
            return $http({
                method: 'POST',
                url: strURL,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },   //���n
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
//�q��e��UI�[��
.factory('UIOrderControl', function ($rootScope) {
    return {
        //�[�q
        add: function (item) {
            if (item != undefined) {
                item.OrderQty++;
            }
        },
        //��q
        del: function (item) {
            item.OrderQty--;

            if (item.QTY + item.OrderQty < 0) {
                item.OrderQty++;
            }
        },
        //�e�X�q��
        send: function (item) {
            //�ˬd��J�O�_�X�z
            if (Number.isFinite(item.OrderQty)) {
                //�����\����t��
                if (item.QTY + item.OrderQty < 0) {
                    item.OrderQty = 0;
                    return;
                }
                //�����s
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