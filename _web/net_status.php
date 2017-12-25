<?php


# WAN #

$public_ip = shell_exec('curl http://ipinfo.io/ip');

# gateway info #

$gateway_status = shell_exec("ping -w1 -c1 `route | awk '/UG/{print $2}'` > /dev/null 2>&1 && echo Active || echo Unknown ");
$gateway_ip = shell_exec("route | awk '/UG/{print $2}' ");
$gateway_mac = shell_exec("arp `route | awk '/UG/{print $2}'` | awk '/:/{print $3}' ");


# raspberry-pi info #
$pi_status = shell_exec("ping -c1 -w1 $(ifconfig $(route | awk '/UG/{print $8}') | egrep '(inet)\b' | awk '{print $2}') > /dev/null 2>&1 && echo Active || echo Unknown ");
$pi_network_iface = shell_exec("route | awk '/UG/{print $8}'");
$pi_ip = shell_exec("ifconfig $(route | awk '/UG/{print $8}') | egrep '(inet)\b' | awk '{print $2}'");
$pi_mac = shell_exec("ifconfig `route | awk '/UG/{print $8}'` | awk '/Ethernet/{print $2}'");


echo <<<_END
<h1 id="page-title">Network</h1>
<article id="content">
	<h2 class="sub-title">WAN</h2>
	<table>
		<tr>
			<td class="td-title">Public IP</td>
			<td class="td-data">$public_ip</td>
		</tr>
	</table>

	<h2 class="sub-title">Gateway Network Interface</h2>
	<table>
		<tr>
			<td class="td-title">Network Status</td>
			<td class="td-data">$gateway_status</td>
		</tr>
		<tr>
			<td class="td-title">IP</td>
			<td class="td-data">$gateway_ip</td>
		</tr>
		<tr>
			<td class="td-title">MAC</td>
			<td class="td-data">$gateway_mac</td>
		</tr>
	</table>
	
	<h2 class="sub-title">Rasp-Pi Network Interface</h2>
	<table>
		<tr>
			<td class="td-title">Network Status</td>
			<td class="td-data">$pi_status</td>
		</tr>
		<tr>
			<td class="td-title">Default Interface</td>
			<td class="td-data">$pi_network_iface</td>
		</tr>
		<tr>
			<td class="td-title">IP</td>
			<td class="td-data">$pi_ip</td>
		</tr>
		<tr>
			<td class="td-title">MAC</td>
			<td class="td-data">$pi_mac</td>
		</tr>
	</table>
</article>
_END

?>
