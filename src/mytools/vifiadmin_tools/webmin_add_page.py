import os

from lib.bottle import template
from src.commons.utils.mysql_utils import init_db, query
from src.mytools.commons.utils.common_utils import CommonUtils

init_db('192.168.1.215', 'root', 'myvifi', 'UUWIFI')


class AddPage():
    tb_index = 0
    ctrl_path = "D:/Users/Desktop/Projects/java/vifi_trunk/vifiwebmin/src/net/eoutech/webmin/vifi/ctrl"

    def __init__(self, tb_name):
        self.tb_name = tb_name
        self.tb_entity_name = tb_name[0:1].upper() + tb_name[1:]
        self.resource_name = "vifi_" + tb_name[2:][0:1].lower() + tb_name[3:]
        self.resource_url = "/" + self.resource_name.replace("_", "/")
        self.simp_entity_name = tb_name[2:]
        self.var_entity_name = self.simp_entity_name[0:1].lower() + self.simp_entity_name[1:]
        ####################---- 临时目录区
        # self.ctrl_file = "D:/add_page/ctrl/%sCtrl.java" % (self.simp_entity_name)
        # self.service_file = "D:/add_page/service/%sService.java" % (self.simp_entity_name)
        # self.dao_file = "D:/add_page/dao/%sDao.java" % (self.simp_entity_name)
        # self.entity_file = "D:/add_page/entity/%s.java" % (self.tb_entity_name)
        #
        # self.i18n_file = "D:/add_page/messages_zh_CN.properties"
        # self.routejs_file = "D:/add_page/js/route.config.js"
        #
        # self.js_file = "D:/add_page/js/%s.js" % (self.var_entity_name)
        ####################---- 项目目录区域
        project_dir = "D:/Users/Desktop/Projects/java/vifi_trunk/vifiwebmin/"

        self.ctrl_file = project_dir + "src/net/eoutech/webmin/vifi/ctrl/%sCtrl.java" % (self.simp_entity_name)
        self.service_file = project_dir + "src/net/eoutech/webmin/vifi/service/%sService.java" % (self.simp_entity_name)
        self.dao_file = project_dir + "src/net/eoutech/webmin/vifi/dao/%sDao.java" % (self.simp_entity_name)
        self.entity_file = project_dir + "src/net/eoutech/webmin/commons/entity/%s.java" % (self.tb_entity_name)

        self.i18n_file = project_dir + "src/messages_zh_CN.properties"
        self.routejs_file = project_dir + "WebContent/page/frame/js/route.config.js"

        self.js_file = project_dir + "WebContent/page/vifi/js/%s.js" % (self.var_entity_name)

    # 创建ctrl.java
    def add_ctrl_class(self):
        string = template("""
        package net.eoutech.webmin.vifi.ctrl;

        import com.frame.commons.annotation.CommonTabCtrlInit;
        import com.frame.ctrl.FrameBaseCtrl;
        import net.eoutech.webmin.commons.entity.${self.tb_entity_name};
        import net.eoutech.webmin.vifi.service.${self.simp_entity_name}Service;
        import org.springframework.beans.factory.annotation.Autowired;
        import org.springframework.stereotype.Controller;
        import org.springframework.web.bind.annotation.RequestMapping;

        @Controller
        @RequestMapping( "${self.resource_url}" )
        @CommonTabCtrlInit( resource = "${self.resource_name}" )
        public class ${self.simp_entity_name}Ctrl extends FrameBaseCtrl< ${self.tb_entity_name} > {
            ${self.simp_entity_name}Service ${self.var_entity_name}Service;
            @Autowired
            public void setCfrmBaseService( ${self.simp_entity_name}Service commonTabService ) {
                this.frameBaseService = ${self.var_entity_name}Service = commonTabService;
            }

        }
       """, dict(globals(), **vars()))
        # 去除因为代码格式所弄的空格....个数自己
        string = CommonUtils.line_space_add_sub(string, -8)

        CommonUtils.write_text(self.ctrl_file, string)

        print("add %s ,file:%s ok~!" % (self.tb_entity_name, self.ctrl_file))

    # 创建service.java
    def add_service_class(self):
        string = template("""
        package net.eoutech.webmin.vifi.service;

        import com.frame.commons.utils.UserUtils;
        import com.frame.service.FrameBaseService;
        import net.eoutech.webmin.commons.entity.${self.tb_entity_name};
        import net.eoutech.webmin.vifi.dao.${self.simp_entity_name}Dao;
        import org.springframework.beans.factory.annotation.Autowired;
        import org.springframework.stereotype.Service;
        import java.util.Date;
        import java.util.List;

        @Service
        public class ${self.simp_entity_name}Service extends FrameBaseService<${self.tb_entity_name}> {

            @Autowired
            ${self.simp_entity_name}Dao ${self.var_entity_name}Dao;

            @Override
            public ${self.tb_entity_name} save(${self.tb_entity_name} ${self.var_entity_name}, boolean isEdit, List<String> idList) {

                // ${self.var_entity_name}.setMdfTm(new Date());
                // ${self.var_entity_name}.setMdfBy(UserUtils.getUserName());
                // if (!isEdit) {
                //     ${self.var_entity_name}.setCrtBy(${self.var_entity_name}.getMdfBy());
                //     ${self.var_entity_name}.setCrtTm(${self.var_entity_name}.getMdfTm());
                // }

                return super.save(${self.var_entity_name}, isEdit, idList);
            }

        }

       """, dict(globals(), **vars()))
        # 去除因为代码格式所弄的空格....个数自己
        string = CommonUtils.line_space_add_sub(string, -8)

        CommonUtils.write_text(self.service_file, string)
        print("add %s ,file:%s ok~!" % (self.tb_entity_name, self.service_file))

    # 创建dao.java
    def add_dao_class(self):
        string = template("""
        package net.eoutech.webmin.vifi.dao;

        import com.frame.dao.FrameBaseDao;
        import org.springframework.stereotype.Component;

        @Component
        public class ${self.simp_entity_name}Dao extends FrameBaseDao {


        }

       """, dict(globals(), **vars()))
        # 去除因为代码格式所弄的空格....个数自己
        string = CommonUtils.line_space_add_sub(string, -8)

        CommonUtils.write_text(self.dao_file, string)
        print("add %s ,file:%s ok~!" % (self.tb_entity_name, self.dao_file))

    # 国际化配置文件
    def i18n_cfg(self):
        # 菜单配置
        cfg_file = CommonUtils.read_text(self.i18n_file)
        cfg_file = cfg_file.replace("menu.vifias=VPX", "menu.%s=%s\nmenu.vifias=VPX" % (self.resource_name, self.simp_entity_name))
        # 字段配置
        from src.mytools.vifiadmin_tools.tb2i18n_cfg import tb2i18n_cfg
        i18n_val = "\n\n\n#tables:%s\n" % (self.tb_name) + tb2i18n_cfg(self.tb_name)
        cfg_file += i18n_val

        CommonUtils.write_text(self.i18n_file, cfg_file)
        print(self.tb_name + "i18n cfg OK!")

    #  js 文件
    def crt_js_file(self):
        from src.mytools.vifiadmin_tools.tb2ngRouteCfg import tb2ng_route_cfg
        view_cfg = tb2ng_route_cfg(self.tb_name)
        view_cfg = CommonUtils.line_space_add_sub(view_cfg, 8)
        string = template("""
        var appModule = require("appModule");
        var Utils = require("commonUtils");
        var AngularBaseCtrl = require("frameAdminBase");

        appModule.controller("${self.var_entity_name}Ctrl", ["$scope", "$rootScope", function ($scope, $rootScope) {
            var viewCfg = {
                currentUri: "${self.resource_url}",
                fields: ${view_cfg}
            };
            //call模拟 继承 AngularBaseCtrl父类
            AngularBaseCtrl.call(this, $scope, $rootScope, viewCfg);

        }]);
         """, dict(globals(), **vars()))

        # 去除因为代码格式所弄的空格....个数自己
        string = CommonUtils.line_space_add_sub(string, -8)

        CommonUtils.write_text(self.js_file, string)
        print(self.tb_name + " js OK!")

    #  route.config.js 路由配置
    def js_route_cfg(self):
        FLAG = "var routeCfg = ["
        routejs = CommonUtils.read_text(self.routejs_file)

        routejs = 'require( "vifi/%s" );\n%s' % (self.var_entity_name, routejs)
        route_arr = routejs.split(FLAG)
        route_arr.insert(1, FLAG)
        route_arr.insert(2, '\n    {ctrl: "%sCtrl", path: "%s"},' % (self.var_entity_name, self.resource_url))

        CommonUtils.write_text(self.routejs_file, "".join(route_arr))
        print(self.tb_name + " routejs_file OK!")  # route.config.js 路由配置

    #  add_sql_resource
    def add_sql_resource(self):
        date_time = "2015-11-11 11:20:27"

        @query(sql="SELECT max(tbCfrmResource.menu) max_menu FROM tbCfrmResource where menu like '3-%'")
        def get_menu_inx(datas):
            max_menu = datas[0]["max_menu"]
            max_menu_arr = max_menu.split("-")

            cur_inx = int(max_menu_arr[1]) + 1
            max_menu_arr[1] = "-"
            max_menu_arr.append(str(cur_inx))
            print(max_menu_arr)
            return "".join(max_menu_arr)

        @query(qry_type="update")
        def add_resource(cur):
            sql = "INSERT INTO `tbCfrmResource` (`keyResourceId`, `name`, `menu`, `remarks`, `createdBy`, `createdTime`, `modifiedBy`, `modifiedTime`) " + \
                  "VALUES ('%s', '%s', '%s', '0|1|0', '_EUROOT', '%s', '_EUROOT', '%s');" % (
                      self.resource_url, self.resource_name, get_menu_inx(), date_time, date_time)
            cur.execute(sql)

        add_resource()

    #  crt entity
    def add_java_entity(self):
        from src.mytools.vifiadmin_tools.tb2entity import tb2java_entity
        entity_v = tb2java_entity(self.tb_name)
        CommonUtils.write_text(self.entity_file, entity_v)

    ###################################################################



    # 创建所有实体
    @staticmethod
    def crt_all_entity():
        all_tbs = AddPage.get_all_webmin_tb()
        [AddPage(tb_name).add_java_entity() for tb_name in all_tbs]

    # 获得数据库中所有webmin的表,(排除 frame框架表)
    @staticmethod
    @query(sql="show tables")
    def get_all_webmin_tb(datas):
        return [data["Tables_in_UUWIFI"] for data in datas if not data["Tables_in_UUWIFI"].__contains__("tbCfrm")]

    # 获得需要创建的表
    @staticmethod
    def get_need_crt_tb():
        # 已有的表名
        exclude_tb = ["tb" + f_name.replace("Ctrl.java", "") for f_name in os.listdir(AddPage.ctrl_path)]
        all_tbs = AddPage.get_all_webmin_tb()
        need_crt_tbs = [tb for tb in all_tbs if not exclude_tb.__contains__(tb)]
        return need_crt_tbs

    # 创建表
    @staticmethod
    def crt_page(tb_name):
        addPage = AddPage(tb_name)
        addPage.add_ctrl_class()
        addPage.add_service_class()
        addPage.add_dao_class()
        addPage.add_java_entity()

        addPage.i18n_cfg()
        addPage.crt_js_file()
        addPage.js_route_cfg()
        addPage.add_sql_resource()
        print("%d-------------------------------------------------------\n" % (AddPage.tb_index))
        AddPage.tb_index += 1
        return 0

    # 创建剩下的所需表
    @staticmethod
    def crt_need_page():
        need_crt_tbs = AddPage.get_need_crt_tb()
        print("create : ")
        print(need_crt_tbs)

        return [AddPage.crt_page(tb_name) for tb_name in need_crt_tbs]

    # 创建剩下的所有表
    @staticmethod
    def crt_all_page():
        return [AddPage.crt_page(tb_name) for tb_name in AddPage.get_all_webmin_tb()]





