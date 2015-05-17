
// Ĭ�������ģ������Ŀ¼Ϊ��ʼĿ¼
var baseUrl = '/include/common/js/';
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
        "ngmodel.format": baseUrl + "framework/angular/ngmodel.format", // angular �󶨸�ʽ��
        "jvalidator": baseUrl + "inc/jvalidator",// jq ����֤
        "jquery": baseUrl + "inc/jquery",
        "bootstrap": baseUrl + "framework/bootstrap/js/bootstrap.min",
        "commonUtil": baseUrl + "util/commonUtil",
        "layer": baseUrl + "framework/layer/mobile/layer.m.dev" // mobile������
    },
    map: {
        '*': {
            'css':  baseUrl+'inc/require/require-css/css.js' // or whatever the path to require-css is
        }
    },
    urlArgs: "bust=" + (new Date()).getTime()  //TODO ��ֹ��ȡ���棬���Խ׶�ʹ��
} );
