angular.module('starter.services', [])
.service('myService', function () {
    var self = this;
    self.name = 'John';
    self.value = 'Doe';

    //��@�ܼ�
    //�����s��

    //�p�⦡
    self.getname = function () {
        return self.name + ' ' + self.value;
    };
    self.setname = function (value) {
        self.name = value;
    };

    //���
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
        //��@�ܼ�
        name: self.name,
        //�p�⦡
        getname: self.name + ' ' + self.value,
        setname: setname(),
        //���
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