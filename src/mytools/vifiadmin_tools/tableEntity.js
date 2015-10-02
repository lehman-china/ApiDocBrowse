var mysql = require( '../../common/util/mysqlUtils' );
var fileUtils = require( '../../common/util/fileUtil' );

mysql.initDbInfo("vifiadmin","myvifi","192.168.1.212",3306,"ViFi");

// aop 注解
var isAopAnnotasion = false;
// spring mvc 传参注解
var isWebAnnotasion = true;
// var getPackage = "package net.eoutech.commons.entity;";
var getPackage = "package com.vifi.vrs.webmin.commons.entity;";
var entityName = "TbCDR";
var tabName = "tbCDR";


// sql 类型对象,和java对象类型映射表.
var typeMapping = {
    "252": "String",
    "253": "String",
    "3": "Integer",
    "8": "Integer",
    "1": "Integer",
    "12": "Date"
};
mysql.exec( `SELECT * FROM ${tabName} limit 0,1`, [], function ( err, rows, fields ) {
    if ( err ) throw err;

    // java 实体 属性
    var javaEntity = [
        getPackage,
        "import java.util.Date;"
    ];

    isWebAnnotasion && javaEntity.push( "import com.alibaba.fastjson.annotation.JSONField;\nimport org.springframework.format.annotation.DateTimeFormat;" );
    if ( isAopAnnotasion ) {
        javaEntity.push( "import javax.persistence.Id;\nimport javax.persistence.Column;" );
        javaEntity.push( `@javax.persistence.Table( name = "${tabName}" )` );
    }

    // entity class 
    javaEntity.push( `public class ${entityName} {` );

    var fieldInx = 0;
    for ( var field of fields ) {
        var type = typeMapping[ field.type ];
        if ( isAopAnnotasion ) {
            !(fieldInx++) && javaEntity.push( `@Id` );
            javaEntity.push( `@Column( name = "${field.name}" )` );
        }

        if ( isWebAnnotasion && type == "Date" ) {
            javaEntity.push( `@JSONField( format = "yyyy-MM-dd HH:mm:ss" )` );
            javaEntity.push( `@DateTimeFormat( pattern = "yyyy-MM-dd HH:mm:ss" )` );
        }
        javaEntity.push( `private ${type} ${field.name};\n` );

    }

    javaEntity.push( `\n\n\n\n}` );

    fileUtils.print( javaEntity.join( "\n" ) );


} );
