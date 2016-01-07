from src.mytools.commons.utils.common_utils import *


def str2var(string,sign = '"'):
    rows = CommonUtils.reg_sub_ex("(%s)"%sign,lambda p,c:'\\'+c(1),string).split("\n")
    result = (sign+'+\n' + sign).join(rows)
    result = (sign+'%s' + sign) % (result)
    CommonUtils.clip(result)


def var2str(string,sign = '"'):
    result = CommonUtils.reg_sub_ex(' '+sign+'|\s{0,}'+sign+'\s\+', lambda p, c: "", string)
    CommonUtils.clip(result)


string = """


'<label class="control-label" ng-class="{\'col-sm-4\':viewCfg.isSplit,\'col-sm-3\':!viewCfg.isSplit}" >{{vc.title || vc.name }}:</label>' +
        '<div class="col-sm-8">' +
        '  <div ng-if="!form.isMultiEdit" ng-switch="vc.comType">' +
        '    <div ng-switch-when="select" class="form-control input-sm" style="padding:0;border:0">' +
        '          <div ng-my-select="form.copyData[vc.name],vc.comData,vc.name,isDisabledEdit(vc),vc.help||vc.title||vc.name"></div>' +
        '    </div>' +
        '    <div ng-switch-when="radio" class="input-sm " style="padding:0;border:0" ' +
        '           ng-my-radio="form.copyData[vc.name],vc.comData,vc.name,isDisabledEdit(vc)">' +
        '    </div>' +
        '    <div ng-switch-when="checkbox" class="input-sm " style="padding:0;border:0"' +
        '          ng-my-checkbox="form.copyData[vc.name],vc.comData,vc.name,isDisabledEdit(vc),vc.help||vc.title||vc.name">' +
        '    </div>' +
        '    <div ng-switch-when="area" class="input-sm " style="padding:0;border:0"' +
        '          ng-my-area="form.copyData[vc.name],vc.comData,vc.name,isDisabledEdit(vc),vc.help||vc.title||vc.name">' +
        '    </div>' +
        '    <input ng-switch-default class="form-control input-sm" type="text" name="{{vc.name}}" placeholder="{{vc.help || vc.title || vc.name}}"' +
        '           ng-click="vc.type==\'D\'&&laydate(form.copyData,vc.name)"' +
        '           ng-disabled="isDisabledEdit(vc)" ng-model="form.copyData[vc.name]" >' +
        '  </div>' +
        '   <ng-smarty-input ng-if="form.isMultiEdit && vc.mulEdit"/>' +
        '</div>'




"""

# str2var(string,"'")
var2str(string,"'")
