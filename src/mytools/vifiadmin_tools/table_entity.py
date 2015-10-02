from src.commons.utils.mysql_utils import init_db,query
init_db( '192.168.1.212', 'vifiadmin', 'myvifi', 'ViFi' )






@query()
def queryUser( cur ):
    cur.execute( "SELECT * FROM tbUser LIMIT 0,100" )
    for user in cur.fetchall( ):
        print( user )

    return 0


queryUser( )

