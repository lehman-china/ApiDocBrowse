import unittest

from src.commons.utils.mysql_utils import init_db

init_db('192.168.1.212', 'vifiadmin', 'myvifi', 'ViFi')


def ip_country_data():
    print(111)
    file = open("/log/qqwry.txt")
    line = file.readline()
    line = file.readline()

    file_w = open("/log/qqwry.sql", "w")

    inx = 0

    while 1:
        line = file.readline()
        params = line.split("@")
        param_len = params.__len__()
        if param_len < 2 or not line:
            return
        startIP = params[0]
        endIP = params[1]
        country = params[2].replace("'", "\\'") if param_len > 2 else ""
        operators = params[3][0:-1].replace("'", "\\'") if param_len > 3 else ""

        if inx % 1000 == 0:
            p_sql = "delete from tbIPAddress" if inx == 0 else ""
            sql = p_sql + ";\nINSERT INTO `ViFi`.`tbIPAddress` (`startIP`, `endIP`, `country`, `operators`) VALUES ( %s, %s, '%s', '%s')" % (startIP, endIP, country, operators)
        else:
            sql = ",( %s, %s, '%s', '%s')" % (startIP, endIP, country, operators)

        if inx % 30 == 0:
            sql += "\n"
            print(inx)

        file_w.write(sql)
        inx += 1


class TestSequenceFunctions(unittest.TestCase):
    def test_ip_country_data(self):
        text_sql = ip_country_data()
        print(text_sql)

    def test_sample(self):
        print("test_sample333")

    def test_str_find_test(self):
        print("http://192.168.1.96:8080/vifiwebmin/login")

    def __del__(self):
        print("__del__")


if __name__ == '__main__':
    unittest.main()
