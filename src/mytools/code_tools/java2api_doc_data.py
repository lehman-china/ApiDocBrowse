import json

from src.mytools.commons.utils.common_utils import *


def field2api_data(field_str):
    vals = []
    CommonUtils.reg_sub_ex("\s\*\s(.*?)\n",lambda p,c:vals.append(c(1)),field_str)
    CommonUtils.reg_sub_ex("[public|private]\s([\S]*?)\s(\S*)",lambda p,c:vals.append(c(1)+","+c(2)),field_str)
    if vals.__len__()  > 1:
        sp = vals[1].split(",")
        return '"%s": "type=%s& explain=%s"' % (sp[1],sp[0],vals[0])
    else:
        return ""

def java2api_data(content,sign = '"'):
    field_list = content.split(";")
    api_data = []

    for  field_str in field_list:
        res = field2api_data(field_str)
        if res != "":
            api_data.append( field2api_data(field_str) )
    return ",\n".join(api_data)




content = """
	/**
	 * 勋章ID
	 */
	public long medalId;
	/**
	 * 勋章名
	 */
	public String medalName = "";
	/**
	 * 勋章图片
	 */
	public String medalPic = "";
	/**
	 * 勋章状态 0 未拥有 1拥有 2 已佩戴
	 */
	public short status;
	/**
	 * 描述
	 */
	public String medalDescription;



"""
print( java2api_data(content) )



