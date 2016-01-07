var demoModule = angular.module("demo", []);
demoModule.controller("demoCtrl", function ($scope) {
    $scope.checkboxModel = {
        value1: true,
        value2: 'YES'
    };

    console.log(new Date().getTime(),"TTT")

});