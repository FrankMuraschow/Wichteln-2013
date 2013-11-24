jQuery(function($) {"use strict";

    var emailValidationTimeoutHandle = window.setTimeout(function() {
        return;
    }, 1000), emailEqualityTimeoutHandle = window.setTimeout(function() {
        return;
    }, 1000), emailValid = false, emailEqual = false, imgAjaxLoader = "assets/img/ajax_loader_bars.gif", imgInvalid = "assets/img/cancel_24.png", imgValid = "assets/img/checkmark_24.png";

    function validKeycode() {
        return ((event.keyCode >= 48 && event.keyCode <= 90) || event.keyCode === 13 || event.keyCode === 8);
    }

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
                result = $.trim(result);
                var resultLength = result.length;
                if ($('#firstEmail').val().length) {
                    if (resultLength !== 0) {
                        if (result === '-1') {
                            emailValid = false;
                            $('#emailCheck').css('background-image', "url(" + imgInvalid + ")");
                            errorMessage('show', 'E-Mail Adresse ist schon registriert')
                        } else {
                            emailValid = true;
                            errorMessage('hide');
                            $('#emailCheck').css('background-image', "url(" + imgValid + ")");
                            checkEmailEquality();
                        }
                    } else {
                        emailValid = false;
                        errorMessage('show', 'Ungültige E-Mail Adresse');
                        $('#emailCheck').css('background-image', "url(" + imgInvalid + ")");
                    }
                } else {
                    errorMessage('hide');
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
            errorMessage('hide');
            $('#emailCheckEquality').css('background-image', "url(" + imgValid + ")");
        } else if (secondEmail) {
            emailEqual = false;
            errorMessage('show', 'E-Mail Adressen müssen übereinstimmen');
            $('#emailCheckEquality').css('background-image', "url(" + imgInvalid + ")");
        } else {
            emailEqual = false;
            errorMessage('hide');
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

    function errorMessage(action, message) {
        if (message && action === 'show') {
            $('#regError').text(message);
            $('#regError').css('opacity', '1');
        } else if (action === 'hide') {
            $('#regError').css('opacity', '0');
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

        $(document.body).on('click', '#sendRegistration', function() {
            $.ajax({
                url : "././dbConnectController.php",
                type : "POST",
                data : ( {
                    action : "registerUser",
                    str : $('#firstEmail').val()
                }),
                dataType : "text",
                success : function(result) {
                    var bla = "";
                }
            });
        });

        $(document.body).on('keyup', '#firstEmail', function() {
            if (validKeycode()) {
                errorMessage('hide');
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
            }
        });

        $(document.body).on('keyup', '#secondEmail', function() {
            console.log(event.keyCode);
            if (validKeycode()) {
                errorMessage('hide');
                var secondMailSelector = $('#emailCheckEquality'), secondEmail = $('#secondEmail').val();

                if (secondEmail.length && emailValid) {
                    if (secondMailSelector.css('background-image') !== "url(" + imgAjaxLoader + ")") {
                        secondMailSelector.css('background-image', "url(" + imgAjaxLoader + ")");
                    }
                    window.clearTimeout(emailEqualityTimeoutHandle);
                    emailEqualityTimeoutHandle = window.setTimeout(function() {
                        checkEmailEquality();
                    }, 750);
                } else if (!emailValid) {
                    checkEmailValidation();
                } else {
                    secondMailSelector.css('background-image', "");
                }
            }
        });

        $('#masterPwClick').on("click", function() {
            errorMessage('hide');
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
                    var resultLength = $.trim(result).length, content = $('#dynamicContent > div:first-child');
                    if (resultLength === 0) {
                        errorMessage('show', 'Falsches Passwort');
                        $('#masterPw').focus();
                    } else {
                        content.fadeOut(300, function() {
                            content.html(result);
                            content.fadeIn({
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
    });
});
