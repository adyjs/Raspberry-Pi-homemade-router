<?php
session_start();
$current_ssid = trim(shell_exec("cat /etc/hostapd/hostapd.conf | awk '/^ssid/{print}'"));
input_examine($_POST['ssid'] , $current_ssid);

function input_examine($unexamined_input , $current_ssid) {
	$trimed_input = trim($unexamined_input);
	if( $trimed_input === "" ){
		return res_msg("ERROR : \nThe input is empty ,\nPlease input SSID");
	}
	$no_space_between_input = str_replace(' ', '-', $trimed_input); 
	$no_special_char_input = "ssid=".preg_replace('/[^A-Za-z0-9\-]/', '', $no_space_between_input);

	modifySSID( $current_ssid , $no_special_char_input );
}

function modifySSID( $old , $new ){
	/*
	$msg = shell_exec("sudo sed -i -e 's/$old/$new/g' /etc/hostapd/hostapd.conf && sudo service hostapd restart && sleep 2 && sudo service hostapd restart && echo SSID has been modified. || echo SSID modify failed , please refresh the page and try again." );
	echo $msg;
	*/
	res_msg(shell_exec("sudo sed -i -e 's/$old/$new/g' /etc/hostapd/hostapd.conf && sudo service hostapd restart && sleep 2 && sudo service hostapd restart && echo SSID has been modified. || echo SSID modify failed , please try refresh this page \nor click the \"Service Process\" button and restart the services.\n\nSSID 更改失敗，請先刷新本頁面再重試一次，\n或點選上方服務程序的按鈕，重新啟動所有服務" ));
}


function res_msg($msg){
	echo "<table class=\"error-msg\"><tr><td>$msg</td></tr></table>";
}

?>
