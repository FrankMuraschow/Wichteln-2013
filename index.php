<!DOCTYPE html>
<html>
	<?php
	include_once 'inc/inc_header.php';
	?>
	<body>
		<div id="distance"></div>
		<div id="content">
			<div id="register" class="slideDownContainer" data-slideposition="down">
				<div id="dynamicContent" class="wellVisible topPadding">
					<div>
						<div id="checkMasterPW">
							<input type="text" id="masterPw" class="leftMargin topMargin" autofocus/>
							<input type="button" id="masterPwClick" class="centerAlign leftMargin topMargin" value="Pr&uuml;fe Passwichtelwort" />
						</div>
					</div>
					<div class="errorMessage leftMargin bottomMargin bottomContainer" id="regError"></div>
				</div>
				<div class="bigButton">
					<div class="ButtonCaption">
						REGISTRIERUNG
					</div>
					<div class="arrowImage"></div>
				</div>
			</div>

			<div id="howto" class="slideDownContainer upState" data-slideposition="up">
				<div id="dynamicContent" class="wellVisible topPadding">
					<div>
						Wie die ganze Sache abläuft:
					</div>
				</div>
				<div class="bigButton">
					<div class="ButtonCaption">
						WIE KANN ICH MITMACHEN?
					</div>
					<div class="arrowImage"></div>
				</div>
			</div>
		</div>
	</body>
</html>