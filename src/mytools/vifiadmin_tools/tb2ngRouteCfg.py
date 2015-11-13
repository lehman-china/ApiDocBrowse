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
    "253": "S",
    "3": "I",
    "1": "I",
    "12": "D",
    "10": "D"
}


def tb2ng_route_cfg(tab_name):
    @query()
    def queryTb2ngRouteCfg(cur):
        sql = "SELECT * FROM %s limit 0,1" % (tab_name)
        cur.execute(sql)

        tpl_str = "["
        desc_inx = 0
        desc_len = cur.description.__len__()

        # 是否切割
        is_split = desc_len > EDIT_MAX_ROW
        for desc in cur.description:
            type = type_mapping[str(desc[1])] if str(desc[1]) in type_mapping else "S"
            field_name = desc[0]
            # left_cfg ,字段布局是否显示在左边
            left_cfg = ""
            if is_split:
                left_cfg = " left: " + ("true," if desc_inx < (desc_len / 2) else "false,")
            # 编辑时 不显示字段
            hideEditCfg = ' hideEdit: "A",' if field_name in unshowEdit else ""
            type_cfg = ' type: "' + type + '",' if type != "S" else ""

            # 字段默认值
            _def = "def:0" if type == "I" else ""

            # 验证设置
            vali_cfg = ' vali: {maxlength : %d},' % (desc[3])

            pk_key = " pk : true," if tpl_str == "[" else ""
            tpl_str += template("""{name: "${desc[0]}",${type_cfg+pk_key+left_cfg+hideEditCfg} vali: {maxlength: ${desc[3]}}},
           """, dict(globals(), **vars()))
            desc_inx = desc_inx + 1

        return CommonUtils.reg_sub_ex(",\s{0,}(\}|])", lambda p, c: c(1), tpl_str + "]")  # 最后属性的点儿..

    tpl_str = queryTb2ngRouteCfg()
    return tpl_str

    # res = tb2ng_route_cfg("tbAgent")
    # print(res)
