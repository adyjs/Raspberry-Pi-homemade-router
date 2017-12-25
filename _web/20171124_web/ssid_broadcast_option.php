<?php

$ignoreBroadcastSSID = trim(shell_exec("cat /etc/hostapd/hostapd.conf | awk '/ignore/{print}'"));

$optionNumber = substr($ignoreBroadcastSSID, ((int)strlen($ignoreBroadcastSSID))-1);

$current = "Unknown";

if($optionNumber === "0"){
	$current = "Broadcasting";
}
else if($optionNumber === "1"){
	$current = "Empty (Unconnectable)";
}
else if($optionNumber === "2"){
	$current = "Hidden (Connectable)";
}

/*
ignore_broadcast_ssid=0	SSID 廣播
ignore_broadcast_ssid=1 SSID 空白且無法連接
ignore_broadcast_ssid=2 SSID 隱藏可連接
*/

echo <<<_END

<h2 class="sub-title">SSID Broadcasting Option</h2>
<table id="ssid-broadcasting-option" class="setting-class">
	<tr>
		<td class="td-title">Current SSID Broadcasting Status</td>
		<td class="td-data">$current</td>
	</tr>
	<tr>
		<td class="td-title">SSID Broadcasting Option </td>
		<td class="td-data">
			<select id="broadcast-option-select">
				<option selected value="broadcasting">Broadcast SSID</option>
				<option value="hide">Hide SSID</option>
			</select>
		</td>
	</tr>
	<tr class="td-button">
		<td><button id="ssid-broadcasting-option-submit">Submit</button></td>
	</tr>
</table>
_END
?>
