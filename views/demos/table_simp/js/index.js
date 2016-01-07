var demoModule = angular.module("demo", []);
demoModule.controller("demoCtrl", function ($scope) {
    $scope.name = "1223";


    $scope.valueList = [];

    var xSize = 32, ySize = 4;
    for (var i = 0; i < ySize; i++) {
        var values = [];
        for (var j = 0; j < xSize; j++) {
            var inx = i * xSize + j;
            values.push({
                "style": {
                    "background-color": ["gray", "green", "blue", "red"][inx % 4]
                }, state: inx % 4, inx: inx
            });
        }
        $scope.valueList.push(values);
    }


});