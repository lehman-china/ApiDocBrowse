import decimal
import json

from lib.bottle import template
from src.commons.utils.mysql_utils import init_db, query
from src.mytools.commons.utils.common_utils import CommonUtils

init_db('192.168.1.201', 'dev', 'dev', 'job')
entity_name = "TestVO"
SQL = """
SELECT
g.`name`,
m.rec_num,
m.give_num,
m.last_give_to_user,
m.last_rec_from_user
from t_my_gift m join t_product_gift g on m.product_gift_id=g.product_gift_id

"""


@query(sql=SQL)
def sql_result2json(datas):
    return json.dumps(datas, indent=4, default=lambda o: float(o) if isinstance(o, decimal.Decimal)  else o)
    # return datas


@query(sql=SQL)
def sql_result2javabean(datas):
    global entity_name

    data = datas[0]

    type_mapping = {
        "<class 'str'>": "String",
        "<class 'int'>": "Integer",
        "<class 'datetime.datetime'>": "Date",
        "<class 'decimal.Decimal'>": "Double",
        "<class 'NoneType'>": "Object"
    }

    def get_type(value):
        return type_mapping[str(type(value))]

    entity_template = template("""
    import java.util.Date;
    public class ${entity_name} {

    % for (key,value) in data.items():
      % if get_type(value)=='Date':
        @JSONField(format = "yyyy-MM-dd HH:mm:ss")
      % end
        private ${get_type(value)} ${key};
    % end
    <% # Set Get 方法! %>
    % for (key,value) in data.items():
        <%
            val_def = key[0:1].upper()+key[1:]
            is_illed = val_def == key # 如果第一个字母是大写的字段,,JSONFast,解析时是不正确的.. 需要加上 @JSONField( name = "name" )
            jf_type = get_type(value)
            jf_date_fmt = ', format = "yyyy-MM-dd HH:mm:ss"' if jf_type == 'Date' else ''
            jf_map_name = '@JSONField(name = "'+val_def+'"'+jf_date_fmt+')' if is_illed else ''
        %>
        ${jf_map_name}
        public ${jf_type} get${val_def}() {return ${key};}
        ${jf_map_name}
        public void set${val_def}( ${jf_type} ${key} ) {this.${key} = ${key};}
    % end

    }
    """, dict(globals(), **vars()))
    return entity_template


res = sql_result2javabean()
CommonUtils.clip(res)


