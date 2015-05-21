import glob
import os
import re

import urllib.request
import urllib.parse

from lib.bottle import template, request
from src import app

import json
import http

# 首页
@app.route( '/', method = 'GET' )
@app.route( '/api.html', method = 'GET' )
def index( ):
    return template( 'api_doc_browse/home.html' )

# API浏览
@app.route( '/api_doc/api.html', method = 'GET' )
def intoApi( ):
    dataFiles = glob.glob( os.path.dirname( __file__ ) + "/../service/api_doc_data/module/*.json" )
    jsons = []
    for dataFile in dataFiles:
        file = open( dataFile, encoding = 'utf-8' )
        jsons.append( file.read( ) )
        file.close( )
    return template( 'api_doc_browse/api.html', { "allApiJSON": "[" + (','.join( jsons )) + "]" } )

# 文档中心
@app.route( '/api_doc/api_doc_center.html', method = 'GET' )
def intoApiDocCenter( ):
    return template( 'api_doc_browse/api_doc_center.html' )


@app.route( '/testApi.ajax', method = 'POST' )
def testApiPOST( ):
    param = json.loads( request.params.param )
    options = {
        "url": param["url"],
        "method": param["type"],
        "headers": param["headers"],
        "param": param["param"]
    }
    res = httpRequest( options )
    return json.dumps( { "content": res } )


def httpRequest( param ):
    postData = bytes( )
    isJson = re.search( r'urlencoded|json', param["headers"]["Content-Type"] )
    if param["method"] == "POST" and isJson:
        postData = urllib.parse.urlencode( param["param"] ).encode( 'utf-8' )
    elif param["param"].__len__( ):
        uu = re.search( r'\?', param["url"] ) and "&" or "?"
        param["url"] = param["url"] + uu + urllib.parse.urlencode( param["param"] ).encode( 'utf-8' ).decode( )
    request = urllib.request.Request( param["url"], method = param["method"] )
    # 设置头信息
    for (k, v) in param["headers"].items( ):
        request.add_header( k, v )
    request.add_header( 'Content-Length', str( postData.__len__( ) ) )
    f = urllib.request.urlopen( request, postData )
    return f.read( ).decode( 'utf-8' )



