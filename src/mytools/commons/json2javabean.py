__author__ = 'Administrator'
from collections import OrderedDict
from lib.bottle import template
import json

def json2javabean( jsonStr ):
    jsonObj = json.loads( jsonStr, object_pairs_hook = OrderedDict )
    tpl = template( """
    <% # 循环属性 %>
    % for (key, value) in jsonObj.items():
        <%
         type = "String" if isinstance( value, str ) else "Integer"
         name = key.replace( "-", "_" ).lower()
         %>
        private ${type} ${name};
    % end
    <% # 循环get set %>
    % for (key, value) in jsonObj.items():
        <%
         type = "String" if isinstance( value, str ) else "Integer"
         name = key.replace( "-", "_" ).lower()
         up1Name = name[:1].upper() + name[1:]

         %>

        public void set${up1Name}( ${type} ${name} ) {
            this.${name} = ${name};
        }
        public ${type} get${up1Name}() {
            return ${name};
        }
    % end
    """, jsonObj=jsonObj )
    return tpl


