# -*- coding: utf-8 -*-
import time
__author__ = 'Administrator'
import sqlite3

from src.commons.constants.COMMON import PROJECT_PATH
class BaseDao(object):
    DB_PATH = PROJECT_PATH + 'web_server/sqlite3_db/app.db'
    conn = None
    def __init__(self):
        print( "打开数据库连接:" +  time.strftime('%Y-%m-%d %H:%M:%S  ') + self.DB_PATH  )
        self.conn = sqlite3.connect( self.DB_PATH )
    #查询语句 ,
    def query(self,sql,param = {}):
        cursor = self.conn.cursor()
        # 执行查询语句:
        cursor.execute( sql ,param)
        # 获得查询结果集:
        result = cursor.fetchall()
        # 结果dict放入 list
        resultArray = []
        for row in result:
            rowMap = {}
            for i in range(row.__len__() ):
                rowMap[ cursor.description[i][0] ] = row[i]
            resultArray.append( rowMap )
        cursor.close()
        return resultArray

    #执行语句 ,sql
    def execute(self,sql,param = {}):
        cursor = self.conn.cursor()
        cursor.execute( sql ,param)

        rowcount = cursor.rowcount
        self.conn.commit()
        cursor.close()
        return rowcount

    def __del__(self):
        print( "关闭数据库连接:" +  time.strftime('%Y-%m-%d %H:%M:%S  ')+self.DB_PATH  )
        self.conn.close()


