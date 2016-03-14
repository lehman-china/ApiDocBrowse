from src.mytools.commons.utils.common_utils import *


def str2var(string,sign = '"'):
    rows = CommonUtils.reg_sub_ex("(%s)"%sign,lambda p,c:'\\'+c(1),string).split("\n")
    result = (sign+'+\n' + sign).join(rows)
    result = (sign+'%s' + sign) % (result)
    CommonUtils.clip(result)


def var2str(string,sign = '"'):
    result = CommonUtils.reg_sub_ex(' %s|%s\n|\s{0,}%s\s\+' % (sign,sign,sign), lambda p, c: "", string)
    CommonUtils.clip(result)


string = """

"select \n" +
                "\tcontinent,areaCode,`name` areaName,\n" +
                "\tconcat('[',GROUP_CONCAT(CAST(concat('{\"status\":',STATUS,',\"count\":',statusCount,\"}\") AS char) order by STATUS ),']') statusCount ,\n" +
                "\tsum(statusCount) statusSum\n" +
                "from\n" +
                "(\n" +
                "\tSELECT\n" +
                "\t\ttbArea.continent continent,\n" +
                "\t\ttbArea.`name`,\n" +
                "\t\ttbSCGroup.areaCode AS areaCode,\n" +
                "\t\ttbSimCard.`status` AS `status`,\n" +
                "\t\tCount(tbSimCard.`status`) AS statusCount\n" +
                "\tFROM\n" +
                "\t\ttbSimCard\n" +
                "\t\tINNER JOIN tbSCGroup ON tbSimCard.idxSCGroupID = tbSCGroup.keySCGroupID\n" +
                "\t\tINNER JOIN tbArea ON tbSCGroup.areaCode = tbArea.keyAreaCode\n" +
                "\t\tGROUP BY tbSCGroup.areaCode,tbSimCard.status\n" +
                ") areaStatusCount group by areaCode"



"""

# str2var(string,"'")
# var2str(string)
print(123)

