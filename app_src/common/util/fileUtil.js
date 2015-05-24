var fs = require( "fs" );



function readDir( dirPath ) {
    var files = [];
    fs.readdirSync( dirPath ).forEach( function ( file ) {
        files.push( file );
    } );
    return files;
}


function getDirName( dirPath ) {
    return dirPath.replace( /.*[\\\/]([^\\\/]+)[\\\/]{0,1}/, '$1' );
}


function writeFile( file, content ) {
    // appendFile，
    // 如果文件不存在，会自动创建新文件
    // 如果用writeFile，那么会删除旧文件，直接写新文件
    fs.writeFile( file, content, function ( err ) {
        if ( err )
            console.log( "fail " + err );
        else
            console.log( "写入文件ok" + file );
    } );
}

// 是否是文件夹
function isDir( currentPath ){
    return !fs.lstatSync( currentPath ).isDirectory();
}


module.exports = {
    readDir : readDir,
    getDirName : getDirName,
    writeFile : writeFile,
    isDir : isDir
};