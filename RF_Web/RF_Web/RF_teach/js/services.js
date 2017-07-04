angular.module('starter.services', [])
.service('myService', function () {
    var self = this;
    self.name = 'John';
    self.value = 'Doe';

    //單一變數
    //直接存取

    //計算式
    self.getname = function () {
        return self.name + ' ' + self.value;
    };
    self.setname = function (value) {
        self.name = value;
    };

    //函數
    self.getobj = function () {
        return self;
    };
})

.factory('myFactory', function () {
    var self = this;
    self.name = 'John';
    self.value = 'Doe';

    function getobj() {
        return self;
    };
    function setname(value) {
        self.name = value;
    };

    return {
        //單一變數
        name: self.name,
        //計算式
        getname: self.name + ' ' + self.value,
        setname: setname(),
        //函數
        getobj: getobj()
    }
})
.provider('myProvider', function () {
    var self = this;
    self.name = 'John';
    self.value = 'Doe';

    var version;
    return {
        setname: function (value) {
            self.name = value;
        },
        setVersion: function (value) {
            version = value;
        },
        $get: function () {
            return {
                getname: self.name + ' ' + self.value,
                title: 'The Matrix' + ' ' + version
            }
        }
    }
})
;