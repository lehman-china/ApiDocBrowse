import pymysql

_db_cfg = {
    "host": None,
    "port": 3306,
    "user": None,
    "passwd": None,
    "db": None
}


# mysql 查询装饰器, qry_type 查询类型默认查询类型
# 参数sql 有值的话,返回结果集,否则返回cursor 自己操作去!
def query( qry_type = "query",sql = None):
    def _query( execute ):
        def __query():
            conn = pymysql.connect( host = _db_cfg["host"], port = _db_cfg["port"], user = _db_cfg["user"],
                                    passwd = _db_cfg["passwd"], db = _db_cfg["db"] )
            cur = conn.cursor( pymysql.cursors.DictCursor ) # 设置结果集返回 dict 类型
            if sql :
                cur.execute( sql )
                execute( cur.fetchall() )
            else:
                execute( cur )

            print( "%s sql: %s" % (qry_type,cur._executed) )
            cur.close( )
            conn.close( )
        return __query

    return _query


def init_db( host, user, passwd, db, port = 3306 ):
    _db_cfg["host"] = host
    _db_cfg["port"] = port
    _db_cfg["user"] = user
    _db_cfg["passwd"] = passwd
    _db_cfg["db"] = db



