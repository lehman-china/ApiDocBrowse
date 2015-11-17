import unittest

from src.commons.utils.mysql_utils import init_db
from src.mytools.vifiadmin_tools.webmin_add_page import AddPage

init_db('192.168.1.215', 'root', 'myvifi', 'UUWIFI')


# 维护,webmin 表
class MaintainPage(AddPage):
    # 维护指定js
    @staticmethod
    def mt_js( tbs ):
        [MaintainPage(tb_name).crt_js_file() for tb_name in tbs]
    # 维护所有实体!!!
    @staticmethod
    def mt_all_entity():
        [AddPage(tb_name).add_java_entity() for tb_name in AddPage.get_all_webmin_tb()]



class TestMaintainMain(unittest.TestCase):
    def test_mt_js(self):
        tbs = ['tbAgentAdditionRcd', 'tbAgentDeductionRcd', 'tbArea', 'tbConfigure', 'tbCountDaily', 'tbCountMonthly', 'tbCountOnlineDaily', 'tbCountSrcIP', 'tbCronLog', 'tbDailyRental', 'tbDomain', 'tbFeedback', 'tbFireWall', 'tbGlobalSIM', 'tbGlobalSIMGrp', 'tbGoIPDev', 'tbGoIPGrp', 'tbGoIPPort', 'tbOutboundRoute', 'tbRewardRcd', 'tbSCGroup', 'tbSMS', 'tbSMSCountDaily', 'tbSMSGateway', 'tbSMSTemplate', 'tbSimCard', 'tbSimPDev', 'tbSimPDevGrp', 'tbSimPPort', 'tbSubscription', 'tbUUWiFiSession',
               'tbUserSuite', 'tbUserTopupRcd', 'tbVNS', 'tbVPX', 'tbVSW', 'tbVersion', 'tbViFiCtrlRcd', 'tbViFiDevGroup', 'tbViFiDevice', 'tbViFiStatus','tbTrunk']
        MaintainPage.mt_js(tbs)

    def test_mt_js2(self):
        tbs = ['tbTrunk']
        MaintainPage.mt_js(tbs)

    def test_mt_all_entity(self):
        MaintainPage.mt_all_entity()