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
		<div id="distance"></div>
		<div id="content" class="animatedBorder verySlowTransition">
			<div id="register" class="slideDownContainer slowTransition christmasBorder" data-slideposition="down">
				<div id="dynamicContent" class="wellVisible topPadding">
					<div>
						<?php
if (!$_GET['confirmation'] && !$_GET['participation']) {
						?>
						<div id="checkMasterPW">
							<input type="text" id="masterPw" class="leftMargin topMargin fullInput" autofocus/>
							<div id="masterPwClick" class="centerAlign leftMargin topMargin fullInput smallButton">
								Prüfe Passwichtelwort
							</div>
						</div>
						<?php
						} else {
						?>
						<table class="leftMargin">
							<tr>
								<td><div type='text' id='confirmRegistrationText' class='midInput bottomMargin'>Prüfe</div></td>
								<td>
								<div class='checkEmailIcon bottomMargin' id='confirmRegistration'/>
								</td>
							</tr>
							<tr><td colspan="2"><a href="http://wichteln2013.netznova.de">Zurück zur Startseite</a></td></tr>
						</table>
						<?php
						}
						?>
					</div>
					<div class="errorMessage leftMargin bottomMargin bottomContainer fastTransition" id="regError"></div>
				</div>
				<div class="bigButton slowTransition">
					<div class="ButtonCaption">
						REGISTRIERUNG
					</div>
					<div class="arrowImage slowTransition"></div>
				</div>
			</div>

			<div id="howto" class="slideDownContainer upState slowTransition" data-slideposition="up">
				<div id="staticContent" class="wellVisible topPadding">
					<div>
						<ol type="1" class="standardList">
							<li>
								Registriere dich mit deinem Spitznamen und deiner E-Mail Adresse
							</li>
							<li>
								Am 01.12.2013 wird eine E-Mail verschickt, in welcher du deine Teilnahme bestätigen musst
							</li>
							<li>
								Am 03.12.2013 wird dir dein Wichtel bekannt gegeben
							</li>
							<li>
								Am 25.12.2013 gibt's dann Alkohol und Geschenke!
							</li>
						</ol>
					</div>
				</div>
				<div class="bigButton slowTransition">
					<div class="ButtonCaption">
						WIE KANN ICH MITMACHEN?
					</div>
					<div class="arrowImage slowTransition"></div>
				</div>
			</div>
		</div>
	</body>
</html>