__author__ = 'Administrator'

import logging
import os


# 变量命名规范,例子: module_name, package_name, ClassName, method_name, ExceptionName, function_name, GLOBAL_VAR_NAME, instance_var_name, function_parameter_name, local_var_name.

"""
logging.getLogger()
创建一个日志对象
logging.FileHandler(logfile)
创建一个日志处理器，即日志会怎样存放
logging.Formatter()
日志格式化
setFormatter()
将一个格式化信息应用到刚才创建的日志处理器上
addHandler()
将一个日志处理器添加到最开始创建的日志对象上
setLevel()
设置日志级别
"""
class LogUtils:




    @staticmethod
    def logTest():
        logger = logging.getLogger()
        handler = logging.FileHandler(os.path.join(os.getcwd(), "test.log"))
        formater = logging.Formatter("%(asctime)s %(levelname)s %(message)s")
        handler.setFormatter(formater)
        logger.addHandler(handler)
        logger.setLevel(logging.NOTSET)
        logger.debug("测试一下log功能")
