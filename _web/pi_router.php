<?php

$status = shell_exec("service hostapd status | awk '/Active:.+\)/{print $2,$3}' || echo Unknown");
$ssid = shell_exec("iw dev wlan_LAN info | awk '/ssid/{print $2}'");

$wirelessIP = shell_exec("ifconfig wlan_LAN | egrep '(inet)\b' | awk '{print $2}'");
$wirelessMac = shell_exec("iw dev wlan_LAN info | awk '/addr/{print $2}'");


echo <<<_END
<h1 id="page-title">Rasp-Pi</h1>
<article id="content">
	<h2 class="sub-title">Wireless AP</h2>
	<table>
		<tr>
			<td class="td-title">Status</td>
			<td class="td-data">$status</td>
		</tr>
		<tr>
			<td class="td-title">SSID</td>
			<td class="td-data">$ssid</td>
		</tr>
		<tr>
			<td class="td-title">IP</td>
			<td class="td-data">$wirelessIP</td>
		</tr>
		<tr>
			<td class="td-title">MAC</td>
			<td class="td-data">$wirelessMac</td>
		</tr>
	</table>
	<h2 class="sub-title">DHCP Clients</h2>
	<img id="dhcp-client-ajax-loader" src="./image/oval.svg">
</article>
_END

?>