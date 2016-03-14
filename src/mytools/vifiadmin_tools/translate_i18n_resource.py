# coding=utf-8
import json
import urllib
import time

from lib.bottle import unicode
from src.mytools.commons.langconv.langconv import *
from src.mytools.commons.utils.common_utils import CommonUtils


# msg_file_r_path:要翻译的资源文件
# msg_file_w_path:翻译后写入的资源文件
# to_lan:翻译成指定语言,语种编码
# 	中文	zh,	英语	en
# 	日语	jp,	韩语	kor
# 	西班牙语	spa,	法语	fra
# 	泰语	th,	阿拉伯语	ara
# 	俄罗斯语	ru,	葡萄牙语	pt
# 	粤语	yue,	文言文	wyw
# 	白话文	zh,	自动检测	auto
# 	德语	de,	意大利语	it
# 	荷兰语	nl,	希腊语	el






# 翻译字符串
def translate_resource_str(resource_str, to_lan):
    # 抓取国际化值的 正则
    reg_val_res = '=(.{2,}?)\n'
    # 收集所有需要翻译的词
    valus = []
    CommonUtils.reg_sub_ex(reg_val_res, lambda param, child_ma: valus.append(eval("u'%s'" % child_ma(1))), resource_str)
    # 调用百度翻译接口,集体翻译
    param = urllib.parse.urlencode(
            {'client_id': "xsRoieG2htev5HMzkjqUM7vf", 'from': 'zh', 'to': to_lan, 'q': "\n".join(valus)})
    url = "http://openapi.baidu.com/public/2.0/bmt/translate?" + param
    data = urllib.request.urlopen(url).read()
    data_obj = json.loads(data.decode('UTF-8'))

    trans_result = data_obj["trans_result"]

    print("url:" + url)
    try:
        print(trans_result)
    except Exception:
        print(json.dumps(trans_result))

    # 翻译内容
    t_inx = [-1]
    def get_trans_value():
        t_inx[0] += 1
        trans_val = trans_result[t_inx[0]]["dst"].replace("'", "`")
        # 如果是粤语,转换简体到繁体
        if "yue" == to_lan:
            trans_val = Converter('zh-hant').convert(trans_val)
        # unicode 编码一下
        trans_val = str(trans_val.encode('unicode_escape').decode('utf-8'))
        return trans_val

    rtrans_str = CommonUtils.reg_sub_ex(reg_val_res, lambda param, child_ma: "=" + get_trans_value() + "\n", resource_str)

    print(  "翻译~完成~%s\n预计翻译条数:%d \n实际翻译条数:%d" % (time.strftime("%Y-%m-%d %X", time.localtime()),valus.__len__(),trans_result.__len__()) )
    return rtrans_str




# 读取资源文件,翻译资源文件
def translate_resource_file(msg_file_r_path, msg_file_w_path, to_lan="auto"):
    # 读取资源文件
    fp = open(msg_file_r_path)
    resource_str = fp.read()
    fp.close()

    res_line_num=0
    res_str=""# 收集需要翻译的字符串
    translate_after_str = "" #翻译后的字符串收集

    for line_res_str in resource_str.split("\n"):
        res_str+=line_res_str+"\n"
        # 收集限定 行数据就进行翻译,  不然百度api接口 超过数量会不能翻译!!!!!
        if res_line_num == 300:
            translate_after_str+=translate_resource_str(res_str, to_lan)
            # 翻译后重新来过
            res_line_num=0
            res_str=""
        res_line_num +=1

    translate_after_str+=translate_resource_str(res_str, to_lan)

    print(resource_str.split("\n"))


    # 翻译后,写入文件
    fw = open(msg_file_w_path, mode='w', encoding="UTF-8")
    fw.write(translate_after_str)
    fw.close()

    print("全部翻译完成!!!!"+time.strftime("%Y-%m-%d %X", time.localtime()) )




def translate_res(to_lan):
    res_zh_path = "D:/Users/Desktop/Projects/java/vifi_trunk/vifiwebmin/src/messages_zh_CN.properties"
    translate_resource_file(res_zh_path, resource_files[to_lan], to_lan)


resource_files = {
    "en": "D:/Users/Desktop/Projects/java/vifi_trunk/vifiwebmin/src/messages_en_US.properties",
    "jp": "D:/Users/Desktop/Projects/java/vifi_trunk/vifiwebmin/src/messages_jp_JP.properties",
    "kor": "D:/Users/Desktop/Projects/java/vifi_trunk/vifiwebmin/src/messages_ko_KR.properties",
    "yue": "D:/Users/Desktop/Projects/java/vifi_trunk/vifiwebmin/src/messages_zh_TW.properties"

}
translate_res("yue")



# comData=\[.*?$
# comData=\[\["undefined","undefined"\]\]
