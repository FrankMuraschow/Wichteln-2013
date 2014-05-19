<?php

class conf {

	public function __construct() {

	}

	public function getDataBaseInformation() {
		$info = array('dbHost' => '', 'port' => '', 'dbName' => '', 'user' => '', 'password' => '');
		return $info;
	}

}
?>