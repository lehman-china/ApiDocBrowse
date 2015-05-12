require( [ "angular", ], function () {
    var app = angular.module( 'demo.angular', [] );
    app.controller( "demoAngularCtrl", function ( $scope ) {
        $scope.users = [ {name:11,age:22}, "用户2", "用户3", "用户4", "用户5" ];


    } );

    // require加载器,需要用bootstrap来启动angular编译页面
    angular.bootstrap( document.getElementsByTagName( "body" ), [ 'demo.angular' ] );
} );

