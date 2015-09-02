function testMap() {
    var beginTime = new Date().getTime();
    var map = new Map();
    map.set( "0", 0 );
    map.set( "1", 1 );
    map.set( "2", 2 );
    map.set( "3", 3 );
    map.set( "4", 4 );
    map.set( "5", 5 );
    map.set( "6", 6 );
    map.set( "7", 7 );
    map.set( "8", 8 );
    map.set( "9", 9 );

    var number = 0;
    for ( var i = 0; i < 10000000; i++ ) {
        number += map.get( (i % 10).toString() );
    }
    console.log( new Date().getTime() - beginTime );
    console.log( number ,map.size);
    console.log( JSON.stringify(map) );
}

function testObj() {
    var beginTime = new Date().getTime();
    var map = {};
    map[ "0" ] = 0;
    map[ "1" ] = 1;
    map[ "2" ] = 2;
    map[ "3" ] = 3;
    map[ "4" ] = 4;
    map[ "5" ] = 5;
    map[ "6" ] = 6;
    map[ "7" ] = 7;
    map[ "8" ] = 8;
    map[ "9" ] = 9;

    var number = 0;
    for ( var i = 0; i < 10000000; i++ ) {
        number += map[ (i % 10).toString() ];
    }
    console.log( new Date().getTime() - beginTime );
    console.log( number );
}
testMap();
testObj();