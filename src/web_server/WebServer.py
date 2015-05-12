import os
import sys
from bottle import *
proPath =  "D:/Users/Desktop/Project/python/ApiDocBrowse"




@route('/include/<filename:path>')
def send_static(filename):
    print(filename)
    return static_file(filename, root=proPath+'/views/include/')


# @route('/<filename:path>')
# def send_static(filename):
#     return static_file(filename, root=proPath+'/views/include/')


@route('/hello/:name')
def hello(name):
    return template(proPath + '/views/api.html', username=name)



run(host='localhost', port=5000, debug=True)