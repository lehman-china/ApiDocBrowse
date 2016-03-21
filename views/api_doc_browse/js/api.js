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
        var DOMAN_LS_KEY = "DOMAN_LS_KEY";
        $scope.view = g_view;
        $scope.form = {}; // 一些提交的数据分类
        // 域名
        $scope.domain = localStorage.getItem(DOMAN_LS_KEY) || "http://192.168.1.100:8080";
        $scope.domainList = [
            // 新网缘
            "http://192.168.1.201:8082/job",
            "http://192.168.1.173:8080"
        ];

        $scope.$watch("domain", function (nData) {
            localStorage.setItem(DOMAN_LS_KEY, nData);
        });

        // 请求头的展示,与数据同步
        $scope.getRequestHeaders = function () {
            var requestHeaders = {
                'Content-Type': $scope.form.contentType
                // 当前取, 或 sessionStorage中取
                //'Cookie': $scope.form.Cookie || sessionStorage["simuLoginInfo"]
                //'Cookie': "app_name=forums; device_id=2521fcfd8c85892e86c12f6fa425d8b924129cab; device_os=iOS; device_osversion=7.1.1; device_type=iPhone 5s; q_version=1.3.0226; sessionToken=a8d18c60956cdaf235a27fceded352b7; userId=1900489"
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

        // 接口签名计算
        function getSignCalc(param) {
            param["app_name"] = "forums";
            param["device_id"] = "2521fcfd8c85892e86c12f6fa425d8b924129cab";
            param["device_os"] = "iOS";
            param["device_osversion"] = "7.1.1";
            param["device_type"] = "iPhone 5s";
            param["q_version"] = "1.3.0226";
            param["req_timestamp"] = +new Date();

            //**** 读取从服务器获得统一登陆信息 begin
            var loginUserRes = Util.syncAjax({
                url: "/get_login_user_resp.ajax",
                data: {
                    param: JSON.stringify($scope.view.apiTest)
                }
            });
            var user = loginUserRes.user;
            param["userId"] = user.userId;
            param["sessionToken"] = loginUserRes.sessionToken;

            sessionStorage["simuLoginUser"] = $scope.view.simuLoginUser = user.userName = "登录成功!!! \n acount : " + user.mobileNumber +
                            " ;\n userId : " + param["userId"] + " ;\n sessionToken : " + param["sessionToken"];
            //**** 读取从服务器获得统一登陆信息 end



            var signSalt = "ffwefq#%wef23541235";
            var keys = _.sortBy(Object.keys(param));
            var sign = signSalt;
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                if ("sign" !== key && !/file_/.test(key)) {
                    sign += key + param[key];
                }
            }
            sign += signSalt;

            param["sign"] = Util.toMD5(sign).toUpperCase();
            return param;
        }

        $scope.testApi = function () {
            var param = $(".api-param-show").val();
            try {
                param = JSON.parse(param);
            } catch (e) {
                return alert(e + "参数需是JSON格式");
            }


            //****************** 签名算法
            $scope.view.apiTest.param = getSignCalc(param);


            delete $scope.view.apiTest.result;

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
        $scope.form.simuAccount = "18566767959";
        $scope.form.simuPassword = "1101";
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

        // 模拟登录,加入登陆信息
        $scope.simuLogin = function () {
            var param = {
                url: $scope.domain + "/user/loginbyauthcode",
                headers: {"Content-Type": "text/plain;charset=UTF-8"},
                type: "GET",
                contentType: "application/json;charset=UTF-8",
                param: {
                    "device_os": "iOS",
                    "device_osversion": "7.1.1",
                    "device_type": "iPhone 5s",
                    "q_version": "1.3.0226",
                    "req_timestamp": +new Date(),
                    "phoneNumber": $scope.form.simuAccount,
                    "authCode": $scope.form.simuPassword,
                    "device_id": "2521fcfd8c85892e86c12f6fa425d8b924129cab"
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
                        var res = JSON.parse(res.content);
                        var user = res.user;
                        sessionStorage["simuLoginUser"] = $scope.view.simuLoginUser = "登录成功!!! \n acount : " + $scope.form.simuAccount +
                            " ;\n userId : " + user.userId + " ;\n sessionToken : " + res.sessionToken;
                        sessionStorage["simuLoginInfo"] = JSON.stringify({userId: user.userId, sessionToken: res.sessionToken});
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



