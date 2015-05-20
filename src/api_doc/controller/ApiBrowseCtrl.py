import glob
import os
import re
import urllib
from lib.bottle import template, request
from src import app

import json
import http

@app.route('/', method='GET')
def index():
    return template('api_doc_browse/home.html')

@app.route('/api.html', method='GET')
def intoApi():
    dataFiles = glob.glob(os.path.dirname(__file__) + "/../service/api_doc_data/module/*.json")
    jsons = []
    for dataFile in dataFiles:
        file = open(dataFile,encoding='utf-8')
        jsons.append(file.read() )
        file.close()
    return template('api_doc_browse/api.html',{"allApiJSON":"["+ (','.join(jsons)) +"]"})

@app.route('/testApi2.ajax', method='POST')
def testApiPOST():
    param = json.loads( request.params.param )
    options = {
        "url": param["url"],
        "method": param["type"],
        "headers": param["headers"],
        "param": param["param"]
    }
    httpRequest( options )

    return "/testApi.ajax OK " + json.dumps( options )

@app.route('/testApiGet.ajax', method='GET')
def testApiGET():
    return "/testApiGet.ajax" + request.query['name']




def post(url ,data ):
    data = urllib.parse.urlencode(data).encode('utf-8')
    request = urllib.request.Request(url,method='POST')
    request.add_header("Content-Type","application/x-www-form-urlencoded;charset=utf-8")
    f = urllib.request.urlopen(request,data)
    return f.read().decode('utf-8')



def httpRequest( param ):
    postData = ""
    isJson = re.compile(r'urlencoded|json').match( param["headers"]["Content-Type"] )
    if ( param["method"] == "POST" and isJson != None ):
        postData = urllib.parse.urlencode( param["param"] ).encode('utf-8')
    else:
        uu = (re.compile(r'\?').match( param["url"] ) != None) and "&" or "?"
        # param["url"] = param["url"] + uu  + urllib.parse.urlencode( param["param"] ).encode('utf-8')


    post(param.url ,postData )

