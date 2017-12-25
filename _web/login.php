<?php
	session_start();
	require_once './admin.php';
	$salt_1 = 'raspberrypi3';
	$salt_2 = 'modelB';
	$salt_3 = 'router';
	$hashedKey = sha1($salt_1.$user.$salt_2.$pw.$salt_3);


	function sanitize_input($unsterilized_ssid) {
	   $unsterilized_ssid = str_replace(' ', '-', $unsterilized_ssid); 
	   return preg_replace('/[^A-Za-z0-9\-]/', '', $unsterilized_ssid); 
	}

	$inputUser = sanitize_input($_POST['user']);
	$inputPw = sanitize_input($_POST['pw']);
	$inputKey = sha1($salt_1.$inputUser.$salt_2.$inputPw.$salt_3);


	if( isset($_POST['login-submit']) && isset($_POST['user']) && isset($_POST['pw']) ){
		if( $inputKey === $hashedKey ){
			header('Location: ./admin_page.html');
			exit;
		}
		else{
			header('Location: ./index.html');
			exit;
		}
	}
	else{
		header('Location: ./index.html');
		exit;
	}

?>