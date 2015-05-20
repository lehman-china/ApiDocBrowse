# import urllib.request
# req = urllib.request.Request('http://www.example.com/')
# req.add_header('Referer', 'http://www.python.org/')
# r = urllib.request.urlopen(req)
# 
# print(r.read().decode('utf-8'))



import urllib.request
import urllib.parse
import re

def get( url ):
    request = urllib.request.Request(url ,method='GET')
    request.add_header("Content-Type","text/plain;charset=utf-8")
    f = urllib.request.urlopen(request)
    return f.read().decode('utf-8')

#print( get("http://127.0.0.1:5000/testApiGet.ajax?name=lehman13123") )
url = 'http://127.0.0.1:5000/testApi.ajax'
data = {'name': 'Lehman POST------POSTPOSTPOST'}
def post(url ,data ):
    data = urllib.parse.urlencode(data).encode('utf-8')
    request = urllib.request.Request(url,method='POST')
    request.add_header("Content-Type","application/x-www-form-urlencoded;charset=utf-8")
    f = urllib.request.urlopen(request,data)
    return f.read().decode('utf-8')

print( post(url,data) )

def httpRequest( param ):
    postData = ""
    isJson = re.compile(r'urlencoded|json').match( param["headers"]["Content-Type"] )
    if ( param["method"] == "POST" and isJson != None ):
        postData = urllib.parse.urlencode( param["param"] ).encode('utf-8')
    else:
        uu = (re.compile(r'\?').match( param["url"] ) != None) and "&" or "?"
        param["url"] = param["url"] + uu  + urllib.parse.urlencode( param["param"] ).encode('utf-8')


    post(param.url ,postData )

