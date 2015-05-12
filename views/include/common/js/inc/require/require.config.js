
// 默认情况下模块所在目录为起始目录
var baseUrl = '/common/js/';
require.config( {

    shim: {
        "angular": {
            exports: 'angular'
        },
        "avalon": {
            exports: 'avalon'
        },
        "angular-sanitize":["angular"],
        "ngmodel.format": {
            deps: [ 'angular' ],
            exports: 'ngmodelFormat'
        },
        "bootstrap": {
            deps: [
                'jquery',
                "css!" + baseUrl + "framework/bootstrap/css/bootstrap.min"
            ]
        },
        "commonUtil": [ 'jquery', 'jvalidator' ],
        "jvalidator": [ 'jquery' ],
        "layer": [ 'jquery' ]
    },
    paths: {
        "angular": baseUrl + "framework/angular/angular.min",
        "angular-sanitize": baseUrl + "framework/angular/angular-sanitize.min",
        "avalon": baseUrl + "framework/avalon/avalon",
        "ngmodel.format": baseUrl + "framework/angular/ngmodel.format", // angular 绑定格式化
        "jvalidator": baseUrl + "inc/jvalidator",// jq 表单验证
        "jquery": baseUrl + "inc/jquery",
        "bootstrap": baseUrl + "framework/bootstrap/js/bootstrap.min",
        "commonUtil": baseUrl + "util/commonUtil",
        "layer": baseUrl + "framework/layer/mobile/layer.m.dev" // mobile弹出层
    },
    map: {
        '*': {
            'css':  baseUrl+'inc/require/require-css/css.js' // or whatever the path to require-css is
        }
    },
    urlArgs: "bust=" + (new Date()).getTime()  //TODO 防止读取缓存，调试阶段使用
} );
