var path = require( 'path' );
var sqlite3 = require( 'sqlite3' ).verbose();
var dbPath = path.join( __dirname, '../../../app_db/app.db' );


var db = new sqlite3.Database( dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, function ( err ) {
    if ( err ) {
        console.log( '不能打开数据库' + dbPath );
        console.log( '不能打开数据库,请关闭其他项目:' + err );
    }
} );
console.log( "打开数据库:" + dbPath );

exports.query = function ( sql, callback ) {
    var res = [];
    try {
        db.all( sql, function ( err, rows ) {
            rows.forEach( function ( row ) {
                res.push( row );
            } );
            callback( res );
        } );
    } catch ( e ) {
        callback( e );
    }
};
//例子 exports.execute("INSERT INTO notes (ts, author, note) VALUES (?, ?, ?);",[ new Date(), author, note ],function(){})
exports.execute = function ( sql, params, callback ) {
    try {
        db.run( sql, params, function ( err ) {
            if ( err ) {
                console.log( '数据库执行错误execute:' + err );
                callback( err );
            } else {
                callback( null );
            }
        } );
    } catch ( e ) {
        callback( e );
    }
};
// 异常...
//process.on('uncaughtException', function (err) {
//    console.error(err);
//});