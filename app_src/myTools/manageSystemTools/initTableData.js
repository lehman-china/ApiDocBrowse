var mysql = require( '../../common/util/mysqlUtils' );
var dateUtils = require( '../../common/util/dateUtils' );


// 递归
function insertUser( i ) {
    i = i || 0;
    var NUMBER = 9000;
    var INDEX = 11000;
    mysql.exec( `INSERT INTO ViFi.tbUser (keyUserID, idxPhoneNumber, countryCode, timezone, password, language, roamCountryCode, roamTimeZone, idxDomain, displayNumber, acctounState, appState, vifiState, idxViFiID, idxVPXID, idxVSWID, idxGoIPPortID, idxSimpPortID, idxSimCardID, userBalance, rewardBalance, credit, currency, idxAgentID, lastAPPOnlineDate, lastAPPPublicIP, lastAPPDevInfo, lastAPPVer, lastViFiDate, lastViFiID, lastViFiPublicIP, remarks, mdfTm, mdfBy, crtTm, crtBy)
    VALUES ('201508211713170001${INDEX + i}', '${INDEX + i}', '86', '8', '1234', 'chinese', '', '0', '', '', 'I', '0', '0', '0', 'VNS.myvifi.com', '0', '0', '0', '0', '100000', '49650', '0', 'CNY', '0', NOW(), '', '', '', NOW(), '', '', '', NOW(), 'model', NOW(), '18106575868');`, [], function ( err, rows, fields ) {
        if ( err ) throw err;
        if ( NUMBER > i++ ) {
            console.log( insertUser( i ), "insert ok!!!",i );
        }
    } );
    return i;
}


// 递归
function insertRate( i ) {
    i = i || 0;
    var NUMBER = 5000;
    var INDEX = 11000;
    var INDEX_ARR = [300000,50000,6000,100];

    mysql.exec( `INSERT INTO tbRate (keyRateID, rateMode, direction, idxCallPrefix, countryCode, country, priceCallOnline, priceCallOffline, priceCallbackOff, priceCallGoIP, priceCallbackGoIP, priceSMS, priceNET, maxDayDuration, maxMonDuration, maxDayTraffic, maxMonTraffic, maxDayNumber, maxMonNumber, remarks, mdfTm, mdfBy, crtTm, crtBy)
    VALUES ('200${INDEX + i}', 'S', '0', '${INDEX_ARR[i%4]+i}', '86', 'CN', '50', '30', '20', '0', '0', '0', '0', '0', '0', '0', NULL, '0', '0', '0', NOW(), '', NOW(), '');`, [], function ( err, rows, fields ) {
        if ( err ) throw err;
        if ( NUMBER > i++ ) {
            console.log( insertRate( i ), "insert ok!!!",i );
        }
    } );
    return i;
}
insertRate( 1 );