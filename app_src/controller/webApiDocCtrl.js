var router = require( 'express' ).Router();
var path = require( 'path' );
var http = require( "http" );
var fs = require( "fs" );

var commonConst = require( "../common/commonConst" );
var commonUtil = require( "../common/util/commonUtil" );

router.get( [ "/", "index.html","home.html" ], function ( req, res, next ) {
    res.render('api_doc_browse/home', {name:"lehman113"});
} );


// API 详情
router.get( "/api_doc/api.html", function ( req, res, next ) {
    // 读取所有 API 文档 数据
    var dirPath = commonConst.SERVICE_DIR_PATH + "/api_doc_data/module";
    var allApi = [];
    fs.readdirSync( dirPath ).forEach( function ( file ) {
        var apiCatalogJSON = fs.readFileSync( dirPath +"/" + file, "utf-8" );
        allApi.push( apiCatalogJSON );
    } );
    var allApiJSON = "["+allApi.join(",") + "]"

    res.render( "api_doc_browse/api", { allApiJSON:allApiJSON } );
} );

//文档中心
router.get( "/api_doc/api_doc_center.html", function ( req, res, next ) {
    res.render( "api_doc_browse/api_doc_center" );
} );



router.post( [ "/testApi.ajax" ], function ( req, res, next ) {

    var param = JSON.parse( req.body.param );
    var options = {
        url: param.url,
        method: param.type,
        headers: param.headers,
        param: param.param
    };
    commonUtil.httpRequest( options, function ( result ) {
        res.json( result );
    } );
} );


module.exports = router;
