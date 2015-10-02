__author__ = 'Administrator'
import re

import pyperclip

from src.mytools.commons.json2javabean import *


def crate_req( jsonStr ):
    jsonObj = json.loads( jsonStr, object_pairs_hook = OrderedDict )
    tpl = template( """
    package net.eoutech.vifi.as.vsw.msg;

    import net.eoutech.vifi.as.ascommons.msg.VaMsgType;

    public class VswMsgReq${jsonObj["MSG"]} extends VswMsgReqBase {
        ${bean_property}
        @Override
        public VaMsgType getMsgType() {
            return VaMsgType.${jsonObj["MSG"]};
        }
    }
    """, jsonObj = jsonObj, bean_property = json2javabean( jsonStr ) )
    return tpl


def crate_resp( jsonStr ):
    # 父类中拥有的属性
    base_has_pro = ["proto", "cseq", "did", "code", "reason", "msg"]
    # 删除父类中拥有的属性
    jsonObj = json.loads( jsonStr, object_pairs_hook = OrderedDict )
    for pro in base_has_pro:
        try:
            jsonObj.__delitem__( pro )
        except:
            pass
    pro_str = json2javabean( json.dumps( jsonObj ) )
    tpl = template( """
     public StringBuilder toJSONString() {
        StringBuilder json = super.toJSONString();
        json = new StringBuilder( json.substring( 0, json.length() - 1 ) ).append( "," )
            % for (key, value) in jsonObj.items():
                <% type = "Str" if isinstance( value, str ) else "Int" %>
                .append( to${type}JS( "${key}", ${key}, "," ) )
            % end
        return json;
    }
    """, jsonObj = jsonObj )
    # 最后的连接小处理
    lastDInx = tpl.rfind( '","' )
    tpl = tpl[:lastDInx + 1] + '}" ) );' + tpl[lastDInx + 7:]
    return pro_str + tpl


jsonStr = """

  {"PROTO":"ESPP/1.0","MSG":"VREG-ACK","CSEQ":4,"DID":373,"CODE":200,"REASON":"OK","EXPIRES":180}

"""
# 大写属性名转小写
def tt( param ):
    reg = param.regs[1]
    return '"%s":' % param.string[reg[0]:reg[1]].replace( "-", "_" ).lower( )


jsonStr = re.sub( '"([A-Z\-]*?)":', tt, jsonStr )


def handel_req( is_handel_req ):
    return crate_req( jsonStr ) if is_handel_req else crate_resp( jsonStr )


pyperclip.copy( handel_req( False ) )
print( pyperclip.paste( ) )
print( "已复制到,粘贴板~" )

