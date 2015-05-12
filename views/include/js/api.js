require( [ "layer", "angular", "commonUtil", "bootstrap" ], function ( layer ) {

    var app = angular.module( 'api', [] );

    app.controller( "apiCtrl", function ( $scope, $interval ) {
        $scope.apiList = null;
        $scope.apiCatalog = Util.request.getParameter( "api_catalog" );
        $scope.api_inx = Util.request.getParameter( "api_inx" );

        $scope.view = {
            apiTest : {
                url:"http://www.baidu.com",
                typeList: ["GET","POST","PUT"],
                type: "GET",
                contentTypeList: ["text/plain","application/json"],
                contentType: "text/plain",
                param:{
                    phone:"13266720440"

                },
                result:""

            }

        };


        $scope.selApi = function($index){

            Util.ajax( {
                    url: "/api.ajax",
                    data: {
                        api_catalog: $scope.apiCatalog,
                        api_inx: $index
                    },
                    success: function ( res ) {
                        var html = res.replace( /\n/g, "<br/>" ).replace( /\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;" );
                        console.log( html )
                        $( ".api-display" ).html( html );
                    }
                }
            );
        };

        $( function () {
            var apiCatalog = Util.request.getParameter( "api_catalog" );
            var api_inx = Util.request.getParameter( "api_inx" );


            $scope.selApi( $scope.api_inx );


            Util.ajax( {
                    url: "/api-list.ajax",
                    data:{ "api_catalog":$scope.apiCatalog },
                    success: function ( res ) {
                        var funcNameReg = /public\s*?[\d\D]*?\s*?([\d\D]*?)\(.*?/g;
                        $scope.apiList = res.match( funcNameReg ) ;
                        $scope.$apply();
                    }
                }
            );
        } );





        // 根据className 显示
        $( "[data-class-name]" ).mouseover( function () {
            var clsName = $( this ).attr( "data-class-name" );
            if ( !clsName ) return;
            var $clsTipsShow = $( "[data-class-name] span:eq(0)" );
            if ( !$clsTipsShow.html() ) {
                var user = Util.queryUniq( "select * from ? where id = 2", [ clsName ] );
                var html = JsonUtil.convertToString( user );
                $clsTipsShow.html( html );
            }
        } );


    } );

    // require加载器,需要用bootstrap来启动angular编译页面
    angular.bootstrap( document.getElementsByTagName( "body" ), [ 'api' ] );


    //*********************************jquery
    $( function () {
        var user = {
            className: {
                type: "String",
                note: "这个是类的名称"
            },
            toString: {
                type: "String",
                note: "这个String 形式输出"
            },
            length: {
                type: "Number",
                note: "属性的个数"
            },
            childs: {
                type: "Array",
                note: "一群孩子"
            },
            isLogin: {
                type: "Boolean",
                note: "是否登陆"
            },
            child: {
                type: "Object",
                note: "一个孩子",
                className: "com.lehman.Storage"
            }
        };
        var html = JsonUtil.convertToString( user );
        $( ".show" ).html( html );

    } )

} );


// 测试
var JsonUtil = {
    n: "\n", t: "	", s: " ",
    convertToString: function ( o ) {
        var html = [];
        var ju = JsonUtil;
        var objHtml = "";
        for ( var k in o ) {
            var row = "";
            var kHtml = "", vColor = "";
            // 值  value
            v = o[ k ];
            //变量名 key
            if ( v.type === 'Object' ) {
                kHtml = '<span style="color:rgb(122, 122, 67);">' + k + '</span>';
                var clsNameShort = v.className.substring( v.className.toString().lastIndexOf( "." ) + 1, v.className.length );
                objHtml = '<span data-class-name="' + v.className + '"><span></span>' + (clsNameShort || v.className) + '</span>';

            } else {
                kHtml = '<span style="color:rgb(102, 14, 122);font-weight:bold;">' + k + '</span>';
            }
            // 追加属性注释说明
            row = ju.n + ju.t + '<span style="color:#808080;font-style: italic;">//' + v.note + '</span>';

            row += ju.n + ju.t + kHtml + ju.s + ':' + JsonUtil.s + '<span style="color:green;font-weight:bold;">{' + ( objHtml || v.type) + '}</span>';
            html.push( row );
        }
        return "{" + html.join( "," ) + ju.n + "}";
    }
};
JsonUtil.n = "<br/>";
JsonUtil.t = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
JsonUtil.s = "&nbsp;";
