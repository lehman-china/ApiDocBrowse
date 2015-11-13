from lib.bottle import template
from src.commons.utils.mysql_utils import init_db, query

init_db('192.168.1.215', 'root', 'myvifi', 'UUWIFI')


def tb2i18n_cfg(tab_name):
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
                    "db.${tab_name}.${desc[0]}=${desc[0]}\ndb.${tab_name}.${desc[0]}.help= please input ${desc[0]}\n", dict(globals(), **vars()))
        return tpl_str

    return query_tb2i18n_cfg()


# print(tb2i18n_cfg("tbAgent"))
