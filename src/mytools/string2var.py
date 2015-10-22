string = """

<tr role="row" class="odd" ng-class="{active_tr:data.checkbok}" ng-repeat="data in view.page.contentList"
	    ng-dblclick="dblclickOpenDetails(data)" ng-click="clickAddActive(data,$event)"  ng-td-data >
	<th>
		<label style="margin-bottom: 0;" onclick="event.stopPropagation()"><input type="checkbox" ng-model="data.checkbok"><span class="text"></span></label>
	</th>
</tr>

"""

rows = string.split("\n")

result = "'+\n'".join(rows)
result = "'%s'" % (result)
print(result)
