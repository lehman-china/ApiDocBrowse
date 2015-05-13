proPath =  "D:/Users/Desktop/Project/python/ApiDocBrowse"
staticPath =  "D:/Users/Desktop/Project/python/ApiDocBrowse/views/include/"
templatePath =  "D:/Users/Desktop/Project/python/ApiDocBrowse/views/templatePath/"

import os

from bottle import debug, run

from src import app


debug(True)
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    run(app, reloader=True, host='127.0.0.1', port=port)
