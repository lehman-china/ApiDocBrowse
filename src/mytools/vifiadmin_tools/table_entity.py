import datetime
from lib.bottle import template
from src.commons.utils.mysql_utils import init_db,query
init_db( '120.25.72.53', 'vifiadmin', 'myvifi', 'ViFi' )


# aop 注解
isAopAnnotasion = True
# spring mvc 传参注解
isWebAnnotasion = True
# package_str = "package net.eoutech.commons.entity;";
package_str = "package com.vifi.vrs.webmin.commons.entity;"
entityName = "TbUser"
tabName = "tbUser"

type_mapping = {
    "252": "String",
    "253": "String",
    "3": "Integer",
    "8": "Integer",
    "1": "Integer",
    "12": "Date"
}

@query()
def queryUser( cur ):
    sql= "SELECT * FROM %s limit 0,1" % ( tabName )
    cur.execute( sql )
    pk_show = True
    str = template("""
      ${package_str}
      import java.util.Date;
      
    % if isWebAnnotasion:
      import com.alibaba.fastjson.annotation.JSONField;
      import org.springframework.format.annotation.DateTimeFormat;
    % end

    % if isAopAnnotasion:
      import javax.persistence.Id;
      import javax.persistence.Column;
      @javax.persistence.Table( name = "${tabName}" )
    % end

    public class ${entityName} {

    % for desc in cur.description:
      % if pk_show:
        @Id
        <% pk_show=False %>
      % end
      % if isAopAnnotasion:
        @Column( name = "${desc[0]}" )
      % end
        private ${type_mapping[str(desc[1])]} ${desc[0]};

    % end



    }
    """,dict(globals(), **vars()) )


    print( str )

    return 0


queryUser( )

