import pyperclip
from lib.bottle import template
from src.commons.utils.mysql_utils import init_db, query


init_db('192.168.1.212', 'vifiadmin', 'myvifi', 'ViFi')

tab_name = "tbAgent"

not_cfg = {
    "crtTm": 1,
    "crtBy": 1,
    "mdfTm": 1,
    "mdfBy": 1
}


@query()
def query_tb2i18n_cfg(cur):
    sql = "SELECT * FROM %s limit 0,1" % (tab_name)
    cur.execute(sql)
    tpl_str = ""
    for desc in cur.description:
        if not desc[0] in not_cfg:
            tpl_str += template(
                "db.${tab_name}.${desc[0]}=\ndb.${tab_name}.${desc[0]}.help=请输入\n", dict(globals(), **vars()))
    return tpl_str

tpl_str = query_tb2i18n_cfg()

pyperclip.copy(tpl_str)
print(pyperclip.paste())
print("已复制到,粘贴板~")
