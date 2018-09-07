__author__ = 'Administrator'

import os

# 变量命名规范,例子: module_name, package_name, ClassName, method_name, ExceptionName, function_name, GLOBAL_VAR_NAME, instance_var_name, function_parameter_name, local_var_name.


class FileUtils:

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



    # 递归遍历目录以及子目录中的所有文件
    @staticmethod
    def loop_files(root_dir, files=[]):
        for filename in os.listdir(root_dir):
            pathname = os.path.join(root_dir, filename)
            if (os.path.isfile(pathname)):
                files.append(pathname)
            else:
                FileUtils.loop_files(pathname, files)
        return files