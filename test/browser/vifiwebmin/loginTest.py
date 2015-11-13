import unittest

from selenium.webdriver.support.wait import WebDriverWait

__author__ = 'Administrator'
import time
# 导入 WebDriverWait 包
from test.browser.commons.selenium_base import *

driver = get_chrome_driver()


class LogTest(unittest.TestCase):
    def test_log(self):
        driver.get("http://192.168.1.96:8080/vifiwebmin/login")

        driver.find_element_by_id("username").send_keys("_EUROOT")
        driver.find_element_by_id("password").send_keys("euadmin")
        driver.find_element_by_name("submit").click()

        self.assertTrue(str(driver.current_url).__contains__("index"), "登陆成功后需要进入index页面")
        print(driver.current_url)

    def test_user_query(self):
        driver.get("http://192.168.1.96:8080/vifiwebmin/index#/vifi/user")
        # WebDriverWait()方法使用
        element = WebDriverWait(driver, 10).until(
            lambda driver: driver.find_element_by_css_selector(".viewcfg-dropdown > a"))
        time.sleep(0.5)
        element.click()

        time.sleep(0.5)
        element.click()

        driver.implicitly_wait(3)
        driver.find_element_by_css_selector(".navbar-right span a").click()
        time.sleep(0.5)
        driver.find_element_by_css_selector('[ng-model="form.keyword"]').send_keys("*13266720440*")
        # 添加智能等待
        driver.implicitly_wait(30)
        driver.find_element_by_css_selector('[ng-click="search()"]').click()

    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        time.sleep(5)
        driver.quit()
