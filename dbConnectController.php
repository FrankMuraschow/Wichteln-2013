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
		case 'getUsers' :
			getUsers();
			break;
		case 'checkUser' :
			checkUser($_POST['str'], $_POST['pw']);
			break;
		case 'checkUserPhaseTwo' :
			checkUserPhaseTwo($_POST['str'], $_POST['pw']);
			break;
		case 'getLuckyPerson' :
			getLuckyPerson($_POST['str']);
			break;
		case 'sendMail' :
			sendMail($_POST['str']);
			break;
		case 'validateEmail' :
			validateEmail($_POST['str']);
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

	public function sendMail($username) {

		require_once ('./PHPMailer_5.2.0/class.phpmailer.php');
		$luckyPerson = $this -> getLuckyPerson($username);

		$result = $this -> getEmailAddress($username);
		while ($row = $result -> fetch_assoc()) {
			$firstname = $row['firstname'];
			$emaiaddress = $row['email'];

			$mail = new PHPMailer();
			$mail -> SetFrom('weihnachtsmann@wichteln2012.netznova.de', 'Weihnachtsmann Muri');
			$mail -> Subject = "Neues vom Wichteln 2012!";
			$mail -> AltBody = "To view the message, please use an HTML compatible email viewer!";

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

	public function getUserIdsPhaseTwo() {
		$query = "SELECT userid FROM participants WHERE willParticipate = 1";
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
	
	public function checkEmail($str) {
		$query = "SELECT * FROM participants WHERE email = '$str'";
		$result = $this -> connection -> query($query);
		return $result;
	}

	public function checkUserPhaseTwo($str, $pw) {
		$query = "SELECT * FROM participants WHERE username = '$str' AND password = '" . md5($pw) . "'";
		$result = $this -> connection -> query($query);
		return $result;
	}

	public function randomizeWichtel() {
		$participants = $this -> getUserIdsPhaseTwo();
		$userids = $userids;
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
		$query = "SELECT firstname, email FROM participants WHERE username = '$str'";
		$result = $this -> connection -> query($query);
		return $result;
	}

	public function setGotEmail($str) {
		$query = "UPDATE  participants SET  gotEmail =  '1' WHERE  username = '$str'";
		$result = $this -> connection -> query($query);
	}

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

function checkMaster($str) {
	if (md5($str) == "78a575be3a8d26aa990a2685069da168") {
		echo "<form id='whoAreYouForm' class='leftMargin'>";
		echo "<table>";
		echo "<tr><td colspan='2'>Bitte gib deine E-Mail Adresse ein:</td></tr>";
		echo "<tr><td><input type='text' id='firstEmail' class='midInput bottomMargin'></td><td><div class='checkEmailIcon bottomMargin' id='emailCheck' /></tr>";
		echo "<tr><td colspan='2'>Noch einmal zur Sicherheit:</td></tr>";
		echo "<tr><td><input type='text' id='secondEmail' class='midInput bottomMargin'></td><td><div class='checkEmailIcon bottomMargin' id='emailCheckEquality' /></tr>";
		echo "<tr><td colspan='2'>&nbsp;</td></tr>";
		echo "<tr><td><input type='button' id='sendRegistration' disabled='disabled' value='Als Wichtel registrieren' class='smallInput' />";
		echo "</table>";
		echo "</form>";
	}
}

function checkMasterPhaseTwo($str) {
	$db = new dbConnectController();
	if (md5($str) == "767870077154fa15357c8badfc2c5a5e") {
		getUsersPhaseTwo($db);
	}
}

function checkEmail($str) {	
	$db = new dbConnectController();
	$result = $db -> checkEmail($str);
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

function sendMail($str) {
	$db = new dbConnectController();
	$db -> sendMail($str);
	$db -> closeConnection();
}
?>