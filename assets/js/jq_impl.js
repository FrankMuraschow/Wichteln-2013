var emailValidationTimeoutHandle = window.setTimeout(),
emailEqualityTimeoutHandle = window.setTimeout(),
emailValid = false,
imgAjaxLoader = "assets/img/ajax_loader_bars.gif",
imgInvalid = "assets/img/cancel_24.png",
imgValid = "assets/img/checkmark_24.png";

$(document).ready(function() {"use strict";

    $('#masterPw').on("click", function() {
        if ($('#masterPw').val() !== "") {
            $('#masterPw').val("");
        }

    });

    $('#masterPw').on("keypress", function(e) {
        if (e.keyCode === 13 && $('#masterPw').val() !== "") {
            $('#masterPwClick').click();
        }

    });

    $('#userPw').on("click", function() {
        if ($('#userPw').val() !== "") {
            $('#userPw').val("");
        }

    });

    $(document.body).on('keyup', '#firstEmail', function() {
        if ($('#emailCheck').css('background-image') !== "url("+imgAjaxLoader+")") {
            $('#emailCheck').css('background-image', "url("+imgAjaxLoader+")");
        }
        window.clearTimeout(emailValidationTimeoutHandle);
        emailValidationTimeoutHandle = window.setTimeout('checkEmailValidation()', 1250);
    });
    
    $(document.body).on('keyup', '#secondEmail', function(){      
        if ($('#emailCheckEquality').css('background-image') !== "url("+imgAjaxLoader+")") {
            $('#emailCheckEquality').css('background-image', "url("+imgAjaxLoader+")");
        }  
        window.clearTimeout(emailEqualityTimeoutHandle);
        emailEqualityTimeoutHandle = window.setTimeout('checkEmailEquality()', 1250);
    });

    $('#masterPwClick').on("click", function() {
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
                if (resultLength === 0) {
                    $('#masterPw').val("-Falsches Passwort-");
                } else {
                    $('#checkMasterPW').css("display", "none");
                    $('#whoAreYouName').html(result);
                    $('#firstEmail').focus();
                }
            }
        });
    });

    $('#masterPwClickPhaseTwo').on("click", function() {
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
                if (resultLength === 0) {
                    $('#masterPw').val("-Falsches Passwort-");
                } else {
                    $('#checkMasterPW').css("display", "none");
                    $('#whoAreYouName').html(result);
                }
            }
        });
    });

    $('#user_participates').on("click", function() {
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
                if (resultLenght === 0) {
                    $('#userPw').val("-Falsches Passwort-");
                } else {
                    $('#whoAreYouName').css("display", "none");
                    $('#whoAreYouCongrats').html(result);
                }
            }
        });
    });

    $('#user_chose_wichtel').on("click", function() {
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
                if (resultLenght === 0) {
                    $('#userPw').val("-Falsches Passwort-");
                } else {
                    $('#whoAreYouName').css("display", "none");
                    $('#whoAreYouCongrats').html(result);
                }
            }
        });
    });

    $('#user_chose_wichtel').on("click", function() {
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
                if (resultLenght === 0) {
                    $('#userPw').val("-Falsches Passwort-");
                } else {
                    $('#whoAreYouName').css("display", "none");
                    $('#whoAreYouCongrats').html(result);
                }
            }
        });
    });

    $('#noEmail').on("click", function() {
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
});

function checkEmailValidation() {"use strict";
    var email = $('#firstEmail').val();
    $.ajax({
        url : "././dbConnectController.php",
        type : "POST",
        data : {
            action : "validateEmail",
            str : email
        },
        dataType : "text",
        success : function(result) {
            console.log('result: ' + result);
            var resultLength = $.trim(result).length;
            if (resultLength !== 0) {
                emailValid = true;
                $('#emailCheck').css('background-image', "url("+imgValid+")");
                checkEmailEquality();
            } else {
                emailValid = false;
                $('#emailCheck').css('background-image', "url("+imgInvalid+")");
            }
        }
    });
}

function checkEmailEquality() {"use strict";
    var firstEmail = $('#firstEmail').val(),
    secondEmail = $('#secondEmail').val();
    
    if (emailValid && firstEmail === secondEmail) {
        $('#emailCheckEquality').css('background-image', "url("+imgValid+")");
    } else if(secondEmail){
        $('#emailCheckEquality').css('background-image', "url("+imgInvalid+")");
    } else {
        $('#emailCheckEquality').css('background-image', "");
    }
}
