var timeoutHandle = window.setTimeout(),
imgAjaxLoader = "assets/img/ajax-loader.gif",
imgValid = "assets/img/valid.png",
imgInvalid = "assets/img/invalid.png";

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
        console.log('keyUp');

        if ($('#emailCheck').attr('src') !== imgAjaxLoader) {
            $('#emailCheck').attr('src', imgAjaxLoader);
        }
        window.clearTimeout(timeoutHandle);
        timeoutHandle = window.setTimeout('checkEmailValidation()', 1000);
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
                $('#emailCheck').attr('src', imgValid);
            } else {
                $('#emailCheck').attr('src', imgInvalid);
            }
        }
    });
}
