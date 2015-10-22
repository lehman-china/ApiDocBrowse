import datetime
import pyperclip

from lib.bottle import template
from src.commons.utils.mysql_utils import init_db, query

init_db('192.168.1.212', 'vifiadmin', 'myvifi', 'ViFi')


# 是否添加aop 注解
is_aop_annotasion = False
pk_show = True
# 是否添加 spring mvc 传参注解
isWebAnnotasion = True
# 属性是否有默认值
is_value_def = True

package_sel = {
    "vifiwebmin.frame": "package com.frame.commons.entity;",
    "vifiwebmin.webmin": "package net.eoutech.webmin.commons.entity;",
    "asvpx": "package com.vifi.vrs.webmin.commons.entity;",
    "asvsw": "package net.eoutech.commons.entity;",
}
package_str = package_sel["vifiwebmin.webmin"]


tab_name = "tbBlackList"

entity_name = tab_name[0:1].upper() + tab_name[1:]
type_mapping = {
    "252": "String",
    "253": "String",
    "3": "Integer",
    "8": "Integer",
    "1": "Integer",
    "12": "Date"
}
val_def_mapping = {
    "252": ' = " - "',
    "253": ' = " - "',
    "3": " = 0",
    "8": " = 0",
    "1": " = 0",
    "12": " = new Date()"
}


@query()
def queryTb2JavaBean(cur):
    sql = "SELECT * FROM %s limit 0,1" % (tab_name)
    cur.execute(sql)

    str = template("""
      ${package_str}
      import java.util.Date;
      
    % if isWebAnnotasion:
      import com.alibaba.fastjson.annotation.JSONField;
      import org.springframework.format.annotation.DateTimeFormat;
    % end

    % if is_aop_annotasion:
      import javax.persistence.Id;
      import javax.persistence.Column;
      @javax.persistence.Table( name = "${tab_name}" )
    % end

    public class ${entity_name} {

    % for desc in cur.description:
      % if is_aop_annotasion:
        % if pk_show:
          @Id
          <% pk_show=False %>
        % end
        @Column( name = "${desc[0]}" )
      % end
      % if isWebAnnotasion and type_mapping[str(desc[1])]=='Date':
        @JSONField( format = "yyyy-MM-dd HH:mm:ss" )
        @DateTimeFormat( pattern = "yyyy-MM-dd HH:mm:ss" )
      % end
        private ${type_mapping[str(desc[1])]}${desc[0]}${ val_def_mapping[str(desc[1])] if is_value_def else ''};
    % end



    }
    """, dict(globals(), **vars()) )

    return str


pyperclip.copy(queryTb2JavaBean())
print(pyperclip.paste())
print("已复制到,粘贴板~")
