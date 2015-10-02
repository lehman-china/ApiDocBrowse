var mysql = require( '../../common/util/mysqlUtils' );
var dateUtils = require( '../../common/util/commonUtil' );
mysql.initDbInfo("vifiadmin","myvifi","192.168.1.212",3306,"ViFi");

// 递归插入user
function insertUser( i ) {
    i = i || 0;
    var NUMBER = 10000;
    var INDEX = 1326672;
    mysql.exec( `
       INSERT INTO ViFi.tbUser (keyUserID, idxPhoneNumber, idxAreaCode, password, language, roamAreaCode, roamTimeZone, idxDomain, displayNumber, accountState, appState, vifiState, idxViFiID, idxVPXID, idxVSWID, idxGoIPPortID, idxSimpPortID, idxSimCardID, userBalance, rewardBalance, credit, sipExpire, idxAgentID, lastAPPOnlineDate, lastAPPPublicIP, lastAPPDevInfo, lastAPPVer, lastViFiDate, lastViFiID, lastViFiPublicIP, remarks, mdfTm, mdfBy, crtTm, crtBy)
        VALUES ('2015092314304400000${i}', '861388888${i}', '86', '1234', 'zh_CN', '', '0', '', '', 'Y', '11', '0', '0', 'VNS.myvifi.com', '0', '0', '0', '0', '0', '100399270', '0', '3600', '0', '2015-09-25 14:36:57', '113.87.49.67', 'SM-A3009', '1.0.0', '2015-09-23 18:17:35', '', '', '', '2015-09-25 14:36:57', '8613866668888', '2015-09-23 10:15:25', '8613866668888');


          `, [], function ( err, rows, fields ) {
        if ( err ) throw err;
        if ( NUMBER > i++ ) {
            console.log( insertUser( i ), "insert ok!!!",i );
        }
    } );
    return i;
}
insertUser( 1 )

// 递归注册资费表
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


// 递归
function insertUser2( i ) {
    i = i || 0;
    var NUMBER = 9000;
    var INDEX = 11000;
    mysql.exec( `INSERT INTO ViFi.tbUser (keyUserID, idxPhoneNumber, countryCode, timezone, password, language, roamCountryCode, roamTimeZone, idxDomain, displayNumber, acctounState, appState, vifiState, idxViFiID, idxVPXID, idxVSWID, idxGoIPPortID, idxSimpPortID, idxSimCardID, userBalance, rewardBalance, credit, currency, idxAgentID, lastAPPOnlineDate, lastAPPPublicIP, lastAPPDevInfo, lastAPPVer, lastViFiDate, lastViFiID, lastViFiPublicIP, remarks, mdfTm, mdfBy, crtTm, crtBy)
    VALUES ('201508211713170001${INDEX + i}', '${INDEX + i}', '86', '8', '1234', 'chinese', '', '0', '', '', 'I', '0', '0', '0', 'VNS.myvifi.com', '0', '0', '0', '0', '100000', '49650', '0', 'CNY', '0', NOW(), '', '', '', NOW(), '', '', '', NOW(), 'model', NOW(), '18106575868');`, [], function ( err, rows, fields ) {
        if ( err ) throw err;
        if ( NUMBER > i++ ) {
            console.log( insertUser2( i ), "insert ok!!!",i );
        }
    } );
    return i;
}


// 递归注册资费表
function insertRoute( i ) {
    i = i || 0;
    var INDEX = 80;


    mysql.exec( `
     INSERT INTO 'ViFi'.'tbRoute' ('keyRouteId', 'srcNodeIds', 'protocol', 'callerId', 'srcNumber', 'srcDomain', 'dstNumber', 'dstDomain', 'destNodeIds', 'multiTrunk', 'remarks', 'mdfTm', 'mdfBy', 'crtTm', 'crtBy') VALUES ('${INDEX+i}', '1', 'sip', '*', '*', '*', '86', '*', '*', '1', 'lehman', '2015-09-23 16:54:00', 'lehman', '2015-09-24 16:54:04', 'lehman');
   
        
        `, [], function ( err, rows, fields ) {
        if ( err ) throw err;
        if ( NUMBER > i++ ) {
            console.log( insertRate( i ), "insert ok!!!",i );
        }
    } );
    return i;
}

