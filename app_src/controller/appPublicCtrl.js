var router = require( 'express' ).Router();
//var baseDAO = require( "../common/dao/BaseDAO" );
////查询sql
//router.post( "/query.ajax", function ( req, res, next ) {
//    var sql = req.body.sql;
//    baseDAO.query( sql, function ( result ) {
//            res.json( result );
//        }
//    )
//} );
//
////执行sql
//router.post( "/execute.ajax", function ( req, res, next ) {
//    var sql = req.body.sql;
//    baseDAO.execute( sql, [], function ( result ) {
//            res.json( { state: result || "SUCCESS" } );
//        }
//    )
//} );
//
////application操作
//router.post( "/application.ajax", function ( req, res, next ) {
//    // 操作application
//    for ( var key in req.body ) {
//        req.session.application[ key ] = JSON.parse( req.body[ key ] );
//    }
//    res.json( req.session.application );
//} );
//
////session操作
//router.post( "/session.ajax", function ( req, res, next ) {
//    // 操作session
//    for ( var key in req.body ) {
//        req.session[ key ] = JSON.parse( req.body[ key ] );
//    }
//    res.json( req.session );
//} );




module.exports = router;
