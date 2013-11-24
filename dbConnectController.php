<?php
function __autoload($class_name) {
	require_once $class_name . '.php';
}

if (isset($_POST['action']) && !empty($_POST['action'])) {
	$action = $_POST['action'];
	switch($action) {
		case 'checkMaster' :
			checkMaster($_POST['str']);
			break;
		case 'checkMasterPhaseTwo' :
			checkMasterPhaseTwo($_POST['str']);
			break;
		case 'confirmAdmin' :
			confirmAdmin($_POST['str']);
			break;
		case 'getUsers' :
			getUsers();
			break;
		case 'checkUser' :
			checkUser($_POST['str'], $_POST['pw']);
			break;
		case 'checkUserPhaseTwo' :
			checkUserPhaseTwo($_POST['str'], $_POST['pw']);
			break;
		case 'confirmParticipation' :
			confirmParticipation($_POST['email'], $_POST['confirmationHash']);
			break;
		case 'confirmRegistration' :
			confirmRegistration($_POST['email'], $_POST['confirmationHash']);
			break;
		case 'getLuckyPerson' :
			getLuckyPerson($_POST['str']);
			break;
		case 'registerUser' :
			registerUser($_POST['email'], $_POST['nickName']);
			break;
		case 'resendMail' :
			resendMail($_POST['email']);
			break;
		case 'sendMail' :
			sendMail($_POST['str']);
			break;
		case 'sendParticipationMails' :
			sendParticipationMails();
			break;
		case 'sendWichtelMails' :
			sendWichtelMails();
			break;
		case 'validateEmail' :
			validateEmail($_POST['str']);
			break;
		case 'validateNickName' :
			validateNickName($_POST['str']);
			break;
	}
}
?>

<?php
class dbConnectController {

	private $connectionProperties;
	private $connection;
	private $log;
	private $mailer;
	public function __construct() {
		$this -> log = new Logging();
		$this -> log -> lfile("log");

		$config = new conf();
		$result = $config -> getDataBaseInformation();
		$this -> connectionProperties = $result;

		$this -> connection = new mysqli($this -> connectionProperties['dbHost'], $this -> connectionProperties['user'], $this -> connectionProperties['password'], $this -> connectionProperties['dbName']);

		if (mysqli_connect_errno() == 0) {
		} else {
			echo 'Die Datenbank konnte nicht erreicht werden. Folgender Fehler trat auf: <span class="hinweis">' . mysqli_connect_errno() . ' : ' . mysqli_connect_error() . '</span>';
		}
	}

	public function getLog() {
		return $this -> log;
	}

	public function sendConfirmationMail($username) {
		require_once ('./PHPMailer_5.2.0/class.phpmailer.php');

		$result = $this -> getEmailAddress($username);
		while ($row = $result -> fetch_assoc()) {
			$firstname = $row['firstname'];
			$email = $row['email'];
			$confirmationHash = $row['confirmationHash'];

			$confirmUrl = 'http://wichteln2013.netznova.de?confirmation=1&email=' . $email . '&confirmationHash=' . $confirmationHash;

			$mail = new PHPMailer();
			$mail -> SetFrom('wichteln@netznova.de', 'Weihnachtsmann Muri');
			$mail -> Subject = "Wichteln 2013 - Bestaetigungslink";
			$mail -> AltBody = $confirmUrl;

			$mail -> AddAddress($email, $realName);

			$body = file_get_contents("assets/mail/confirmationMail.php");
			$body = eregi_replace("[\]", '', $body);
			$body = ereg_replace("username", $firstname, $body);
			$body = ereg_replace("confirmUrl", $confirmUrl, $body);

			$mail -> MsgHTML($body);
			$mail -> Send();
		}
	}

	public function sendParticipationMail($username) {
		require_once ('./PHPMailer_5.2.0/class.phpmailer.php');

		$result = $this -> getEmailAddress($username);
		while ($row = $result -> fetch_assoc()) {
			$firstname = $row['firstname'];
			$email = $row['email'];
			$confirmationHash = $row['confirmationHash'];

			$confirmUrl = 'http://wichteln2013.netznova.de?participation=1&email=' . $email . '&confirmationHash=' . $confirmationHash;

			$mail = new PHPMailer();
			$mail -> SetFrom('wichteln@netznova.de', 'Weihnachtsmann Muri');
			$mail -> Subject = "Wichteln 2013 - Teilnahmebestaetigung";
			$mail -> AltBody = $confirmUrl;

			$mail -> AddAddress($email, $realName);

			$body = file_get_contents("assets/mail/participationMail.php");
			$body = eregi_replace("[\]", '', $body);
			$body = ereg_replace("username", $firstname, $body);
			$body = ereg_replace("confirmUrl", $confirmUrl, $body);

			$mail -> MsgHTML($body);
			$mail -> Send();
		}
	}

	public function sendMail($username) {

		require_once ('./PHPMailer_5.2.0/class.phpmailer.php');
		$luckyPerson = $this -> getLuckyPerson($username);

		$result = $this -> getEmailAddress($username);
		while ($row = $result -> fetch_assoc()) {
			$firstname = $row['firstname'];
			$emaiaddress = $row['email'];

			$mail = new PHPMailer();
			$mail -> SetFrom('wichteln@netznova.de', 'Weihnachtsmann Muri');
			$mail -> Subject = "Neues vom Wichteln 2013!";
			$mail -> AltBody = "Dein Wichtel ist: " . $luckyPerson;

			$mail -> AddAddress($emaiaddress, $realName);

			$body = file_get_contents("assets/mail/content_congrats.php");
			$body = eregi_replace("[\]", '', $body);
			$body = ereg_replace("username", $firstname, $body);
			$body = ereg_replace("luckyPerson", $luckyPerson, $body);

			$mail -> MsgHTML($body);
			$mail -> Send();
		}
	}

	/**
	 * Constructs a new PDO Object and returns it
	 * @param string $name
	 * @return Array connection to the database
	 */
	public function getUsers() {
		$query = "SELECT * FROM participants WHERE willParticipate = 0 ORDER BY firstname";
		$result = $this -> connection -> query($query);
		return $result;
	}

	public function getUsersPhaseTwo() {
		$query = "SELECT * FROM participants WHERE willParticipate = 1 ORDER BY firstname";
		$result = $this -> connection -> query($query);
		return $result;
	}

	public function getParticipants() {
		$query = "SELECT userid, username FROM participants WHERE willParticipate = 1";
		$result = $this -> connection -> query($query);
		return $result;
	}

	public function closeConnection() {
		$this -> connection -> close();
	}

	public function checkUser($str, $pw) {
		$query = "SELECT * FROM participants WHERE username = '$str' AND password = '" . md5($pw) . "'";
		$result = $this -> connection -> query($query);
		return $result;
	}

	public function checkNickName($str) {
		$str = strtolower($str);
		$query = "SELECT * FROM participants WHERE username = '$str'";
		$result = $this -> connection -> query($query);
		return $result;
	}

	public function checkEmail($str) {
		$str = strtolower($str);
		$query = "SELECT * FROM participants WHERE email = '$str'";
		$result = $this -> connection -> query($query);
		return $result;
	}

	public function randomizeWichtel() {
		$participants = $this -> getParticipants();
		$userids = array();
		$i = 0;
		$wichtelIds;
		$user_one = "";
		$user_two = "";

		while ($row = mysqli_fetch_row($participants)) {
			$userids[$i] = $row[0];
			$i++;
		}

		$usedIds = array();
		$otherIds = $userids;

		shuffle($userids);

		for ($j = 0; $j < count($userids); $j++) {
			$user_one = $userids[$j];
			$user_two = $otherIds[$j];

			if ($user_one == $user_two) {
				shuffle($userids);
				$j--;
			} else if (in_array($user_one, $usedIds)) {
				shuffle($userids);
				$j--;
			} else {
				$this -> setWichtel($user_one, $user_two);
				array_push($usedIds, $userids[$j]);
			}
		}
	}

	public function setWichtel($one, $two) {
		$query = "UPDATE  participants SET  chosePerson =  '$two' WHERE userid = $one";
		$result = $this -> connection -> query($query);
		$query = "UPDATE  participants SET  pickedBy =  '$one' WHERE userid = $two";
		$result = $this -> connection -> query($query);
	}

	public function getLuckyPerson($username) {
		$query = "SELECT chosePerson FROM participants WHERE username = '$username'";
		$result = $this -> connection -> query($query);

		while ($row = $result -> fetch_assoc()) {
			$choseId = $row['chosePerson'];
		}

		$query = "SELECT firstname, lastname FROM participants WHERE userid = $choseId";
		$result = $this -> connection -> query($query);

		while ($row = $result -> fetch_assoc()) {
			$luckyPerson = $row['firstname'] . " " . $row['lastname'];
		}

		return $luckyPerson;
	}

	public function setParticipant($str) {
		$query = "UPDATE  participants SET  willParticipate =  '1' WHERE  username = '$str'";
		$result = $this -> connection -> query($query);
		return $result;
	}

	public function getEmailAddress($str) {
		$str = strtolower($str);
		$query = "SELECT firstname, email, confirmationHash FROM participants WHERE username = '$str'";
		$result = $this -> connection -> query($query);
		return $result;
	}

	public function setGotEmail($str) {
		$query = "UPDATE  participants SET  gotEmail =  '1' WHERE  username = '$str'";
		$result = $this -> connection -> query($query);
	}

	public function registerUser($nickName, $email, $confirmationHash) {
		$nickLow = strtolower($nickName);
		$email = strtolower($email);
		$query = "INSERT INTO `participants` (`firstname`, `lastname`, `username`, `password`, `chosePerson`, `pickedBy`, `userid`, `willParticipate`, `email`, `gotEmail`, `confirmationHash`) VALUES ('$nickName', '', '$nickLow', '', '0', '0', NULL, '0', '$email', '0', '$confirmationHash')";
		$result = $this -> connection -> query($query);
		return $result;
	}

	public function confirmRegistration($email, $confirmationHash) {
		$email = strtolower($email);
		$query = "SELECT username, gotEmail FROM participants WHERE email = '$email' AND confirmationHash = '$confirmationHash'";
		$result = $this -> connection -> query($query);
		return $result;
	}

	public function confirmParticipation($email, $confirmationHash) {
		$email = strtolower($email);
		$query = "SELECT username, gotEmail FROM participants WHERE email = '$email' AND confirmationHash = '$confirmationHash' AND gotEmail = '1'";
		$result = $this -> connection -> query($query);
		return $result;
	}

	public function getRegisteredUsers() {
		$query = "SELECT username FROM participants WHERE gotEmail = '1'";
		$result = $this -> connection -> query($query);
		return $result;
	}

	public function getUserByEmail($email) {
		$email = strtolower($email);
		$query = "SELECT username, gotEmail, willParticipate FROM participants WHERE email = '$email'";
		$result = $this -> connection -> query($query);
		return $result;
	}

}

function registerUser($email, $nickName) {
	$db = new dbConnectController();
	$email = filter_var($email, FILTER_SANITIZE_EMAIL);
	$nickName = filter_var($nickName, FILTER_SANITIZE_STRING);
	$confirmationHash = generateRandomString();

	if ($email && $nickName) {
		$result = $db -> registerUser($nickName, $email, $confirmationHash);
		$db -> sendConfirmationMail($nickName);
	}

	$db -> closeConnection();
}

function generateRandomString($length = 32) {
	$characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	$randomString = '';
	for ($i = 0; $i < $length; $i++) {
		$randomString .= $characters[rand(0, strlen($characters) - 1)];
	}
	return $randomString;
}

function validateEmail($str) {
	if (filter_var($str, FILTER_VALIDATE_EMAIL)) {
		if (checkEmail($str)) {
			echo '-1';
		} else {
			echo filter_var($str, FILTER_VALIDATE_EMAIL);
		}
	}
}

function confirmParticipation($email, $confirmationHash) {
	if (checkEmail($email)) {
		$db = new dbConnectController();
		$result = $db -> confirmParticipation($email, $confirmationHash);

		if (!$result) {
			echo 'Fehler bei der Teilnahme';
		} else {
			while ($row = $result -> fetch_assoc()) {
				$db -> setParticipant($row['username']);
			}
		}

		$db -> closeConnection();
	} else {
		echo 'E-Mail Adresse nicht gefunden';
	}
}

function confirmRegistration($email, $confirmationHash) {
	if (checkEmail($email)) {
		$db = new dbConnectController();
		$result = $db -> confirmRegistration($email, $confirmationHash);

		if (!$result) {
			echo 'Fehler bei der Registrierung';
		} else {
			while ($row = $result -> fetch_assoc()) {
				if ($row['gotEmail']) {
					echo 'E-Mail wurde schon bestätigt :)';
				} else {
					$db -> setGotEmail($row['username']);
				}
			}
		}

		$db -> closeConnection();
	} else {
		echo 'E-Mail Adresse nicht gefunden';
	}
}

function validateNickName($str) {
	if (checkNickName($str)) {
		echo '-1';
	} else {
		echo filter_var($str, FILTER_SANITIZE_STRING);
	}
}

function confirmAdmin($str) {
	if (md5($str) == "831fb765a0c97f9463fdbe9214a74775") {
		echo "<table><tr><td colspan='2' class='leftAlign'><input type='button' value='Send Participation Mails' id='participationMail' class='midInput' /></td></tr>";
		echo "<tr><td colspan='2' class='leftAlign'><input type='button' value='Send Wichtel Mails' id='wichtelMails' class='midInput' /></td></tr>";
		echo "<tr><td><input type='text' id='resendEmailAddress' class='midInput' /></td><td><input type='button' value='Resend confirmation mail' id='resendMail' class='midInput' /></td></tr>";
	}
}

function checkMaster($str) {
	if (md5($str) == "78a575be3a8d26aa990a2685069da168") {
		echo "<form id='whoAreYouForm' class='leftMargin'>";
		echo "<table>";
		echo "<tr><td colspan='2'>Spitzname</td></tr>";
		echo "<tr><td><input type='text' id='nickName' class='midInput bottomMargin'></td><td><div class='checkEmailIcon bottomMargin' id='nameCheck' /></td></tr>";
		echo "<tr><td colspan='2'>E-Mail Adresse</td></tr>";
		echo "<tr><td><input type='text' id='firstEmail' class='midInput bottomMargin'></td><td><div class='checkEmailIcon bottomMargin' id='emailCheck' /></td></tr>";
		echo "<tr><td colspan='2'>E-Mail Adresse wiederholen</td></tr>";
		echo "<tr><td><input type='text' id='secondEmail' class='midInput bottomMargin'></td><td><div class='checkEmailIcon bottomMargin' id='emailCheckEquality' /></td></tr>";
		echo "<tr><td colspan='2'>&nbsp;</td></tr>";
		echo "<tr><td><div id='sendRegistration' class='centerAlign midInput smallButton disabled fastTransition bottomMargin'>Als Wichtel registrieren</div></td><td><div class='checkEmailIcon bottomMargin' id='registerCheck' /></td></tr>";
		echo "</table>";
		echo "</form>";
	}
}

function checkNickName($str) {
	$db = new dbConnectController();
	$result = $db -> checkNickName($str);
	$db -> closeConnection();
	return ($result -> num_rows > 0);
}

function checkEmail($str) {
	$db = new dbConnectController();
	$result = $db -> checkEmail($str);
	$db -> closeConnection();
	return ($result -> num_rows > 0);
}

function checkUser($str, $pw) {
	$db = new dbConnectController();
	$result = $db -> checkUser($str, $pw);
	if ($result -> num_rows > 0) {
		setParticipant($str);
		echo "<b>Hey " . $str . "! </b><br />Du nimmst am Wichteln 2012 teil! &Uuml;belst krass!<br />Los geht es am <i>Los geht's ab Freitag, den 14.12.2012</i>.<br />Dann loggst du dich mit deinem Password ein und ziehst deinen Wichtel. Man sieht sich!";
	}

	$db -> closeConnection();
}

function checkUserPhaseTwo($str, $pw) {
	$db = new dbConnectController();
	$result = $db -> checkUserPhaseTwo($str, $pw);
	if ($result -> num_rows > 0) {
		$luckyPerson = $db -> getLuckyPerson($str);
		echo "<center> Du hast <b>" . $luckyPerson . "</b> gezogen!</center>";
		echo "<p style='margin: 2px 0 0 0; font-size: 9pt;'>" . $luckyPerson . " kann sich gl&uuml;cklich sch&auml;tzen von dir gezogen worden zu sein! <br />";
		echo "Denn nur du weisst was " . $luckyPerson . "s Herz wirklich begehrt! <br />";
		echo "Selbst ich als Maschine finde das beneidenswert! - <span class='GLaDOS speaking'> LOVE ME! </span><br />";
		echo "<br /><i>Weitere Informationen stehen in der E-Mail vom Weihnachtsmann in euerm Postfach!</i> <span id='noEmail' class='" . $str . "'>Solltest du keine E-Mail erhalten haben, dr&uuml;cke hier.</span></p>";

		while ($row = $result -> fetch_assoc()) {
			if ($row['gotEmail'] == 0) {
				$db -> sendMail($str);
				$db -> setGotEmail($str);
			}
		}
	}

	$db -> closeConnection();
}

function setParticipant($str) {
	$db = new dbConnectController();
	$db -> setParticipant($str);
	$db -> closeConnection();
}

function resendMail($email) {
	$db = new dbConnectController();

	$result = $db -> getUserByEmail($email);

	while ($row = $result -> fetch_assoc()) {
		if (!$row['gotEmail']) {
			$db -> sendConfirmationMail($row['username']);
		} elseif (!$row['willParticipate']) {
			$db -> sendParticipationMail($row['username']);
		} else {
			$db -> sendMail($row['username']);
		}
	}
	$db -> closeConnection();
}

function sendMail($str) {
	$db = new dbConnectController();
	$db -> sendMail($str);
	$db -> closeConnection();
}

function sendParticipationMails() {
	$db = new dbConnectController();
	$result = $db -> getRegisteredUsers();

	while ($row = $result -> fetch_assoc()) {
		$db -> sendParticipationMail($row['username']);
	}
	$db -> closeConnection();
}

function sendWichtelMails() {
	$db = new dbConnectController();
	$db -> randomizeWichtel();
	$result = $db -> getParticipants();

	while ($row = $result -> fetch_assoc()) {
		$db -> sendMail($row['username']);
	}
	$db -> closeConnection();
}
?>