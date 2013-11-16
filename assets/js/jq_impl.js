$(document).ready(function() {
	"use strict";
	$('#masterPw').live("click", function() {
		if($('#masterPw').val() !=="") {
			$('#masterPw').val("");
		}

	});

	$('#masterPw').live("keypress", function(e) {
		if(e.keyCode === 13 && $('#masterPw').val() !=="") {
			$('#masterPwClick').click();
		}

	});
	
	$('#userPw').live("click", function() {
		if($('#userPw').val() !=="") {
			$('#userPw').val("");
		}

	});

	$('#masterPwClick').live("click", function() {
		var masterPw = $("#masterPw").val();
		$.ajax({
			url : "././dbConnectController.php",
			type : "POST",
			data : ( {
				action : "checkMaster",
				str : masterPw
			}),
			dataType : "text",
			success : function(result) {
				var resultLength = $.trim(result).length;
				if(resultLength === 0) {
					$('#masterPw').val("-Falsches Passwort-");
				} else {
					$('#checkMasterPW').css("display", "none");
					$('#whoAreYouName').html(result);
				}
			}
		});
	});

	$('#masterPwClickPhaseTwo').live("click", function() {
		var masterPw = $("#masterPw").val();
		$.ajax({
			url : "././dbConnectController.php",
			type : "POST",
			data : ( {
				action : "checkMasterPhaseTwo",
				str : masterPw
			}),
			dataType : "text",
			success : function(result) {
				var resultLength = $.trim(result).length;
				if(resultLength === 0) {
					$('#masterPw').val("-Falsches Passwort-");
				} else {
					$('#checkMasterPW').css("display", "none");
					$('#whoAreYouName').html(result);
				}
			}
		});
	});

	$('#user_participates').live("click", function() {
		$.ajax({
			url : "././dbConnectController.php",
			type : "POST",
			data : ( {
				action : "checkUser",
				str : $('#whoAreYouSelector').val(),
				pw : $('#userPw').val()
			}),
			dataType : "text",
			success : function(result) {
				var resultLenght = $.trim(result).length;
				if(resultLenght === 0) {
					$('#userPw').val("-Falsches Passwort-");
				} else {
					$('#whoAreYouName').css("display", "none");
					$('#whoAreYouCongrats').html(result);
				}
			}
		});
	});

	$('#user_chose_wichtel').live("click", function() {
		$.ajax({
			url : "././dbConnectController.php",
			type : "POST",
			data : ( {
				action : "checkUserPhaseTwo",
				str : $('#whoAreYouSelector').val(),
				pw : $('#userPw').val()
			}),
			dataType : "text",
			success : function(result) {
				var resultLenght = $.trim(result).length;
				if(resultLenght === 0) {
					$('#userPw').val("-Falsches Passwort-");
				} else {
					$('#whoAreYouName').css("display", "none");
					$('#whoAreYouCongrats').html(result);
				}
			}
		});
	});

	$('#user_chose_wichtel').live("click", function() {
		$.ajax({
			url : "././dbConnectController.php",
			type : "POST",
			data : ( {
				action : "checkUserPhaseTwo",
				str : $('#whoAreYouSelector').val(),
				pw : $('#userPw').val()
			}),
			dataType : "text",
			success : function(result) {
				var resultLenght = $.trim(result).length;
				if(resultLenght === 0) {
					$('#userPw').val("-Falsches Passwort-");
				} else {
					$('#whoAreYouName').css("display", "none");
					$('#whoAreYouCongrats').html(result);
				}
			}
		});
	});

	$('#noEmail').live("click", function() {
		$.ajax({
			url : "././dbConnectController.php",
			type : "POST",
			data : ( {
				action : "sendMail",
				str : $('#noEmail').attr('class')
			}),
			dataType : "text",
			success : function(result) {
				$('#noEmail').html("E-Mail wurde versandt.");
				$('#noEmail').attr('id', 'emailSent');
			}
		});
	});
})