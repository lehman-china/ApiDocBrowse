import collections
import json
import re
import unittest
import time

import execjs

from src.commons.utils.mysql_utils import init_db
from src.mytools.commons.utils.common_utils import CommonUtils
from src.mytools.vifiadmin_tools.webmin_add_page import AddPage

init_db('192.168.1.215', 'root', 'myvifi', 'UUWIFI')


# 维护,webmin 表
class MaintainPage(AddPage):
    # 创建指定js
    @staticmethod
    def create_js(tbs):
        [MaintainPage(tb_name).crt_js_file() for tb_name in tbs]

    # 维护表字段js设置
    def mt_js(self):
        ### 预备变量
        # 保留旧配置的白名单
        o_cfg_white_list = ["continent"]
        # 注释的字段.(排除字段)
        exclude_field_cfg = {
            "tbSimCard": {
                "idxIccid": True, "restCallDur": True, "restSMSNum": True, "outCalls": True, "outCallDuration": True, "inCalls": True, "inCallDuration": True, "successCalls": True, "failedCalls": True, "shortCalls": True, "contFailedCalls": True, "contFailed": True
            },
            "tbSimPDev": {
                "idxSimPDevGrpID": True

            },
            "tbGoIPDev": {
                "idxGoIPDevGrID": True

            },
            "tbVPX": {
                "onlineUserNum": True,
                "callingUserNum": True

            }
        }

        ### 1.取得,新配置对象,和旧配置2个配置对象
        # old config
        js_value = CommonUtils.read_text(self.js_file)
        old_cfg_j = re.search("fields:([\s\S]*?)\};", js_value).group(1)
        old_cfg_j_cp = old_cfg_j
        # 这里排除配置里使用的变量....待会替换回来
        while (1):
            try:
                old_cfg_s = execjs.eval("JSON.stringify(%s)" % old_cfg_j_cp)
                break
            except Exception as e:
                obj_key = re.search("ReferenceError: (.*?) is", str(e)).group(1)  # 取出,异常说没有定义的属性名
                obj_key = re.search("[^\{\{](" + obj_key + ".*?)[,\}]", old_cfg_j_cp).group(1)  # 从旧配置里去除完整的 变量名
                unknown_key = "\"NOT_DEFINED{{%s}}\"" % obj_key  # 加入区分标示!
                old_cfg_j_cp = old_cfg_j_cp.replace(obj_key, unknown_key)

        old_cfg_o = json.loads(old_cfg_s, object_pairs_hook=collections.OrderedDict, encoding="utf8")
        # new config
        from src.mytools.vifiadmin_tools.tb2ngRouteCfg import tb2ng_route_cfg
        new_cfg_j = tb2ng_route_cfg(self.tb_name)
        new_cfg_s = execjs.eval("JSON.stringify(%s)" % new_cfg_j)
        new_cfg_o = json.loads(new_cfg_s, object_pairs_hook=collections.OrderedDict, encoding="utf8")

        ### 2.旧配置去新配置查找,如果不存在则去除配置字段

        old_cfg_o2 = []
        for cfg in old_cfg_o:
            # 去新配置和白名单匹配,匹配成功保留
            if list(filter(lambda o: cfg["name"] == o["name"], new_cfg_o)).__len__() > 0 or cfg["name"] in o_cfg_white_list:
                old_cfg_o2.append(cfg)
            # 如果参数在白名单,且 不再新配置中,塞入新配置中,方面等下融合...
            if cfg["name"] in o_cfg_white_list and list(filter(lambda o: cfg["name"] == o["name"], new_cfg_o)).__len__() < 1:
                new_cfg_o.insert(old_cfg_o.index(cfg), cfg)

        ### 3.拿旧配置->extend融合到新配置中
        for o_cfg in old_cfg_o2:
            # 找到对应的新配置项
            n_cfg_o = list(filter(lambda n_cfg: o_cfg["name"] == n_cfg.get("name"), new_cfg_o))[0]
            # 旧配置->extend融合到新配置中
            for (k, v) in o_cfg.items():
                n_cfg_o.__setitem__(k, v)

        # ### 4.配置转换成json字符串,整理格式,写入到js文件
        format_cfg = json.dumps(new_cfg_o, ensure_ascii=False).replace("}, {", "},\n{")  # 换行
        format_cfg = CommonUtils.reg_sub_ex("\"([^\"]*?)\":", lambda p, c: c(1) + ":", format_cfg)  # 去除 js 对象属性名的 "" 双引号...
        format_cfg = CommonUtils.line_space_add_sub(format_cfg, 12)  # 加空格
        format_cfg = CommonUtils.reg_sub_ex("\"NOT_DEFINED\{\{(.*?)\}\}\"", lambda p, c: c(1), format_cfg)  # 去除起初的,错误标志

        # 注释排除的字段.
        if self.tb_name in exclude_field_cfg:
            for key in exclude_field_cfg[self.tb_name]:
                format_cfg = CommonUtils.reg_sub_ex(".*" + key + ".*", lambda p, c: "//" + c(0), format_cfg)

        # 替换之前的配置
        js_value = js_value.replace(old_cfg_j, format_cfg)

        CommonUtils.write_text(self.js_file, js_value)

    # 生成所有实体!!!
    @staticmethod
    def generate_all_entity():
        [AddPage(tb_name).add_java_entity() for tb_name in AddPage.get_all_webmin_tb()]

    # 维护指定实体!!!
    @staticmethod
    def generate_entity(tb_names):
        [AddPage(tb_name).add_java_entity() for tb_name in tb_names]


class TestMaintainMain(unittest.TestCase):
    # !!!! 不要随便调用..容易覆现有数据!!!
    def test_create_page(self):
        AddPage.crt_page("tbSCGroup222222")

    # **************************** 维护区域
    # 维护所有实体,和js
    def test_mt_all_page(self):
        self.test_mt_all_entity()
        self.test_mt_list_js()

    def test_mt_entity(self):
        tb_names = ["tbVersion"]
        MaintainPage.generate_entity(tb_names)

    def test_mt_all_entity(self):
        MaintainPage.generate_all_entity()


    def test_123(self):
        print( time.localtime() )


    # *** 维护多个表字段js设置
    def test_mt_list_js(self):
        all_webmin_tb = AddPage.get_all_webmin_tb_dict()

        path = "D:/Users/Desktop/Projects/java/vifi_trunk/vifiwebmin/WebContent/page/"
        tbs = []
        for dirpath, dirnames, filenames in execjs.os.walk(path):
            for filename in filter(lambda fn: re.search("\.js$", fn), filenames):
                tb_name = CommonUtils.reg_sub_ex("^(.)(.*?)\.js", lambda p, c: "tb" + c(1).upper() + c(2), filename)
                if tb_name in all_webmin_tb:
                    tbs.append(tb_name)

        i = 0
        for tb_name in tbs:
            i += 1
            MaintainPage(tb_name).mt_js()
            print("%d/%d" % (i, tbs.__len__()))

    # *** 维护单表 js配置
    def test_mt_single_js(self):
        MaintainPage("tbViFiDevGroup").mt_js()
