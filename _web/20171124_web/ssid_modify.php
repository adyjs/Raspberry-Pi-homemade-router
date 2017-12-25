<?php

$currentSSID = shell_exec("iw dev wlan_built_in info | awk '/ssid/{print $2}'");

echo <<<_END
<h2 class="sub-title">Modify SSID</h2>
<table id="modify-ssid-table" class="setting-class">
	<tr>
		<td class="td-title"></td>
		<td class="td-data">$currentSSID</td>
	</tr>
	<tr>
		<td class="td-title"></td>
		<td class="td-data"><input type="text" id="modified-ssid" maxlength="16" placeholder="ex : my-wifi-123"></td>
	</tr>
	<tr class="td-button">
		<td><button id="modify-ssid-submit">Submit</button></td>
	</tr>
</table>
_END
?>
