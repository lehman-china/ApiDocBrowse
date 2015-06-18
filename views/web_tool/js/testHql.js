require( [ "layer", "angular", "commonUtil", "bootstrap" ], function ( layer ) {


    var app = angular.module( 'api', [] );
    // 字符串html 输出
    app.directive( 'ngHtml', function () {
        return function ( scope, el, attr ) {
            if ( attr.ngHtml ) {
                scope.$watch( attr.ngHtml, function ( html ) {
                    html = (html || '无说明').replace( /\n/g, "<br/>" ).replace( /\s/g, "&nbsp;" )
                    el.html( html );//更新html内容
                } );
            }
        };
    } );
    // api测试结果 html美化输出.
    app.directive( 'ngTestResHtml', function () {
        return function ( scope, el, attr ) {
            attr.ngTestResHtml && scope.$watch( attr.ngTestResHtml, function ( obj ) {
                var html = Util.JsonUtil.convertToString( obj );
                el.html( html );//更新html内容
            } );
        };
    } );

    app.controller( "apiCtrl", function ( $scope ) {
        $scope.view = g_view;
        $scope.form = {}; // 一些提交的数据分类
        // 域名
        $scope.domain = "http://192.168.1.100:8080";
        $scope.domainList = ["http://192.168.1.100:8080","http://www.myymjk.com/","http://test.cyyz-health.com/","http://www.tsymjk.com/"];


        //region ****************************测试 hql*****************************
        $scope.view.apiTestTime = 0;
        $scope.view.apiTest = {
            url: "/api/anon/test_hql",
            testType: "hql",//测试类型
            queryType: "query",//查询方式
            passCode:"",//测试验证码
            headers: {
                contentType : "text/plain;charset=UTF-8"
            },
            type: "GET",
            param: {},

            result: ""
        };

        $scope.testApi = function () {
            var apiTestTime = new Date();
            var hql = $("#tset-hql" ).val();
            $scope.view.apiTest.url = $scope.domain + "/api/anon/test_hql?hql="+hql+"&passCode="+$scope.view.apiTest.passCode+"&type="+$scope.view.apiTest.testType+"&queryType="+$scope.view.apiTest.queryType;
            $scope.view.apiTest.result = "";
            Util.ajax( {
                url: "/testApi.ajax",
                data: {
                    param: JSON.stringify( $scope.view.apiTest )
                },
                success: function ( res ) {
                    var obj;
                    try {
                        obj = JSON.parse( res.content );
                    } catch ( e ) {
                        obj = res;
                    }
                    $scope.$apply( function () {
                        $scope.view.apiTestTime = new Date() - apiTestTime;
                        $scope.view.apiTest.result = obj;
                    } );
                }

            } );

        };
        //endregion

    } );

    // require加载器,需要用bootstrap来启动angular编译页面
    angular.bootstrap( document.getElementsByTagName( "body" ), [ 'api' ] );
} );



