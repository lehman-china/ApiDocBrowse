import re

from lib.bottle import template
from src.commons.utils.mysql_utils import init_db, query
from src.mytools.commons.utils.common_utils import CommonUtils

init_db('192.168.1.215', 'root', 'myvifi', 'UUWIFI')

EDIT_MAX_ROW = 17

# 不在edit层中显示
unshowEdit = {
    "crtTm": 1,
    "crtBy": 1,
    "mdfTm": 1,
    "mdfBy": 1,
    "createdBy": 1,
    "createdTime": 1,
    "modifiedBy": 1,
    "modifiedTime": 1
}

# js 类型对象,和java对象类型映射表.
type_mapping = {
    "varchar": "S",
    "int": "I",
    "tinyint": "I",
    "datetime": "D",
    "date": "D",
    "time": "D",
    "timestamp": "D"
}


def tb2ng_route_cfg(tab_name):
    @query(sql="desc " + tab_name )
    def queryTb2ngRouteCfg( datas ):
        tpl_str = "["
        desc_inx = 0
        desc_len = datas.__len__()

        # 是否切割
        is_split = desc_len > EDIT_MAX_ROW
        for desc in datas:
            field_name = desc["Field"]
            field_type = desc["Type"].split("(")[0]
            re_len = re.search("\((.*?)\)",desc["Type"])
            field_len = re_len.group(1) if re_len else None
            is_pk = desc["Key"] == "PRI" # 是否是主键
            is_increment = desc["Extra"] == "auto_increment" # 是否自动递增


            type = type_mapping[field_type] if field_type in type_mapping else "S"

            # left_cfg ,字段布局是否显示在左边
            left_cfg = ""
            if is_split:
                left_cfg = " left: " + ("true," if desc_inx < (desc_len / 2) else "false,")

            type_cfg = ' type: "' + type + '",' if type != "S" else ""

            # 字段默认值
            _def = "def:0" if type == "I" else ""

            # 验证设置
            vali_cfg = ' vali: {maxlength : '+field_len+'},' if field_len else ""

            # 编辑时 不显示字段
            hideEditCfg = ' hideEdit: "A",' if field_name in unshowEdit else ""

             # 主键
            pk_key = " pk : true," if is_pk else ""

            # 编辑时 主键 禁用状态
            disabledInputCfg = ' disabled: "E",' if is_pk else ""

            if is_increment:
                disabledInputCfg = ' disabled: "A",' if disabledInputCfg else ' disabled: "N",'



            view_cfg_list = type_cfg+pk_key+left_cfg+disabledInputCfg+hideEditCfg+vali_cfg
            tpl_str += template("""{name: "${field_name}",${view_cfg_list}},
           """, dict(globals(), **vars()))
            desc_inx = desc_inx + 1

        return CommonUtils.reg_sub_ex(",\s{0,}(\}|])", lambda p, c: c(1), tpl_str + "]")  # 最后属性的点儿..

    tpl_str = queryTb2ngRouteCfg()
    return tpl_str

# res = tb2ng_route_cfg("tbSimPPort")
# print(res)
