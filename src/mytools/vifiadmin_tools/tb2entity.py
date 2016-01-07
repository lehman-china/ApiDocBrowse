from lib.bottle import template
from src.commons.utils.mysql_utils import init_db, query
from src.mytools.commons.utils.common_utils import CommonUtils

init_db('192.168.1.215', 'root', 'myvifi', 'UUWIFI')

# 是否添加aop 注解
is_aop_annotasion = False

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

# 属性类型映射表
type_mapping = {
    "252": "String",
    "253": "String",
    "3": "Integer",
    "8": "Integer",
    "1": "Integer",
    "12": "Date",
    "10": "Date"
}

# 属性是否是主键
is_pk = True


@query()
def query_tb2java_entity(cur):
    sql = "SELECT * FROM %s limit 0,1" % (tab_name)
    cur.execute(sql)

    entity_template = template("""
      ${package_str}
      import java.util.Date;

    % if isWebAnnotasion:
      import com.alibaba.fastjson.annotation.JSONField;
      import org.springframework.format.annotation.DateTimeFormat;
    % end

    % if is_aop_annotasion:
      import javax.persistence.Id;
      import javax.persistence.Column;
      @javax.persistence.Table(name = "${tab_name}")
    % end

    public class ${entity_name} {

    % for desc in cur.description:
      % if is_aop_annotasion:
        % if is_pk:
          @Id
          
        % end
        @Column( name = "${desc[0]}" )
      % end
      % if isWebAnnotasion and type_mapping[str(desc[1])]=='Date':
        @JSONField(format = "yyyy-MM-dd HH:mm:ss")
        @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
      % end
        private ${type_mapping[str(desc[1])]} ${desc[0]};
      <% is_pk=False %>
    % end

    <% # Set Get 方法! %>
    % for desc in cur.description:
        <%
            val_def = desc[0][0:1].upper()+desc[0][1:]
            is_illed = val_def == desc[0] # 如果第一个字母是大写的字段,,JSONFast,解析时是不正确的.. 需要加上 @JSONField( name = "name" )
            jf_type = type_mapping[str(desc[1])]
            jf_date_fmt = ', format = "yyyy-MM-dd HH:mm:ss"' if jf_type == 'Date' else ''
            jf_map_name = '@JSONField(name = "'+val_def+'"'+jf_date_fmt+')' if is_illed else ''
        %>
        ${jf_map_name}
        public ${jf_type} get${val_def}() {return ${desc[0]};}
        ${jf_map_name}
        public void set${val_def}( ${jf_type} ${desc[0]} ) {this.${desc[0]} = ${desc[0]};}
    % end

    }
    """, dict(globals(), **vars()))
    entity_template = CommonUtils.line_space_add_sub(entity_template, -4)
    return CommonUtils.line_space_add_sub(entity_template, -2)


def tb2java_entity(tb_name):
    global tab_name,entity_name
    tab_name = tb_name
    entity_name = tab_name[0:1].upper() + tab_name[1:]

    return query_tb2java_entity()
