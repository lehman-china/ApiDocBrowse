__author__ = '雷建军 2015-5-23 18:54:10'

import os
# 获取当前文件所在路径
thePath = os.path.dirname( __file__  )

#截取字符串至项目名：
PROJECT_PATH = thePath[:thePath.__len__() - 11 ]
print( PROJECT_PATH )
