<?php
function __autoload($class_name) {
	require_once $class_name . '.php';
}

$email = $_GET['email'];
$hash = $_GET['confirmationHash'];

$db = new dbConnectController();
$result = $db -> confirmEmail($email, $hash);
$confirmed = $result -> num_rows > 0;

header('Location: http://wichteln2013.netznova.de?confirmed=' . $confirmed);
?>