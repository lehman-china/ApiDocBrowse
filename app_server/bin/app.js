var express = require( 'express' );
var path = require( 'path' );
var fs = require( "fs" );
var favicon = require( 'serve-favicon' );
var logger = require( 'morgan' );

var cookieParser = require( 'cookie-parser' ); //如果要使用cookie，需要显式包含这个模块
var session = require( 'express-session' ); //如果要使用session，需要单独包含这个模块
// 路由 post 传递参数时要用到 . req.body.name 来接收参数
var bodyParser = require( 'body-parser' );

var app = express();
var swig = require( 'swig' );
// view engine setup
//设置模板目录
app.set( 'views', path.join( __dirname, '../../views' ) );
//设置模板引擎
app.set( 'view engine', 'html' );
//设置引擎后缀.  index.html 中的内容可以是 模板 代码
app.engine( '.html', swig.renderFile );
// 模板的一些默认设置
swig.setDefaults({
    cache: false,
    autoescape: false,//输出不转义为html
    varControls: ['${{', '}}']
});


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use( logger( 'dev' ) );
// bodyParser :路由 post 传递参数时要用到 . req.body.name 来接收参数
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: false } ) );
// 设置 Cookie 和 session (内存session)
app.use( cookieParser( 'likeshan' ) );
app.use( session( {
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
} ) );

var application = {};// 模拟 application

//************************************************
var projectPath = path.join( __dirname, "../../" );
// 拦截器(拦截器需在路由前),session 放入所有页面,让ejs 直接访问session
app.use( function ( req, res, next ) {
    // 项目的路径
    res.locals.path = projectPath;

    res.locals.session = req.session;
    req.session.application = application;
    res.locals.application = application;

    next();
} );


// 配置所有的一级路由
var ctrlsPath = path.join( __dirname, '../../app_src/controller/' );
fs.readdirSync( ctrlsPath ).forEach( function ( file ) {
    var ctrl = ctrlsPath + file.toString().replace( ".js", "" );
    console.log( "载入控制器:" + ctrl );
    app.use( '/', require( ctrl ) );
} );


//404页面 catch 404 and forward to error handler
app.use( function ( req, res, next ) {
    var err = new Error( 'Not Found' );
    err.status = 404;
    next( err );
} );

//错误页面 error handlers

// development error handler
// will print stacktrace
if ( app.get( 'env' ) === 'development' ) {
    app.use( function ( err, req, res, next ) {
        res.status( err.status || 500 );
        res.render( 'error', {
            message: err.message,
            error: err
        } );
    } );
}

// production error handler
// no stacktraces leaked to user
app.use( function ( err, req, res, next ) {
    res.status( err.status || 500 );
    res.render( 'error', {
        message: err.message,
        error: {}
    } );
} );


module.exports = app;
