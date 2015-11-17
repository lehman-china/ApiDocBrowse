import unittest

import re

from lib.bottle import template
from src.commons.utils.mysql_utils import init_db, query
from src.mytools.commons.utils.common_utils import CommonUtils

init_db('192.168.1.215', 'root', 'myvifi', 'UUWIFI')

class TestSequenceFunctions(unittest.TestCase):

    @staticmethod
    @query( sql="desc tbSimPPort" )
    def query_tb_desc(datas):
         print(datas)

    def tearDown(self):
        super().tearDown()
        print("tearDown")

    def test_sql(self):
        TestSequenceFunctions.query_tb_desc()

    def test_choice(self):
        print("test_choice222")


    def test_sample(self):
        print("test_sample333")


    def test_str_find_test(self):
        print("http://192.168.1.96:8080/vifiwebmin/login")

    def test_reg(self):
        res = re.search("\((.*?)\)", 'varchar(64)')
        print(res)
        print(res.group(1))
        res = re.match('hell', 'hello world!').groups()
        print( 0 or 123 )

    def __del__(self):
        print("__del__")

if __name__ == '__main__':
    unittest.main()
