angular.module('starter.controllers_teach')
.controller('Others001Ctrl', function ($scope) {
    $scope.data = {
        Pixel: 10,
        DPI: 300,
        CM: 0.08467
    };
    $scope.onClick = function () {
        $scope.data.CM = $scope.data.Pixel / $scope.data.DPI * 2.54;
    };
})