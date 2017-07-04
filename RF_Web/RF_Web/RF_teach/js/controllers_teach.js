angular.module('starter.controllers_teach', [])
.controller('teach001Ctrl', function ($rootScope, $scope) {
    $rootScope.Man = "Tom";
    $scope.person = {
        firstName: "John",
        lastName: "Doe",
        fullName: function () { var x = $scope.person; return x.firstName + " " + x.lastName; }
    };
})
.controller('teach001Ctrl_sub', function ($rootScope, $scope) {
    $scope.Man = $rootScope.Man;
    $scope.person = {
        firstName: "GI",
        lastName: "Joe",
        fullName: function () { var x = $scope.person; return x.firstName + " " + x.lastName; }
    };
})
.controller('teach002Ctrl', function ($scope) {
    $scope.names =
        [
            { name: 'Jani', country: 'Norway' },
            { name: 'Hege', country: 'Sweden' },
            { name: 'Kai', country: 'Denmark' }
        ];

    $scope.array = [];
    $scope.json = {};
    $scope.jsonarray = [{}, {}, {}];
})
.controller('teach003Ctrl', function ($scope, $http, $ionicLoading, $ionicPopup, $timeout) {
    var strURL = "http://localhost/RF_teach_DB/handler/Handler1.ashx";
    $scope.getclick = function () {
        var msg = $ionicLoading.show({
            template: '<p>查詢中...</p><ion-spinner></ion-spinner>'
        });
        $http({
            method: 'GET',
            url: strURL,
            params: { mode: 'QueryItemState' },
            data: { data1: 1, data2: 2 },
            responseType: "json"
        })
        .success(function (response) {
            console.log(response);
            $ionicPopup.alert({
                title: 'OK',
                template: response
            });
        })
        .error(function (response) {
            console.log(response);
        })
        .finally(function () {
            $ionicLoading.hide();
        })
        ;
    };

    $scope.postclick = function () {
        var msg = $ionicLoading.show({
            template: '<p>查詢中...</p><ion-spinner></ion-spinner>'
        });
        $http({
            method: 'POST',
            url: strURL,
            params: { mode: 'QueryItemState' },
            data: { data1: 1, data2: 2 },
            responseType: "json"
        })
        .success(function (response) {
            console.log(response);
            $ionicPopup.alert({
                title: 'OK',
                template: response
            });
        })
        .error(function (response) {
            console.log(response);
        })
        .finally(function () {
            $ionicLoading.hide();
        })
        ;
    };
})
.controller('teach004Ctrl', function ($scope, $ionicModal, $ionicPopover, $ionicPopup) {
    //Modal
    $ionicModal.fromTemplateUrl('templates/teach004_IonicModal.html', {
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

    //Popover
    // .fromTemplateUrl() method
    $ionicPopover.fromTemplateUrl('templates/teach004_IonicPopover.html', {
        scope: $scope
    }).then(function (popover) {
        $scope.popover = popover;
    });

    $scope.openPopover = function ($event) {
        console.log($scope.popover);
        $scope.popover.show($event);
    };
    $scope.closePopover = function () {
        $scope.popover.hide();
    };

    //Popup
    $scope.Popup = function () {
        $ionicPopup.alert({
            title: 'Don\'t eat that!',
            template: 'It might taste good'
        });
    };
})
.controller('teach005Ctrl', function ($scope) {
    $scope.map = null;

    $scope.getPosition = function () {
        if ($scope.map == null) {
            $scope.initMap();
        }
        $scope.setPath();
    };

    //#GoogleMap route
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();

    //開啟googleMapService
    $scope.initMap = function () {
        var mapOptions = {
            center: $scope.originLatLng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
        directionsDisplay.setMap($scope.map);
    };

    //設定路線
    $scope.setPath = function () {
        var request = {
            origin: new google.maps.LatLng('25.080', '121.550'),
            destination: new google.maps.LatLng('25.08114', '121.5583312'),
            // Note that Javascript allows us to access the constant
            // using square brackets and a string value as its
            // "property."
            travelMode: google.maps.TravelMode["DRIVING"]
        };
        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                console.log(response);
                directionsDisplay.setDirections(response);
            }
        });
    };
})
.controller('teach006Ctrl', function ($scope, myProvider, version, company, members, myService, myFactory) {
    $scope.myProviderProvider = myProvider.title;
    $scope.constant = version;
    $scope.value = company;
    $scope.valuejson = members();

    $scope.diffServiceFactory = function () {
        //Service測試
        console.log("以下為Service測試");
        console.log("存取Service.name " + myService.name);
        console.log("存取Service.value " + myService.value);
        console.log("存取Service.getname " + myService.getname);
        console.log("存取Service.getname() " + myService.getname());
        console.log("存取Service.getobj " + myService.getobj());
        //Factory測試
        console.log("以下為Factory測試");
        console.log("存取Factory.name " + myFactory.name);
        console.log("存取Factory.value " + myFactory.value);
        console.log("存取Factory.getname " + myFactory.getname);
        //Factory無法寫成function形式的呼叫
        //console.log("存取Factory.getname() " + myFactory.getname());
        console.log("存取Factory.getobj " + myFactory.getobj);
    };
})
.controller('teach006Ctrl_sub', function ($scope, myProvider, myService, myFactory) {
    $scope.ServiceName = myService.getname();
    $scope.FactoryName = myFactory.getname;
    $scope.ProviderName = myProvider.getname;

    //可看出factory不可搭配修改資料
    $scope.changeName = function () {
        //設定名稱
        myService.setname('kevin');
        myFactory.setname;
        //provider只能在config階段修改內容
        //myProvider.setname;

        $scope.ServiceName = myService.getname();
        $scope.FactoryName = myFactory.getname;
        $scope.ProviderName = myProvider.getname;
    };
})
.controller('teach008Ctrl', function ($http, $filter, $scope, $state, $filter) {
    $scope.data = {
        PageLimit: 10,
        noMoreItemsAvailable: false
    };

    //讀進發注本
    $http.get("src/ITEM.txt")
    .then(function (response) {
        $scope.Items = response.data;
    })
    .then(function () {
        //讀進部門別
        $scope.Groups = [
                {
                    Name: '蔬菜', Value: 1
                },
                {
                    Name: '水果', Value: 2
                },
                {
                    Name: '鮮魚', Value: 3
                },
                {
                    Name: '精肉', Value: 4
                },
                {
                    Name: '麵包', Value: 5
                }
        ];
        $scope.ChooseGroup = $scope.Groups[0];
        $scope.ScrollInit();
    });

    $scope.click = function (group) {
        $scope.ChooseGroup = group;
        $scope.ScrollInit();
    };

    //無限scroll
    $scope.originfilteredArray = [{}];
    //起始
    $scope.ScrollInit = function () {
        //reset scroll
        $scope.data.PageLimit = 10;
        $scope.data.noMoreItemsAvailable = false;
        $scope.originfilteredArray = $filter('filter')($scope.Items, { DPD_ID: $scope.ChooseGroup.Value });
        $scope.filtered = $filter('limitTo')($scope.originfilteredArray, $scope.data.PageLimit, 0);
        $scope.sortBy('CALLING_NUM');
    };
    //排序
    $scope.sortBy = function (string) {
        $scope.filtered = $filter('orderBy')($scope.filtered, string);
    };
    //到頁底繼續讀取
    $scope.loadMore = function () {
        $scope.data.PageLimit += 10;
        $scope.filtered = $filter('limitTo')($scope.originfilteredArray, $scope.data.PageLimit, 0);

        //不用再加長了
        if ($scope.data.PageLimit >= $scope.originfilteredArray.length) {
            $scope.data.noMoreItemsAvailable = true;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
    };
})
.controller('teach010Ctrl', function ($scope) {
    $scope.click = function () {
        var Shell = new ActiveXObject("Shell.Application");
        Shell.ShellExecute("C:\\Windows\\notepad.exe");
    };
})
;