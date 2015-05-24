require( [ "layer", "angular", "commonUtil", "bootstrap" ], function ( layer ) {

    var app = angular.module( 'apiDocCenter', [] );

    app.controller( "apiDocCenterCtrl", function ( $scope, $interval ) {



    } );

    // require加载器,需要用bootstrap来启动angular编译页面
    angular.bootstrap( document.getElementsByTagName( "body" ), [ 'apiDocCenter' ] );


    //*********************************jquery



} );


