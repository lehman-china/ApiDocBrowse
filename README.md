# ApiDocBrowse


### python 的库
1. pymysql-0.7.2     : mysql 访问
2. xlrd-0.9.4        : excel 读取
3. pyperclip-1.5.26  : 剪切板操作

### 库源码修改点
更改bottle的几个点:
1. 开闭合标签{{}} ,修改为 ${}
2. bottle模板变量输出时不转换为html特殊字符,方法名:def html_escape(string):



### Python编译好库下载安装
下载地址 : https://www.lfd.uci.edu/~gohlke/pythonlibs/

安装方式 : pip install opencv_python-3.4.3-cp37-cp37m-win_amd64.whl
  
    