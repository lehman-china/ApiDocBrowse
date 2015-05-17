from lib.bottle import template, request
from src import app

import json
import http



@app.route('/', method='GET')
def index():
    return template('api.html')

@app.route('/testApi.ajax', method='POST')
def testApiPOST():
    return "/testApi.ajax OK " + request.params.name

@app.route('/testApiGet.ajax', method='GET')
def testApiGET():

    return "/testApiGet.ajax" + request.query['name']

