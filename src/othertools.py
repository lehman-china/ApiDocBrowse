import os
from src.mytools.commons.langconv.langconv import *


# 转换简体到繁体
line = Converter('zh-hant').convert('中文(繁)')


print(line)