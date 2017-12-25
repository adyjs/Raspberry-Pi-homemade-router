<?php
session_start();

function sanitize_input($unsterilized_ssid) {
   $unsterilized_ssid = str_replace(' ', '-', $unsterilized_ssid); 
   return preg_replace('/[^A-Za-z0-9\-]/', '', $unsterilized_ssid); 
}

$hostapdOption = sanitize_input($_POST['hostapd']);
$iscdhcpserverOption = sanitize_input($_POST['iscdhcpserver']);

shell_exec("sudo service hostapd $hostapdOption ; sudo service isc-dhcp-server $iscdhcpserverOption");

$msgHostapd = shell_exec("service hostapd status | awk '/Active:.+\)/{print $2,$3}' || echo Unknown");
$msgIscdhcpserver = shell_exec("service isc-dhcp-server status | awk '/Active:.+\)/{print $2,$3}' || echo Unknown");

echo <<<_END
<table id="service-option"  class="setting-class">
	<tr>
		<td>Hostapd</td>
		<td>$msgHostapd</td>
	</tr>
	<tr>
		<td>ISC-DHCP-Server</td>
		<td>$msgIscdhcpserver</td>
	</tr>
</table>
_END

?>