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
    res = f.read().decode('utf-8')
    return res

#print( get("http://127.0.0.1:5000/testApiGet.ajax?name=lehman13123") )

def post(url ,data ):
    data = urllib.parse.urlencode(data).encode('utf-8')
    request = urllib.request.Request(url,method='POST')
    request.add_header("Content-Type","application/x-www-form-urlencoded;charset=utf-8")
    f = urllib.request.urlopen(request,data)
    return f.read().decode('utf-8')
url = 'http://192.168.1.100:8080/api/user/get_info'
data = {'name': 'Lehman POST------POSTPOSTPOST','name2': 'Lehman POST------POSTPOSTPOST2'}
# print( get(url) )

# 将正则表达式编译成Pattern对象


# 使用Pattern匹配文本，获得匹配结果，无法匹配时将返回None
m = re.search( r'urlencoded|json' ,"application/x-www-form-js2on;charset=utf-8" )

print( {}.__len__() )
#print(get("http://192.168.1.100:8080/api/user/get_info"))



def httpRequest( param ):
    postData = ""
    isJson = re.compile(r'urlencoded|json').match( param["headers"]["Content-Type"] )
    if ( param["method"] == "POST" and isJson != None ):
        postData = urllib.parse.urlencode( param["param"] ).encode('utf-8')
    else:
        uu = (re.compile(r'\?').match( param["url"] ) != None) and "&" or "?"
        param["url"] = param["url"] + uu  + urllib.parse.urlencode( param["param"] ).encode('utf-8')


    post(param.url ,postData )

