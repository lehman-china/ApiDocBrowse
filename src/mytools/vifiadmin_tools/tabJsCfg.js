var mysql = require( '../../common/util/mysqlUtils' );
var fileUtils = require( '../../common/util/fileUtil' );


var entityName = "CtrlCmd";
var tabName = "tbViFi" + entityName;
// 默认是否隐藏
var defaultHide = false;
//显示的字段
var showField = {
    idxPhoneNumber: 1,
    countryCode: 1,
    acctounState: 1,
    vifiState: 1,
    userBalance: 1,
    rewardBalance: 1,
    lastAPPOnlineDate: 1,
    mdfTm: 1,
    mdfBy: 1
};
// 不在edit层中显示
var unshowEdit = {
    crtTm: 1,
    crtBy: 1,
    mdfTm: 1,
    mdfBy: 1,
    createdBy: 1,
    createdTime: 1,
    modifiedBy: 1,
    modifiedTime: 1
};

// js 类型对象,和java对象类型映射表.
var typeMapping = {
    "253": "S",
    "3": "I",
    "1": "I",
    "12": "D"
};
mysql.exec( `SELECT * FROM ${tabName} limit 0,1`, [], function ( err, rows, fields ) {
    if ( err ) throw err;

    var keyCount = 0,
        keyIndex = 0;
    for ( var field_k of fields ) {
        keyCount++;
    }
    // 是否切割
    var isSplit = keyCount > 17;

    // java 实体 属性
    var routeCfg = [];

    for ( var field of fields ) {

        var type = typeMapping[ field.type ];
        // 字段是否显示
        var hideCfg = !showField[ field.name ] && defaultHide ? " hide : true," : "";
        // leftCfg ,字段布局是否显示在左边
        var leftCfg = "";
        if ( isSplit ) {
            leftCfg = " left : " + ( keyIndex < ( keyCount / 2 ) ? "true, " : "false, " );
        }
        // 编辑时 不显示字段
        var notEditCfg = unshowEdit[ field.name ] ? " notEdit : true," : "";
        // 类型为S 是默认不显示
        var fType = type != "S" ? ` type : "${type}",` : "";
        // 主键标志 ..默认第一个字段为主键,主键编辑时默认禁用
        var pkFlag = !routeCfg.length ? " pk : true, eDisabled:true," : "";

        routeCfg.push( `{ name : "${field.name}", ${fType + pkFlag + hideCfg + leftCfg + notEditCfg} query : true },` );
        keyIndex++;

    }
    // 去除最后一个点
    routeCfg[ routeCfg.length - 1 ] = routeCfg[ routeCfg.length - 1 ].substring( 0, routeCfg[ routeCfg.length - 1 ].length - 1 );

    routeCfg.push( `];\n\n// 弹出层是否左右布局\n$scope.viewConfg.isSplit = ${isSplit};` );
    routeCfg.push( `\n// 初始化默认搜索字段\n$scope.form.searchField = $scope.viewConfg[0];` );
    console.log( routeCfg.join( "\n" ) );
    fileUtils.writeFile( `D:\\Users\\Desktop\\console.txt`, routeCfg.join( "\n" ) );

} );
