import pyperclip
from lib.bottle import template
from src.commons.utils.mysql_utils import init_db, query


init_db('192.168.1.212', 'vifiadmin', 'myvifi', 'ViFi')

EDIT_MAX_ROW = 17


tab_name = "tbAgent"


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
    "12": "D"
}


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
        type = type_mapping[str(desc[1])]
        field_name = desc[0]
        # left_cfg ,字段布局是否显示在左边
        left_cfg = ""
        if is_split:
            left_cfg = " left : " + \
                ("true, " if desc_inx < (desc_len / 2) else "false, ")
        # 编辑时 不显示字段
        notEditCfg = " notEdit : true," if field_name in unshowEdit else ""

        # 默认值
        _def = "def:0" if type == "I" else ""
        pk_key = " pk : true," if tpl_str == "[" else ""
        tpl_str += template("""{ name : "${desc[0]}", type : "${type}",${pk_key+left_cfg+notEditCfg} show : true},
       """, dict(globals(), **vars()) )
        desc_inx = desc_inx + 1

    return tpl_str[:-9]

tpl_str = queryTb2ngRouteCfg()

tpl_str += "]"


pyperclip.copy(tpl_str)
print(pyperclip.paste())
print("已复制到,粘贴板~")
