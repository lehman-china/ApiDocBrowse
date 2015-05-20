require( [ "layer", "angular", "commonUtil", "bootstrap" ], function ( layer ) {

    var app = angular.module( 'apiDocCenter', [] );

    app.controller( "apiDocCenterCtrl", function ( $scope, $interval ) {
        $scope.form = {
            url:"",
            type:"get"

        };
        $scope.testApi = function( ){
            Util.ajax({
                url:"testApi.ajax",
                data:{
                    url:$scope.form.url,
                    type:$scope.form.type
                },
                success:function( res ){
                    try {
                        var obj = typeof(res.res) == "string" ? JSON.parse( res.res ) : res.res;

                        var html = Util.JsonUtil.convertToString( obj );

                        $( "#reRes" ).html( html );
                    } catch ( e ) {
                        $( "#reRes" ).html( res.res );
                    }


                }
            });
        }

    } );

    // require加载器,需要用bootstrap来启动angular编译页面
    angular.bootstrap( document.getElementsByTagName( "body" ), [ 'apiDocCenter' ] );


    //*********************************jquery



} );


