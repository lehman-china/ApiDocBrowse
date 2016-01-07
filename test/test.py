import os
import re
import unittest

import execjs

from src.commons.utils.mysql_utils import init_db, query
from src.mytools.commons.utils.common_utils import CommonUtils

init_db('192.168.1.215', 'root', 'myvifi', 'UUWIFI')


class TestSequenceFunctions(unittest.TestCase):
    @staticmethod
    @query(sql="desc tbSimPPort")
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
        print(0 or 123)

    def test_dict_extend(self):
        p_a = {"name": "lehman"}
        p_b = {"name": "lehman222", "age": 22}
        p_c = {"sex": "男"}

        print("**********************1")
        print(p_a)
        print("**********************2")
        print(p_b)
        print("**********************3")

        def tt(**kwargs):
            print(kwargs)

        tt(age=25)
        print("**********************4")
        print(dict(p_a, **dict(p_b, **p_c)))

    def test_pyv8(self):
        vars = execjs.eval("""
                    "123".split("2")
                """)
        print(vars)


    def test_create_js_config_map(self):
        path = "D:/Users/Desktop/Projects/java/vifi_trunk/vifiwebmin/WebContent/page/"
        cfg_dict = {}
        for dirpath, dirnames, filenames in os.walk(path):
            if  not re.search("app_module|commons",dirpath):
                for filename in filter(lambda fn: re.search("\.js$", fn), filenames):
                    tb_name = CommonUtils.reg_sub_ex("^(.)(.*?)\.js", lambda p, c: "tb" + c(1).upper() + c(2), filename)
                    value = (dirpath + "/" + filename).replace("\\", "/").replace("D:/Users/Desktop/Projects/java/vifi_trunk/vifiwebmin/", "")
                    cfg_dict[tb_name] = value

        print(cfg_dict)

    def __del__(self):
        print("__del__")


if __name__ == '__main__':
    unittest.main()
