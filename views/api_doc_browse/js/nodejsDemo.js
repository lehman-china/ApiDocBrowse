require( [ "layer", "angular", "commonUtil", "jquery" ], function ( layer ) {

    var app = angular.module( 'demo.nodejs', [] );
    app.controller( "demoNodejsCtrl", function ( $scope ) {
        //******************************* session 操作
        $scope.orderMethod = Util.session().orderMethod;
        $scope.changePerson = function () {
            $scope.orderMethod = "person";
            Util.session( { orderMethod: $scope.orderMethod } );

        };
        $scope.changeGroup = function () {
            $scope.orderMethod = "group";
            Util.session( { orderMethod: $scope.orderMethod } );
        };


        //*******************************sql 修改 操作
        $scope.user = Util.queryUniq( "select * from user LIMIT 0,1" );
        $scope.ngUser =  $.extend( {}, $scope.user );
        $scope.changeUserInfo = function () {
            var sql = "update user set id=?,name=?,mobile=? where id=1";
            var param = [ $scope.ngUser.id * 1, $scope.ngUser.name, $scope.ngUser.mobile ];
            Util.execute( sql, param );
            $scope.user = $.extend( {}, $scope.ngUser );
        };

        //*******************************sql 查询
        $scope.keyWord = "";
        $scope.products = [];
        $scope.query = function () {
            var sql = "select * from product where name like '%" + $scope.keyWord + "%' or sn like '%" + $scope.keyWord + "%' LIMIT 0,30";
            $scope.products = Util.query( sql );
        };

    } );


    // require加载器,需要用bootstrap来启动angular编译页面
    angular.bootstrap( document.getElementsByTagName( "body" ), [ 'demo.nodejs' ] );
} );

