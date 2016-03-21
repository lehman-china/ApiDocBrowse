// Ĭ�������ģ������Ŀ¼Ϊ��ʼĿ¼
var baseUrl = '/common/js/';
require.config({

    shim: {
        "angular": {
            exports: 'angular'
        },
        "avalon": {
            exports: 'avalon'
        },
        "angularSanitize": ["angular"],
        "ngmodel.format": {
            deps: ['angular'],
            exports: 'ngmodelFormat'
        },
        "bootstrap": {
            deps: [
                'jquery',
                "css!" + baseUrl + "framework/bootstrap/css/bootstrap.min"
            ]
        },
        "commonUtil": ['jquery', "md5"],
        "jvalidator": ['jquery'],
        "layer": {
            deps: [
                'jquery',
                "css!" + baseUrl + "framework/layer/skin/layer"
            ]
        }
    },
    paths: {
        "angular": baseUrl + "framework/angular/angular.min",
        "angularSanitize": baseUrl + "framework/angular/angular-sanitize.min",
        "avalon": baseUrl + "framework/avalon/avalon",
        "ngmodel.format": baseUrl + "framework/angular/ngmodel.format", // angular �󶨸�ʽ��
        "jquery": baseUrl + "inc/jquery",
        "md5": baseUrl + "inc/md5",
        "_": baseUrl + "inc/underscore",
        "bootstrap": baseUrl + "framework/bootstrap/js/bootstrap.min",
        "commonUtil": baseUrl + "util/commonUtil",
        "layer": baseUrl + "framework/layer/layer"
    },
    map: {
        '*': {// require 加载css插件
            'css': baseUrl + 'inc/require/require-css/css.js' // or whatever the path to require-css is
        }
    },
    urlArgs: "bust=" + (new Date()).getTime()  //TODO ��ֹ��ȡ���棬���Խ׶�ʹ��
});
