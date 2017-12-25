<?php
session_start();
$current = trim(shell_exec("cat /etc/hostapd/hostapd.conf | awk '/ignore/{print}'"));

function sanitize_input($unsterilized_option) {
   $unsterilized_option = str_replace(' ', '-', $unsterilized_option); 
   return preg_replace('/[^A-Za-z0-9\-]/', '', $unsterilized_option); 
}

$input =  sanitize_input($_POST['broadcastOption']);

$newOption = $current;
if( $input == "broadcasting"){
	$newOption =  "ignore_broadcast_ssid=0";
}
else if( $input == "hide"){
	$newOption = "ignore_broadcast_ssid=2";
}


$msg = shell_exec("sudo sed -i -e 's/$current/$newOption/g' /etc/hostapd/hostapd.conf && sudo service hostapd restart && sleep 3 && sudo service hostapd restart && echo option changed. || echo SSID Broadcast option change failed , please refresh the page and try again." );

echo "<table><tr><td>$msg</td></tr></table>";

?>
