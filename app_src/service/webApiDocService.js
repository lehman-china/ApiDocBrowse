var fs = require( "fs" );

function createCtrlData( content ){
    var classMapUrlReg = /[\d\D]*@RequestMapping\s*?\(.*?\"(.*?)\"[\d\D]*?class.*?\{/;
    var classMapUrl = (classMapUrlReg.exec(content) || ["",""])[1];
    content = content.replace( classMapUrlReg , "" );
    // 切出所有的方法区域
    var allFuncReg = /.*\/\*[\d\D]*?@RequestMapping[\d\D]*?\{/g;
    var allFunc = content.match( allFuncReg ).join( "\r\n\r\n" );

    // 替换 参数类型,和请求类型 说明
    allFunc = allFunc.replace(/produces.*?MediaTypes\./g,"参数类型: ").replace(/method.*?RequestMethod\./g,"请求方式: ");

    // 替换 返回类型
    allFunc = allFunc.replace(/@ResponseBody/g,"返回类型:JSON");
    // 替换为正确的url
    var repUrlReg = /@RequestMapping.*?\(.*?\"(.*?)\"(.*?)\)/g;

    allFunc = allFunc.replace(repUrlReg,"url:"+classMapUrl+"\/$1 $2");
    return allFunc;
}

module.exports = {
    createCtrlData : createCtrlData
};