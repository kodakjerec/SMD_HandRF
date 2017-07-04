angular.module('starter.controllers_teach')
.controller('WebSocketClientCtrl', function ($scope) {
    $scope.socket = null;
    $scope.data = {
        URL: "192.168.81.21/RF_teach_DB/handler/Handler3.ashx",
        SendMessage: "sendmessage1",
        SocketIsEnabled: false,
        log: []
    };
    $scope.myalert = function (msg) {
        var date = new Date();
        var index = $scope.data.log.length+1;
        $scope.data.log.push(index + " " + msg + " " + date.toISOString());
        
    };

    $scope.contentLoaded = function () {
        if (window.WebSocket) {
            $scope.myalert("瀏覽器支援 WebSocket");
        } else {
            $scope.myalert("瀏覽器不支援 WebSocket ");
        }
    }

    $scope.openSocket = function () {
        $scope.socket = new WebSocket("ws://" + $scope.data.URL);
        $scope.socket.onopen = function () {
            $scope.myalert("建立與伺服端的連線!  state : " + $scope.socket.readyState)
            $scope.data.SocketIsEnabled = true;
        };

        $scope.socket.onmessage = function (event) {
            $scope.myalert("已收到伺服器傳送的訊息..." + event.data);
        };
        $scope.socket.onclose = function (event) {
            $scope.myalert("連線已關閉... state :" + $scope.socket.readyState);
        };
        $scope.socket.onerror = function (event) {
            $scope.myalert("發生錯誤 : " + event.data);
        };
    }

    $scope.SocketSend = function () {
        $scope.socket.send($scope.data.SendMessage);
    };

    $scope.SocketClose = function () {
        $scope.socket.close();
    };
})
;