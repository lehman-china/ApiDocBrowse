# -*- coding: utf-8 -*-

import xlrd

from src.commons.utils.mysql_utils import init_db, query
from src.mytools.commons.utils.common_utils import CommonUtils

init_db('192.168.1.201', 'dev', 'dev', 'job')



def add_gift( content ):
    @query(qry_type="update")
    def query_put(cur):
        price = float(content["价格"][0:-1]) * 1000
        sql = """
       INSERT INTO `job`.`t_product_gift` ( `product_gift_id`,`price`, `name`, `pic`, `introduction`, `allocated_stock`, `categorys`, `is_marketable`, `produce_diamond_rate`, `sort`, `produce_point`, `create_time`, `timestamp`)
       VALUES ('%d','%d', '%s', 'http://img.froup.net/medal/wlzx.jpg', '%s', '0', '0', '1', '0.55;0.6', '0', '%d', '2016-03-14 15:44:11', '2016-03-17 16:37:11');
        """ % (content["id"],price ,content["礼物名称"],content["图片描述"],price)
        cur.execute(sql)
        print(sql)
    query_put()


def main():
    tables = CommonUtils.excel_table_byindex("D:/Users/Documents/Jingoal/lehman@8726568/RecvFiles/liwu.xls", 0, 2)
    inx = 1
    for row in tables:
        print(row)
        row["id"] = inx
        inx = inx +1
        add_gift( row )



if __name__ == "__main__":
    main()
