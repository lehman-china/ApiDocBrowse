/**
 * Created by Administrator on 2015/5/3.
 */
var commonConst = require("../common/commonConst");
var fs = require( "fs");
// 获得生成控制器数据文件的合并的路径集合
function getConcatPath(){
    var docDataBuildPath = commonConst.SERVICE_DIR_PATH + "/api_doc_data_build/controller";
    var files =  {};
    var explains = [];
    try {
        fs.readdirSync( docDataBuildPath ).forEach( function ( file ) {
            var curPath = docDataBuildPath + "/" + file;
            if ( fs.lstatSync( curPath ).isDirectory() ) {
                // 收集所有分类说明文件路径
                explains.push( curPath + "/explain.json" );

                var buildFile = curPath + "/build.data";
                // 合并分类下的所有文件
                files[ buildFile ] = [ curPath + "/*.java" ];

                try {
                    fs.unlinkSync( buildFile );
                } catch ( e ) {
                }
            }
        } );
        files[ docDataBuildPath + "/explains.json" ] = explains;
    } catch ( e ) {
    }
    return files;
}
getConcatPath();
module.exports = {
    getConcatPath : getConcatPath
};