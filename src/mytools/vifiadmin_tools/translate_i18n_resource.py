# coding=utf-8
import json
import urllib

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
def translate_resource_file(msg_file_r_path, msg_file_w_path, to_lan="auto"):
    # 读取资源文件
    fp = open(msg_file_r_path)
    resource_str = fp.read()
    fp.close()

    # 收集所有需要翻译的词
    valus = []
    CommonUtils.reg_sub_ex('=(.*?)\n', lambda param, child_ma: valus.append(eval('u"%s"' % child_ma(1))), resource_str)

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

    rtrans_str = CommonUtils.reg_sub_ex('=(.*?)\n', lambda param, child_ma: "=" + get_trans_value() + "\n", resource_str)

    # 翻译后,写入文件
    fw = open(msg_file_w_path, mode='w', encoding="UTF-8")
    fw.write(rtrans_str)
    fw.close()

    print("操作完成!!!!!")


def translate_res(to_lan):
    res_zh_path = "D:/Users/Desktop/Projects/java/vifi_trunk/vifiwebmin/src/messages_zh_CN.properties"
    translate_resource_file(res_zh_path, resource_files[to_lan], to_lan)


resource_files = {
    "en": "D:/Users/Desktop/Projects/java/vifi_trunk/vifiwebmin/src/messages_en_US.properties",
    "jp": "D:/Users/Desktop/Projects/java/vifi_trunk/vifiwebmin/src/messages_jp_JP.properties",
    "kor": "D:/Users/Desktop/Projects/java/vifi_trunk/vifiwebmin/src/messages_ko_KR.properties",
    "yue": "D:/Users/Desktop/Projects/java/vifi_trunk/vifiwebmin/src/messages_zh_TW.properties"

}
# translate_res("yue")

print(urllib.parse.urlencode({"name": "\n"}))
