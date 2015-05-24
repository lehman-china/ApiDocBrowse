var fs = require( "fs" );

function keyToUp( key ) {
    return key.replace( /[_-]./g, function ( str ) {
        return str.toLocaleUpperCase().replace( /[_-]/g, '' );
    } );
}
//keyToUp( "order_user_id" );

// html文件 转express控制器js文件
function htmlCreateCtrl( dirPath ) {
    fs.readdirSync( dirPath ).forEach( function ( file ) {
        var val = keyToUp( file.toString() )
        var newPath = "D:/web/" + val.replace( ".html", "Ctrl.js" );

        var strVar = "var router = require( 'express' ).Router();\n";
        strVar += "router.get( '/" + file + "', function ( req, res, next ) {\n";
        strVar += "    res.render( '" + file.toString().replace( ".html", "" ) + "');\n";
        strVar += "} );\n";
        strVar += "";
        strVar += "module.exports = router;\n";

        console.log( newPath );
        writeFile( newPath, strVar );
    } );


    function writeFile( file, content ) {
        // appendFile，如果文件不存在，会自动创建新文件
        // appendFile,如果用writeFile，那么会删除旧文件，直接写新文件
        fs.writeFile( file, content, function ( err ) {
            if ( err )
                console.log( "fail " + err );
            else
                console.log( "写入文件ok" + file );
        } );
    }

    function keyToUp( key ) {
        var reg = new RegExp( "_.", "g" );
        return key.replace( reg, function ( str ) {
            return str.toLocaleUpperCase().replace( /_/g, '' );
        } );
    }
}

function readJSONFile( path ) {
    var str = fs.readFileSync( path, "utf-8" );
    return JSON.parse( str );
}


var http = require( "http" );
var url = require( "url" );
var querystring = require( "querystring" )

//function httpRequest( param, callBack ) {
//    var postData = querystring.stringify( param.data );
//    var options = url.parse( param.url );
//    options.method = param.method;
//
//    options.headers = {
//        'Content-Type': param.contentType + ';charset=UTF-8',
//        'Content-Length': postData.length,
//        'Cookie': 'JSESSIONID=76d7d77a-26c4-490a-b091-1bb0c65344d2; TOKEN=00014d28e4f0b902'
//    };
//
//
//    var req = http.request( options, function ( res ) {
//        var result = {};
//        result.status = res.statusCode;
//        result.headers = res.headers;
//        res.setEncoding( 'utf8' );
//        res.on( 'data', function ( chunk ) {
//            result.content = chunk;
//            callBack( result );
//        } );
//    } );
//
//    req.on( 'error', function ( e ) {
//        callBack( e );
//    } );
//
//// write data to request body
//    req.write( postData );
//    req.end();
//}

function httpRequest( param, callBack ) {
    var postData = "";
    var isJSONContent = /urlencoded|json/.test( param.headers["Content-Type"] );
    // 如果POST JSON类型
    if ( param.method == "POST" && isJSONContent ) {
        postData = querystring.stringify( param.param );
    } else {
        param.url = param.url + (/\?/.test( param.url ) ? "&" : "?") + querystring.stringify( param.param );

        // 如果 POST 普通参数类型
        //if ( param.method == "POST" && !isJSONContent ) {
        //    postData = querystring.stringify( param.param );
        //} else {  // GET 类型  参数放在url里
        //    param.url = param.url + (/\?/.test( param.url ) ? "&" : "?") + querystring.stringify( param.param );
        //}
    }
    var options = url.parse( param.url );
    options.method = param.method;

    options.headers = param.headers;

    options.headers[ 'Content-Length' ] = postData.length;

    var req = http.request( options, function ( res ) {
        var result = {};
        result.status = res.statusCode;
        result.headers = res.headers;
        result.content = "";
        res.setEncoding( 'utf8' );
        res.on( 'data', function ( chunk ) {
            result.content += chunk;
        } );
        res.on( 'end', function () {
            callBack( result );
        } );
    } );

    req.on( 'error', function ( e ) {
        callBack( e );
    } );


    req.end( postData );
}


module.exports = {
    readJSONFile: readJSONFile,
    httpRequest: httpRequest
};

