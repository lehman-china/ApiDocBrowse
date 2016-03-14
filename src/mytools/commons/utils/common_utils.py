__author__ = 'Administrator'

import re

import pyperclip


# 变量命名规范,例子: module_name, package_name, ClassName, method_name, ExceptionName, function_name, GLOBAL_VAR_NAME, instance_var_name, function_parameter_name, local_var_name.


class CommonUtils:
    # 正则的替换扩展,
    # callback:回调.
    #   param = re.sub的param
    #   child_ma =子匹配,child_ma(0)为全匹配.
    # 例: res = CommonUtils.reg_sub_ex('([A-Z\-]*?):',lambda param,child_ma:child_ma(1).lower( ),string)
    @staticmethod
    def reg_sub_ex(reg, callback, string):
        def reg_cb(param):
            # 取得子匹配
            def child_ma(inx):
                return param.string[param.regs[inx][0]:param.regs[inx][1]]
            # 替换的内容
            return callback(param, child_ma)

        return re.sub(reg, reg_cb, string)

    @staticmethod
    def clip(string):
        pyperclip.copy(string)
        print(string)
        print("已复制到,粘贴板~")

    # 增,减,字符串每行首空格数量
    # num : {int}  增减的数量,正数加,负数减
    @staticmethod
    def line_space_add_sub(string, num):
        if num < 0:
            return CommonUtils.reg_sub_ex("\n {%d}" % (num * -1), lambda p, c: "\n", string)
        else:
            return CommonUtils.reg_sub_ex("\n", lambda p, c: "\n" + (" " * num), string)

    @staticmethod
    def write_text(f_path, text, mode="w"):
        file = open(f_path, mode=mode, encoding="utf8")
        file.write(text)
        file.close()

    @staticmethod
    def read_text(f_path):
        file = open(f_path, encoding="utf8")
        text = file.read()
        file.close()
        return text
