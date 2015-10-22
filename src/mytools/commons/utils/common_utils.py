__author__ = 'Administrator'

import re

# 正则的替换扩展,
# 例: res = reg_sub_ex('"([A-Z\-]*?)":',lambda param,child_ma:'"%s":' % child_re(1).lower( ),string)
def reg_sub_ex( reg ,callback,string):
    def reg_cb( param ):
        # 取得子匹配
        def child_ma( inx ):
            return param.string[param.regs[inx][0]:param.regs[inx][1]]
        # 替换的内容
        return callback( param,child_ma )
    return re.sub(reg,reg_cb,string)



