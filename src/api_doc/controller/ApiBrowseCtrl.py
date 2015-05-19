import glob
import os
from lib.bottle import template, request
from src import app

import json
import http



@app.route('/', method='GET')
def index():
    dataFiles = glob.glob(os.path.dirname(__file__) + "/../service/data/*.json")
    jsons = []
    for dataFile in dataFiles:
        file = open(dataFile,encoding='utf-8')
        jsons.append(file.read() )
        file.close()
    return template('api_doc_browse/api.html',{"datas":"["+ (','.join(jsons)) +"]"})

@app.route('/testApi.ajax', method='POST')
def testApiPOST():
    return "/testApi.ajax OK " + request.params.name

@app.route('/testApiGet.ajax', method='GET')
def testApiGET():
    return "/testApiGet.ajax" + request.query['name']




