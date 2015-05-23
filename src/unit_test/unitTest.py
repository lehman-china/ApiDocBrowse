import src.common.CommonConst

from src.common.dao.BaseDao import *

dao = BaseDao( )
count = dao.execute( "delete from user" )


sqls = [ "insert into user(name) values('用户"+ str(i) +"')" for i in range( 1, 10 )]
for sql in sqls:
    dao.execute( sql )

test = dao.query( "select * from user" )

print( count )
print( test )



