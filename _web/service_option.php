<?php

$hostapd = shell_exec("service hostapd status | awk '/Active:.+\)/{print $2,$3}' || echo Unknown");
$isc_dhcp_service = shell_exec("service isc-dhcp-server status | awk '/Active:.+\)/{print $2,$3}' || echo Unknown");



echo <<<_END

<h2 class="sub-title">Services</h2>
<table id="service-option"  class="setting-class">
	<tr>
		<td class="td-title"></td>
		<td class="td-data">$hostapd</td>
	</tr>
	<tr>
		<td class="td-title"></td>
		<td>
			<select id="hostpad-service-option-select">
				<option selected value="start">Activate Service</option>
				<option value="stop">Stop Service</option>
				<option value="restart">Restart Service</option>
			</select>
		</td>
	</tr>

	<tr>
		<td class="td-title"></td>
		<td class="td-data">$isc_dhcp_service</td>
	</tr>
	<tr>
		<td class="td-title"></td>
		<td>
			<select id="isc-dhcp-server-service-option-select">
				<option selected value="start">Activate Service</option>
				<option value="stop">Stop Service</option>
				<option value="restart">Restart Service</option>
			</select>
		</td>
	</tr>
	<tr class="td-button">
		<td><button id="service-option-submit">Submit</button></td>
	</tr>
</table>
_END
?>

