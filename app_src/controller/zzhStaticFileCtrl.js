var router = require( 'express' ).Router();
var path = require( 'path' );
var fs = require( "fs" );



/**
 * 递归初始化未初始化的view模板,模板文件静态化,可以直接访问
 * @param path
 */
function initView() {
    var responseTypes = {
        "css": "text/css",
        "gif": "image/gif",
        "html": "text/html",
        "ico": "image/x-icon",
        "jpeg": "image/jpeg",
        "jpg": "image/jpeg",
        "js": "text/javascript",
        "json": "application/json",
        "pdf": "application/pdf",
        "png": "image/png",
        "svg": "image/svg+xml",
        "swf": "application/x-shockwave-flash",
        "tiff": "image/tiff",
        "txt": "text/plain",
        "wav": "audio/x-wav",
        "wma": "audio/x-ms-wma",
        "wmv": "video/x-ms-wmv",
        "xml": "text/xml",
        "data": "application/octet-stream"
    };
    // 收集,已经添加的路由.   待会不添加已经添加的路由url
    function colleRouterUrl() {
        var mapUrl = {};
        for ( var i = 0; i < router.stack.length; i++ ) {
            var stack = router.stack[ i ];
            var arrayUrl = (stack.route.path + ",").split( "," );
            for ( var j = 0; j < arrayUrl.length; j++ ) {
                var url = arrayUrl[ j ];
                if ( url )  mapUrl[ url ] = true;
            }
        }
        return mapUrl;
    }

    var mapUrl = colleRouterUrl();
    // 配置路由
    function confiRouter( currentPath, routerPath ) {
        router.get( routerPath, function ( req, res, next ) {
            var ext = path.extname( routerPath );
            ext = ext ? ext.slice( 1 ) : 'unknown';

            // 咱们的html后缀是,所以html后缀用ejs模渲染页面
            if ( ext == "html" ) {
                res.render( routerPath.replace( /[\\\/]{0,1}(.+)\.html/, "$1" ) );
            } else {// 其他文件都用流处理了
                fs.readFile( currentPath, "binary", function ( err, file ) {
                    if ( err ) {
                        res.writeHead( 500, {
                            'Content-Type': 'text/plain'
                        } );
                        res.end( err );
                    } else {
                        res.writeHead( 200, {
                            'Content-Type': responseTypes[ ext ] || "text/plain"
                        } );
                        res.write( file, "binary" );
                        res.end();
                    }
                } );
            }
        } );
    }

    // 递归所有文件,配置路由
    function dgInitPath( viewDirPath, viewDirName ) {

        fs.readdirSync( viewDirPath ).forEach( function ( file ) {
            // 当前完整路径,用来递归文件夹
            var currentPath = viewDirPath + file;
            if ( !fs.lstatSync( currentPath ).isDirectory() ) {
                // 截取现对于views 目录的路径,, 方便等下用来路由映射
                var routerPath = currentPath.replace( new RegExp( ".*" + viewDirName + "(.+)[\\\/]{0,1}" ), '$1' ).replace( /\\/g, "/" );

                if ( !(routerPath in mapUrl) ) confiRouter( currentPath, routerPath );

            } else {
                dgInitPath( currentPath + "\\", viewDirName );
            }
        } );
    }


    function getDirName( dirPath ) {
        return dirPath.replace( /.*[\\\/]([^\\\/]+)[\\\/]{0,1}/, '$1' );
    }

    var viewDirPath = path.join( __dirname, '../../views/' );
    dgInitPath( viewDirPath, getDirName( viewDirPath ) );
}
initView();

module.exports = router;
