<?php
require_once ('FirePHP.class.php');
ob_start();
?>
<!DOCTYPE html>
<html>
	<?php
	include_once 'inc/inc_header.php';
	?>
	<body>
		Enter Admin Password:
		<input type="text" id="adminPw" />
		<div class="smallButton" id="confirmAdmin">Send</div>
	</body>
</html>