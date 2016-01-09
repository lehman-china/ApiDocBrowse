require(["layer", "angular", "commonUtil", "bootstrap"], function (layer) {


    var app = angular.module('api', []);
    // 字符串html 输出
    app.directive('ngHtml', function () {
        return function (scope, el, attr) {
            if (attr.ngHtml) {
                scope.$watch(attr.ngHtml, function (html) {
                    html = (html || '无说明').replace(/\n/g, "<br/>").replace(/\s/g, "&nbsp;")
                    el.html(html);//更新html内容
                });
            }
        };
    });

    // api文档说明对象的 html美化输出.
    app.directive('ngApiDocHtml', function () {
        return function (scope, el, attr) {
            attr.ngApiDocHtml && scope.$watch(attr.ngApiDocHtml, function (obj) {
                var html = Util.JsonUtilApiDoc.convertToString(obj);
                el.html(html);//更新html内容
            });
        };
    });
    // api测试结果 html美化输出.
    app.directive('ngTestResHtml', function () {
        return function (scope, el, attr) {
            attr.ngTestResHtml && scope.$watch(attr.ngTestResHtml, function (obj) {
                var html = Util.JsonUtil.convertToString(obj);
                el.html(html);//更新html内容
            });
        };
    });

    app.controller("apiCtrl", function ($scope, $interval) {
        var DOMAN_LS_KEY = "DOMAN_LS_KEY"
        $scope.view = g_view;
        $scope.form = {}; // 一些提交的数据分类
        // 域名
        $scope.domain = localStorage.getItem(DOMAN_LS_KEY) || "http://192.168.1.100:8080";
        $scope.domainList = ["http://192.168.1.100:8080", "http://www.myymjk.com/", "http://test.cyyz-health.com/", "http://www.tsymjk.com/"];

        $scope.$watch("domain", function (nData) {
            localStorage.setItem(DOMAN_LS_KEY, nData);
        });

        // 请求头的展示,与数据同步
        $scope.getRequestHeaders = function () {
            var requestHeaders = {
                'Content-Type': $scope.form.contentType,
                // 当前取, 或 sessionStorage中取
                'Cookie': $scope.form.Cookie || sessionStorage["simuLoginCookie"]
            };
            return $scope.view.apiTest.headers = requestHeaders;
        };

        // ***********************************选中 api 目录和api*********************************************
        // 当前选中api 索引
        $scope.view.curApi = null;
        $scope.api_catalog_inx = parseInt(/api_catalog_inx=(\d)&/.exec(location.href)[1]);
        $scope.api_inx = parseInt(/api_inx=(\d)/.exec(location.href)[1]);

        $scope.selApiCatalog = function ($index) {
            $scope.api_inx = 0;
            $scope.api_catalog_inx = $index;
        };
        $scope.selApi = function ($index) {
            $scope.api_inx = $index;
        };
        function syncData() {
            var curApi = $scope.view.curApi = $scope.view.allApi[$scope.api_catalog_inx].apiList[$scope.api_inx];

            location.href = "#api_catalog_inx=" + $scope.api_catalog_inx + "&api_inx=" + $scope.api_inx;

            $scope.view.apiTest = {
                url: curApi.url,
                type: curApi.type
            };
            $scope.form.contentType = curApi.contentType;
            // 参数显示
            var html = Util.JsonUtilTxt.convertToString(curApi.param);
            $(".api-param-show").val(html);

            // url 增加域名前缀
            $scope.view.apiTest.url = $scope.domain + $scope.view.apiTest.url;
        }

        // 选中api
        $scope.$watch("api_catalog_inx", function () {
            syncData()
        });
        $scope.$watch("api_inx", function () {
            syncData()
        });


        //region ****************************测试 api 接口*****************************
        $scope.TYPE_LIST = ["GET", "POST", "PUT"];
        $scope.CONTENT_TYPE_LIST = ["text/plain;charset=UTF-8", "application/json;charset=UTF-8", "application/x-www-form-urlencoded;charset=UTF-8", "text/javascript;charset=UTF-8"];
        $scope.form.contentType = "text/plain";
        $scope.form.Cookie = "";// 用于模拟App登录的
        $scope.form.requestParams = {};
        $scope.view.apiTestTime = 0;
        $scope.view.apiTest = {
            url: "http://www.baidu.com",
            headers: {},
            type: "GET",
            param: {},
            result: ""
        };

        $scope.testApi = function () {
            var param = $(".api-param-show").val();
            try {
                param = $scope.view.apiTest.param = JSON.parse(param);
            } catch (e) {
                return alert(e + "参数需是JSON格式");
            }
            var apiTestTime = new Date();
            Util.ajax({
                url: "/testApi.ajax",
                data: {
                    param: JSON.stringify($scope.view.apiTest)
                },
                success: function (res) {
                    var obj;
                    try {
                        obj = JSON.parse(res.content);
                    } catch (e) {
                        obj = res;
                    }
                    $scope.$apply(function () {
                        $scope.view.apiTestTime = new Date() - apiTestTime;
                        $scope.view.apiTest.result = obj;
                    });
                }

            });

        };
        //endregion
        //region ****************************模拟APP登录*****************************
        $scope.form.simuAccount = "13266720440";
        $scope.form.simuPassword = "hello123";
        var loginInx = null;
        $scope.view.simuLoginUser = sessionStorage["simuLoginUser"];
        function initSimulateLogin() {
            $(".simulate-login-btn").click(function () {
                //自定页
                loginInx = layer.open({
                    type: 1,
                    title: "模拟登录",
                    skin: 'layui-layer-demo', //样式类名
                    shift: 2,
                    shadeClose: true, //开启遮罩关闭
                    content: $(".simulate-login")
                });
            });
        }

        // 模拟登录,把Cookie = 放入 $scope.form.Cookie
        $scope.simuLogin = function () {
            var param = {
                url: $scope.domain + "/api/login",
                headers: {"Content-Type": "text/plain;charset=UTF-8"},
                type: "POST",
                contentType: "text/plain",
                param: {
                    "username": $scope.form.simuAccount,
                    "password": Util.toMD5($scope.form.simuPassword),
                    "clientId": "API_TEST_CLIENT_ID",
                    "promoteChannelKey": "API_TEST_PROMOTE_CHANNEL"
                }
            };
            param = JSON.stringify(param);
            Util.ajax({
                url: "/testApi.ajax",
                data: {
                    param: param
                },
                success: function (res) {
                    try {
                        var res = JSON.parse(res.content).data;
                        sessionStorage["simuLoginUser"] = $scope.view.simuLoginUser = "登录成功!!! \n acount : " + $scope.form.simuAccount +
                            " ;\n userId : " + res.userId + " ;\n JSESSIONID : " + res.jsessionId + " ; TOKEN : " + res.token;
                        sessionStorage["simuLoginCookie"] = $scope.form.Cookie = "JSESSIONID=" + res.jsessionId + "; TOKEN=" + res.token;
                        $scope.$apply();
                        layer.close(loginInx);
                    } catch (e) {
                        alert("登录失败:" + e);
                    }
                }
            });
        };
        //endregion
        //region ****************************一些初始化*****************************
        $(function () {
            initMD5Tool();
            initSimulateLogin();
        });
        //endregion
        //region ****************************浮动工具*****************************
        //MD5 工具
        function initMD5Tool() {
            var $md5Input = $(".md5-tool input");
            $(".md5-tool botton").click(function () {
                var md5Val = Util.toMD5($md5Input.eq(0).val());
                $md5Input.eq(1).val(md5Val);
            });
        }

        //endregion
    });

    // require加载器,需要用bootstrap来启动angular编译页面
    angular.bootstrap(document.getElementsByTagName("body"), ['api']);
});



