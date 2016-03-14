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
s = """
{"original_purchase_date_pst":"2014-02-12 00:45:53 America/Los_Angeles","purchase_date_ms":"1392194753368","unique_identifier":"f71c804bcd090085d17cf07e2805c1b0dfa053ea","original_transaction_id":"1000000101265551","bvrs":"1.0","transaction_id":"1000000101265551","quantity":"1","unique_vendor_identifier":"F63E7A35-0406-445F-A5AA-CC9974D4CA9B","item_id":"802793352","product_id":"com.ycm.pnm.wi1","purchase_date":"2014-02-12 08:45:53 Etc/GMT","original_purchase_date":"2014-02-12 08:45:53 Etc/GMT","purchase_date_pst":"2014-02-12 00:45:53 America/Los_Angeles","bid":"com.ycm.pnm","original_purchase_date_ms":"1392194753368"}


"""

print(json2javabean(s))