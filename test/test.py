import unittest


class TestSequenceFunctions(unittest.TestCase):



    def tearDown(self):
        super().tearDown()
        print("tearDown")



    def test_choice(self):
        print("test_choice222")


    def test_sample(self):
        print("test_sample333")


    def test_str_find_test(self):
        print("http://192.168.1.96:8080/vifiwebmin/login")


    def __del__(self):
        print("__del__")

if __name__ == '__main__':
    unittest.main()
