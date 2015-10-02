var mysql = require( '../../common/util/mysqlUtils' );
var fileUtils = require( '../../common/util/fileUtil' );


function generateInsertSql( tabName ) {

    var sql = "INSERT INTO `ViFi`.`tbCDR` (`keyCDRID`, `idxUserId`, `idxDeductUserId`, `cdrType`, `direction`, `idxRateId`, `caller`, `callee`, `StartTime`, `AnswerTime`, `StopTime`, `callDuration`, `dataTraffic`, `cost`, `bonus`, `idxAgentID`, `idxCallID`, `idxVPXID`, `idxTrunkID`, `idxVSWID`, `idxGoIPID`, `idxSimPID`, `idxSimCID`, `idxSMSGate`, `idxVAPPID`, `idxViFiID`, `ispID`, `countryCode`, `crtTm`, `crtBy`) VALUES ('3580', '10501', '10501', 'N', 'I', '0', '13511305217', '10501', '2015-08-20 11:17:27', '2015-08-27 09:25:29', '2015-08-27 09:25:39', '10', '0', '1', '1', '0', 'CID_144004062610501', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '2015-08-20 11:17:27', '10501');"
    mysql.exec( `SELECT * FROM ${tabName} limit 0,1`, [], function ( err, rows, fields ) {
        if ( err ) throw err;

        var fieldName = [],fieldValue = [];
        for ( var field of fields ) {
            fieldName.push( ` \`${field.name}\`` );
            fieldValue.push( ` \#{${field.name}}` );
        }
        var a = `INSERT INTO \`${tabName}\` (` + fieldName.join(",")+
            `) VALUES (` + fieldValue.join(",")+")"
        fileUtils.print(a );
    } );

}

generateInsertSql( "tbCDR" );