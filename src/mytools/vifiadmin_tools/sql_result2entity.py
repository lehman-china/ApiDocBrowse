import decimal
import json

from lib.bottle import template
from src.commons.utils.mysql_utils import init_db, query
from src.mytools.commons.utils.common_utils import CommonUtils

init_db('192.168.1.215', 'root', 'myvifi', 'UUWIFI')
entity_name = "testVO"
SQL = """
SELECT
  tbSimPPort.idxSimPDevID,
  tbSimPPort.idxSlotNum,
  tbSimPPort.`status`,
  tbSimCard.idxSCGroupID,
  tbSimCard.`status` AS cStatus,
  tbSimCard.number cNumber,
  tbSimCard.balance / 1000 cBalance,
  tbViFiDevice.devState vStatus,
  tbViFiDevice.cos vCos
FROM
  tbSimPPort
  LEFT JOIN tbSimCard ON tbSimPPort.idxIccid = tbSimCard.idxIccid
  LEFT JOIN tbViFiDevice ON tbSimPPort.idxViFiId = tbViFiDevice.idxViFiID where idxSimPDevID=1




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
        public void set${val_def}( ${jf_type} $key} ) {this.${key} = ${key};}
    % end

    }
    """, dict(globals(), **vars()))
    return entity_template


res = sql_result2javabean()
CommonUtils.clip(res)


