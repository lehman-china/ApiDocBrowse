var mysql = require('mysql');

//填写数据库连接信息，可查询数据库详情页
var username = 'vifiadmin';
var password = 'myvifi';
var db_host = '192.168.1.212';
var db_port = 3306;
var db_name = 'ViFi';

var option = {
    host: db_host,
    port: db_port,
    user: username,
    password: password,
    database: db_name
};

function _exec(sqls,values,after) {
    var client = mysql.createConnection(option);

    client.connect(function(err){
        if (err) {
            throw err;
        }

        client.query(sqls || '', values || [],function(err, rows, fields){
            after(err, rows, fields);
        });
        client.end();

    });
    client.on('error',function(err) {
        if (err.errno != 'ECONNRESET') {
            after("err01",false);
            throw err;
        } else {
            after("err02",false);
        }
    });
};




function _execTran(exec) {
    var client = mysql.createConnection(option);

    client.connect(function(err){
        if (err) {
            throw err;
        }


        client.beginTransaction(function(err) {
            if (err) { throw err; }

            client.query('INSERT INTO log SET data=?', log, function(err, result) {
                if (err) {
                    client.rollback(function() {
                        throw err;
                    });
                }
                client.commit(function(err) {
                    if (err) {
                        connection.rollback(function() {
                            throw err;
                        });
                    }
                });
            });


        });



        client.end();

    });
    client.on('error',function(err) {
        if (err.errno != 'ECONNRESET') {
            after("err01",false);
            throw err;
        } else {
            after("err02",false);
        }
    });
};


exports.exec = _exec;