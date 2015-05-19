# -*- coding: utf-8 -*-
import glob
import os

from lib.bottle import static_file

from src import app

staticPath =  os.path.dirname(__file__) + "/../../../views/"

@app.route('/static/<filename:path>')
def static(filename):
    print(filename)
    return static_file(filename, root=staticPath)

