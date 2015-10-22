from urllib import request
from lib.bottle import template
string = """
<th>
	<label style="margin-bottom: 0;"><input type="checkbox" ng-model="data.checkbok"><span class="text"></span></label>
</th>
"""

rows=string.split("\n")

result="'+\n'".join(rows)
print(result)
