from src.commons.dao.BaseDao import *
import re


def daoTest():
    dao = BaseDao()
    count = dao.execute("delete from user")

    sqls = [
        "insert into user(name) values('用户" + str(i) + "')" for i in range(1, 10)]
    for sql in sqls:
        dao.execute(sql)

    test = dao.query("select * from user")

    print(count)
    print(test)


def reTest():
    # 将正则表达式编译成Pattern对象
    pattern = re.compile(r'world')

    # 使用search()查找匹配的子串，不存在能匹配的子串时将返回None
    # 这个例子中使用match()无法成功匹配
    match = pattern.search('hello world!')

    if match:
        # 使用Match获得分组信息
        print(match.group())


def reDeleteTest():
    m = re.search(
        r'(DELETE FROM|delete from) (.*?) ', 'DELETE FROM tbAudit WHERE keyAdtID = ?')
    if m:
        print(m.groups()[1])


def reInsertTest():
    m = re.search(
        r'(insert into|INSERT INTO) (.*?)\(', 'insert into tbCfrmAccessRcd(idxType,idxDateTime,idxUserId,idxResourceId,ReqRemoteIP,ReqOS,ReqBrowser,ReqAction,ReqUrl,	ReqOperation,Result,Remarks) values(?,?,?,?,?,?,?,?,?,?,?,?)')
    if m:
        print(m.groups()[1])


def reUpdateTest():
    m = re.search(
        r'(UPDATE|update) (.*?) ', 'UPDATE tbUser SET accountState = ?,appState = ?,credit = ?,crtBy = ?,crtTm = ?,idxAgentID = ?,idxAreaCode = ?,idxGoIPPortID = ?,idxPhoneNumber = ?,idxSimCardID = ?,idxSimpPortID = ?,idxVPXID = ?,idxVSWID = ?,idxViFiID = ?,keyUserID = ?,language = ?,lastAPPDevInfo = ?,lastAPPOnlineDate = ?,lastAPPPublicIP = ?,lastAPPVer = ?,lastViFiDate = ?,mdfBy = ?,mdfTm = ?,password = ?,remarks = ?,rewardBalance = ?,roamTimeZone = ?,sipExpire = ?,userBalance = ?,vifiState = ? WHERE keyUserID = ?')
    if m:
        print(m.groups()[1])
reUpdateTest()
