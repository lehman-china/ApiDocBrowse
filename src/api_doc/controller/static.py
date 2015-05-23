# -*- coding: utf-8 -*-

import os

from lib.bottle import static_file

from src import app
from src.common.CommonConst import PROJECT_PATH

staticPath =  PROJECT_PATH + "views"

@app.route('/<filename:path>')
def static(filename):
    print("静态文件:"+filename)
    return static_file(filename, root=staticPath)

