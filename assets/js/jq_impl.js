jQuery(function($) {"use strict";

    var emailValidationTimeoutHandle = window.setTimeout(function() {
        return;
    }, 1000), emailEqualityTimeoutHandle = window.setTimeout(function() {
        return;
    }, 1000), nickNameValidationTimeoutHandle = window.setTimeout(function() {
        return;
    }, 1000), emailValid = false, nickNameValid = false, emailEqual = false, imgAjaxLoader = "assets/img/ajax_loader_bars.gif", imgInvalid = "assets/img/cancel_24.png", imgValid = "assets/img/checkmark_24.png";

    function validKeycode(event) {
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
                            validateForm();
                            $('#emailCheck').css('background-image', "url(" + imgValid + ")");
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

    function checkNickNameValidation() {
        var nickName = $('#nickName').val();
        $.ajax({
            url : "././dbConnectController.php",
            type : "POST",
            data : {
                action : "validateNickName",
                str : nickName
            },
            dataType : "text",
            success : function(result) {
                result = $.trim(result);
                var resultLength = result.length;
                if ($('#nickName').val().length) {
                    if (resultLength !== 0) {
                        if (result === '-1') {
                            nickNameValid = false;
                            $('#nameCheck').css('background-image', "url(" + imgInvalid + ")");
                            errorMessage('show', 'Der Name ist schon vergeben')
                        } else {
                            nickNameValid = true;
                            validateForm();
                            errorMessage('hide');
                            $('#nameCheck').css('background-image', "url(" + imgValid + ")");
                        }
                    } else {
                        nickNameValid = false;
                        errorMessage('show', 'Fehler');
                        $('#nameCheck').css('background-image', "url(" + imgInvalid + ")");
                    }
                } else {
                    errorMessage('hide');
                    nickNameValid = false;
                }
            },
            complete : checkRegisterButton
        });
    }

    function checkEmailEquality() {
        var firstEmail = $('#firstEmail').val(), secondEmail = $('#secondEmail').val();

        if (emailValid && firstEmail === secondEmail) {
            emailEqual = true;
            validateForm();
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
        var button = $('#sendRegistration');
        if (emailValid && emailEqual && nickNameValid) {
            button.removeClass('disabled');
        } else {
            if (!button.hasClass('disabled')) {
                $('#sendRegistration').addClass('disabled');
            }
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
            thisOne.css('background', '#606080')
            slideContainer.data('slideposition', 'up');
            rotateSelector(arrowImage, 180);
        } else {
            slideContainer.css('top', '0px');
            thisOne.css('background', '#040410')
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

    function validateForm() {
        if (!nickNameValid) {
            checkNickNameValidation();
            return;
        }

        if (!emailValid) {
            checkEmailValidation();
            return;
        }

        if (!emailEqual) {
            checkEmailEquality();
            return;
        }

        checkRegisterButton();
    }

    function getParameter(paramName) {
        var searchString = window.location.search.substring(1), i, val, params = searchString.split("&");
        for ( i = 0; i < params.length; i++) {
            val = params[i].split("=");
            if (val[0] === paramName) {
                return unescape(val[1]);
            }
        }
        return null;
    }

    function animateBorders() {
        var items = ['#879fd7', '#859cea', '#cff2f6', '#393e7a', '#dbfcff', '#617cd0', '#444a92', '#304488', '#7c8ac2', '#3d418b'], color = items[Math.floor(Math.random() * items.length)];
        $('.animatedBorder').css('border-top-color', color);
        color = items[Math.floor(Math.random() * items.length)];
        $('.animatedBorder').css('border-right-color', color);
        color = items[Math.floor(Math.random() * items.length)];
        $('.animatedBorder').css('border-bottom-color', color);
        color = items[Math.floor(Math.random() * items.length)];
        $('.animatedBorder').css('border-left-color', color);
        setTimeout(function() {
            animateBorders();
        }, 3000);
    }


    $(document).ready(function() {
        if (getParameter('confirmation') || getParameter('participation')) {

            var currentAction = getParameter('confirmation') ? 'confirmRegistration' : 'confirmParticipation', contextText = getParameter('confirmation') ? 'Registrierung' : 'Teilnahme';
            $('#confirmRegistrationText').text('Prüfe ' + contextText);
            $.ajax({
                url : "././dbConnectController.php",
                type : "POST",
                data : ( {
                    action : currentAction,
                    email : getParameter('email'),
                    confirmationHash : getParameter('confirmationHash')
                }),
                beforeSend : function() {
                    var confirmRegistration = $('#confirmRegistration');
                    if (confirmRegistration.css('background-image') !== "url(" + imgAjaxLoader + ")") {
                        confirmRegistration.css('background-image', "url(" + imgAjaxLoader + ")");
                    }
                },
                success : function(result) {
                    var confirmRegistration = $('#confirmRegistration'), contextText = getParameter('confirmation') ? 'Registrierung' : 'Teilnahme';
                    result = $.trim(result);
                    if (result) {
                        errorMessage('show', result);
                        confirmRegistration.css('background-image', "url(" + imgInvalid + ")");

                        $('#confirmRegistrationText').text('Fehler bei der ' + contextText);
                    } else {
                        errorMessage('hide');
                        confirmRegistration.css('background-image', "url(" + imgValid + ")");
                        $('#confirmRegistrationText').text(contextText + ' erfolgreich');
                    }
                }
            });
        }

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

        $(document.body).on('click', '#sendRegistration:not(.disabled)', function() {
            if (emailEqual && emailValid && nickNameValid) {
                $.ajax({
                    url : "././dbConnectController.php",
                    type : "POST",
                    data : ( {
                        action : "registerUser",
                        email : $('#firstEmail').val(),
                        nickName : $('#nickName').val()
                    }),
                    beforeSend : function() {
                        var registerCheck = $('#registerCheck');
                        if (registerCheck.css('background-image') !== "url(" + imgAjaxLoader + ")") {
                            registerCheck.css('background-image', "url(" + imgAjaxLoader + ")");
                        }
                    },
                    dataType : "text",
                    success : function(result) {
                        result = $.trim(result);
                        var registerCheck = $('#registerCheck'), td = $('#sendRegistration').closest('td');
                        if (result) {
                            errorMessage('show', 'Irgendwas ist schief gelaufen: ' + result);
                            registerCheck.css('background-image', "url(" + imgInvalid + ")");
                        } else {
                            errorMessage('hide');
                            registerCheck.css('background-image', "url(" + imgValid + ")");
                            $('#sendRegistration').attr('disabled', 'disabled');
                            $('#sendRegistration').fadeOut(500, function() {
                                $('#sendRegistration').removeAttr('id').removeAttr('class').attr('id', 'thanks');
                                td.children('div').text('Bestätigungs E-Mail versandt');
                                $('#thanks').fadeIn(500);
                            });
                        }
                    }
                });
            }
        });

        $(document.body).on('keyup', '#nickName', function(event) {
            if (validKeycode(event)) {
                window.clearTimeout(nickNameValidationTimeoutHandle);
                errorMessage('hide');
                var nickNameSelector = $('#nameCheck'), nickName = $('#nickName').val();

                if (nickName.length) {
                    if (nickNameSelector.css('background-image') !== "url(" + imgAjaxLoader + ")") {
                        nickNameSelector.css('background-image', "url(" + imgAjaxLoader + ")");
                    }
                    nickNameValidationTimeoutHandle = window.setTimeout(function() {
                        checkNickNameValidation();
                    }, 1250);
                } else {
                    nickNameSelector.css('background-image', "");
                }
            }
        });

        $(document.body).on('keyup', '#firstEmail', function(event) {
            if (validKeycode(event)) {
                window.clearTimeout(emailValidationTimeoutHandle);
                errorMessage('hide');
                var firstMailSelector = $('#emailCheck'), firstEmail = $('#firstEmail').val();

                if (firstEmail.length) {
                    if (firstMailSelector.css('background-image') !== "url(" + imgAjaxLoader + ")") {
                        firstMailSelector.css('background-image', "url(" + imgAjaxLoader + ")");
                    }
                    emailValidationTimeoutHandle = window.setTimeout(function() {
                        checkEmailValidation();
                    }, 1250);
                } else {
                    firstMailSelector.css('background-image', "");
                }
            }
        });

        $(document.body).on('keyup', '#secondEmail', function(event) {
            if (validKeycode(event)) {
                window.clearTimeout(emailEqualityTimeoutHandle);
                errorMessage('hide');
                var secondMailSelector = $('#emailCheckEquality'), secondEmail = $('#secondEmail').val();

                if (secondEmail.length && emailValid) {
                    if (secondMailSelector.css('background-image') !== "url(" + imgAjaxLoader + ")") {
                        secondMailSelector.css('background-image', "url(" + imgAjaxLoader + ")");
                    }
                    emailEqualityTimeoutHandle = window.setTimeout(function() {
                        checkEmailEquality();
                    }, 750);
                } else {
                    secondMailSelector.css('background-image', "");
                }
            }
        });

        $(document.body).on('click', '#participationMail', function() {
            $.ajax({
                url : "././dbConnectController.php",
                type : "POST",
                data : ( {
                    action : "sendParticipationMails"
                }),
                success : function(result) {
                    var bla = '';
                }
            });
        });

        $(document.body).on('click', '#wichtelMails', function() {
            $.ajax({
                url : "././dbConnectController.php",
                type : "POST",
                data : ( {
                    action : "sendWichtelMails"
                }),
                success : function(result) {
                    var bla = '';
                }
            });
        });

        $(document.body).on('click', '#resendMail', function() {
            var email = $('#resendEmailAddress').val();
            $.ajax({
                url : "././dbConnectController.php",
                type : "POST",
                data : ( {
                    action : "resendMail",
                    email : email
                }),
                success : function(result) {
                    var bla = '';
                }
            });
        });

        $('#masterPw').on('keyup', function(event) {
            if (validKeycode(event)) {
                errorMessage('hide');
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
                                    $('#nickName').focus();
                                }
                            });
                        });
                    }
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

        $('#confirmAdmin').on('click', function() {
            var pw = $('#adminPw').val();

            $.ajax({
                url : "././dbConnectController.php",
                type : "POST",
                data : ( {
                    action : "confirmAdmin",
                    str : pw
                }),
                success : function(result) {
                    var resultLength = $.trim(result).length

                    if (resultLength) {
                        $(document.body).html(result);
                    } else {
                        $('#confirmAdmin').val('Wrong pw');
                    }
                }
            });
        });

        animateBorders();
    });
});
