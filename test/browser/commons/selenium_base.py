__author__ = 'Administrator'

from selenium import webdriver

_init_js = """
(function (){
if (window.__e)
{ return;
}
var e=document.createElement('div');
e.setAttribute("id","__s_msg");
e.style.display="none";
document.body.appendChild(e);
window.__e=e;
})();
window.__s_set_msg=function(a){
    window.__e.setAttribute("msg",a+"");
}
"""

_loadJsFmt = """
var script = document.createElement('script');
script.src = "{0}";
document.body.appendChild(script);
"""
_jquery_cdn = "http://cdn.bootcss.com/jquery/2.1.4/jquery.min.js"
_warpjsfmt = "__s_set_msg({0})"


"""
url 扩展,跳转的url
"""
class ExeJs(object):
    base_url = ""
    def __init__(self, driver,url=None, trytimes=10):
        from time import sleep
        if url:
            driver.get( ExeJs.base_url+url)
        self.driver = driver
        self.execute(_init_js)
        while trytimes > 0:
            try:
                self.msgNode = driver.find_element_by_id('__s_msg')
                break
            except Exception:
                sleep(1)
                trytimes -= 1
        if self.msgNode is None:
            raise Exception()

    def eval(self, jsstr):
        self.execute(_warpjsfmt.format(jsstr))
        return self.msgNode.get_attribute('msg')

    def loadJs(self, path):
        self.execute(_loadJsFmt.format(path))

    def loadJquery(self, path=_jquery_cdn):
        self.loadJs(path)

    def execute(self, jsstr):
        self.driver.execute_script(jsstr)


def get_chrome_driver():
    chromePath = "D:\\Program Files\\ChromePortable\\Chrome\\chrome.exe"
    chromeOptions = webdriver.ChromeOptions()
    chromeOptions._binary_location = chromePath
    return webdriver.Chrome(chrome_options=chromeOptions)


def get_phantomjs_driver():
    return webdriver.PhantomJS("phantomjs")
