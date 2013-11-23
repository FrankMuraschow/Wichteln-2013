jQuery(function($) {"use strict";

    var emailValidationTimeoutHandle = window.setTimeout(function() {
        return;
    }, 1000), emailEqualityTimeoutHandle = window.setTimeout(function() {
        return;
    }, 1000), emailValid = false, emailEqual = false, imgAjaxLoader = "assets/img/ajax_loader_bars.gif", imgInvalid = "assets/img/cancel_24.png", imgValid = "assets/img/checkmark_24.png";

    function checkEmailValidation() {
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
                if ($('#firstEmail').val().length) {
                    if (resultLength !== 0) {
                        emailValid = true;
                        $('#emailCheck').css('background-image', "url(" + imgValid + ")");
                        checkEmailEquality();
                    } else {
                        emailValid = false;
                        $('#emailCheck').css('background-image', "url(" + imgInvalid + ")");
                    }
                } else {
                    emailValid = false;
                }
            },
            complete : checkRegisterButton
        });
    }

    function checkEmailEquality() {
        var firstEmail = $('#firstEmail').val(), secondEmail = $('#secondEmail').val();

        if (emailValid && firstEmail === secondEmail) {
            emailEqual = true;
            $('#emailCheckEquality').css('background-image', "url(" + imgValid + ")");
        } else if (secondEmail) {
            emailEqual = false;
            $('#emailCheckEquality').css('background-image', "url(" + imgInvalid + ")");
        } else {
            emailEqual = false;
            $('#emailCheckEquality').css('background-image', "");
        }
        checkRegisterButton();
    }

    function checkRegisterButton() {
        if (emailValid && emailEqual) {
            $('#sendRegistration').removeAttr('disabled');
        } else {
            $('#sendRegistration').attr('disabled', 'disabled');
        }
    }

    function rotateSelector(selector, degree) {
        var filterRotation = degree > 0 ? 360 / (degree * 100) : 0;

        if (selector) {
            selector.css('-webkit-transform', 'rotate(' + degree + 'deg)');
            selector.css('-moz-transform', 'rotate(' + degree + 'deg)');
            selector.css('-o-transform', 'rotate(' + degree + 'deg)');
            selector.css('filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation=' + filterRotation + ')');
            selector.css('-ms-transform', 'rotate(' + degree + 'deg)');
        }
    }

    function bigButtonClick() {
        var thisOne = $(this), slideContainer = thisOne.closest('.slideDownContainer'), arrowImage = thisOne.find('.arrowImage');
        thisOne.trigger('slideInProgress');
        if (slideContainer.data('slideposition') === 'down') {
            slideContainer.css('top', '-322px');
            slideContainer.data('slideposition', 'up');
            rotateSelector(arrowImage, 180);
        } else {
            slideContainer.css('top', '0px');
            slideContainer.data('slideposition', 'down');
            rotateSelector(arrowImage, 0);
        }
    }


    $(document).ready(function() {
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
            var firstMailSelector = $('#emailCheck'), firstEmail = $('#firstEmail').val();

            if (firstEmail.length) {
                if ($('#emailCheck').css('background-image') !== "url(" + imgAjaxLoader + ")") {
                    $('#emailCheck').css('background-image', "url(" + imgAjaxLoader + ")");
                }
                window.clearTimeout(emailValidationTimeoutHandle);
                emailValidationTimeoutHandle = window.setTimeout(function() {
                    checkEmailValidation();
                }, 1250);
            } else {
                firstMailSelector.css('background-image', "");
            }
        });

        $(document.body).on('keyup', '#secondEmail', function() {
            var secondMailSelector = $('#emailCheckEquality'), secondEmail = $('#secondEmail').val();

            if (secondEmail.length) {
                if (secondMailSelector.css('background-image') !== "url(" + imgAjaxLoader + ")") {
                    secondMailSelector.css('background-image', "url(" + imgAjaxLoader + ")");
                }
                window.clearTimeout(emailEqualityTimeoutHandle);
                emailEqualityTimeoutHandle = window.setTimeout(function() {
                    checkEmailEquality();
                }, 750);
            } else {
                secondMailSelector.css('background-image', "");
            }
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
                        $('#dynamicContent > div').fadeOut(300, function() {
                            $('#dynamicContent > div').html(result);
                            $('#dynamicContent > div').fadeIn({
                                duration : 300,
                                complete : function() {
                                    $('#firstEmail').focus();
                                }
                            });
                        });
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

        $('.bigButton').on('click', bigButtonClick);

        $('.bigButton').on('slideInProgress', function() {
            var thisOne = $(this);
            thisOne.off('click');
            window.setTimeout(function() {
                thisOne.on('click', bigButtonClick);
            }, 1000);
        });
    });
});
