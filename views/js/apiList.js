require( [ "layer", "angular", "commonUtil", "bootstrap" ], function ( layer ) {

    var app = angular.module( 'api.list', [] );
    app.directive( 'move', function () {
        return {
            link: function ( $scope, element, attrs ) {
                var $this = angular.element( element );
                var $window = angular.element( window );
                $this.bind( 'mousedown', function ( e ) {
                    e.preventDefault(); // 阻止选中文本
                    $window.bind( 'mousemove', function ( e ) {
                        var x = e.pageX - 50, y = e.pageY - 50;
                        $this.css( { left: x + "px", top: y + "px", "position": "absolute" } );
                        $this.html( "参数:" + attrs.move + "<br/>坐标: x:" + x + ",y:" + y );
                    } );
                } );
                $window.bind( 'mouseup', function () {
                    $window.unbind( "mousemove" );
                } );
            }
        };
    } );

    app.controller( "apiListCtrl", function ( $scope, $interval ) {
        $scope.apiCatalog = null;
        $scope.apiList = null;
        $scope.form = {
            curApiCatalog : null
        };

        $( function () {
            Util.ajax( {
                    url: "/api-catalog.ajax",
                    success: function ( res ) {
                        $scope.apiCatalog = JSON.parse( res );
                        $scope.$apply();
                    }
                }
            );
        } );


        $scope.changeApiCatalog = function( api ){

            $scope.form.curApiCatalog = api.name;

            Util.ajax( {
                    url: "/api-list.ajax",
                    data:{ "api_catalog":api.name },
                    success: function ( res ) {
                        var funcNameReg = /public\s*?[\d\D]*?\s*?([\d\D]*?)\(.*?/g;
                        console.log( res )
                        $scope.apiList = res.match( funcNameReg ) ;
                        $scope.$apply();
                    }
                }
            );
        };

        $scope.selApi = function( api ,$index){
            location = "/api.html?api_catalog=" + $scope.form.curApiCatalog + "&api_inx=" + $index;
        };

    } );

    // require加载器,需要用bootstrap来启动angular编译页面
    angular.bootstrap( document.getElementsByTagName( "body" ), [ 'api.list' ] );
} );
