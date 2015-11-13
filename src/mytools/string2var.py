from src.mytools.commons.utils.common_utils import *


def str2var(string):
    rows = string.replace('"','\\"').split("\n")[1:-1]
    result = '"+\n"'.join(rows)
    result = '"%s"' % (result)
    CommonUtils.clip(result)


def var2str(string):
    result = CommonUtils.reg_sub_ex(' "|\s"\s\+', lambda param, c_ma: "", string)
    CommonUtils.clip(result)


string = """
SELECT
	u.lastAPPPublicIP AS ip,
	Count(u.lastAPPPublicIP) AS count,
	ip.country,
	ip.operators
FROM
	tbUser u
JOIN tbIPAddress ip ON INET_ATON(u.lastAPPPublicIP) BETWEEN ip.startIp AND ip.endIP
WHERE
	u.accountState = 'Y'
AND u.appState > 10
GROUP BY
	country
"""

str2var(string)
