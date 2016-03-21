from pydocx import PyDocX
# from pyquery import PyQuery as pq
import time
from src.mytools.commons.utils.common_utils import CommonUtils


def get_table( q_table ):
    return q_table if q_table.is_("table") else get_table( q_table.next() )



begin_time = time.time()
print( begin_time )

html = PyDocX.to_html('D:/Users/Documents/Jingoal/lehman@8726568/RecvFiles/liwu.xls')
# html = PyDocX.to_html('D:/test.docx')
print(html)
# html = CommonUtils.read_text("test.html")
#
# q_test = pq(html)
# # q_table = q_test("h2>em:contains('tbCDR')").closest("h2").next(".pydocx-list-style-type-decimal")
# q_table = q_test("h2>em:contains('tbCDR')").closest("h2").next()
#
# print(get_table(q_table))
# # for tr in q_table:
# #     print(pq(tr))
#
# print(time.time()-begin_time)





