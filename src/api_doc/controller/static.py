# -*- coding: utf-8 -*-
import os

from lib.bottle import static_file

from src import app

staticPath =  "D:/Users/Desktop/Project/python/ApiDocBrowse/views/include/"


@app.route('/include/<filename:path>')
def static(filename):
    print(filename)
    return static_file(filename, root=staticPath)

