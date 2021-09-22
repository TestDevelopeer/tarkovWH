/*----------------------------------------------
*
* [Main Scripts]
*
* Theme    : Leverage
* Version  : 2.1
* Author   : Codings
* Support  : codings.dev
* 
----------------------------------------------*/

/*----------------------------------------------

[ALL CONTENTS]

1. Preloader
2. Responsive Menu
3. Navigation 
4. Slides 
5. Particles
6. Progress Bar
7. Shuffle
8. Sign and Register Form
9. Multi-Step Form 
10. Simple Form
11. Recaptcha
12. Cookie Notice

----------------------------------------------*/


/*----------------------------------------------
9. Multi-Step Form
----------------------------------------------*/

jQuery(function ($) {

    'use strict';

    var current_fs, next_fs, previous_fs;
    var left, opacity, scale;
    var animating;

    function next(button, group, show, hide) {

        let field = $(group).find('.form-control').length;
        let valid = $(group).find('.valid').length;

        if (field === valid) {
            let sendButton = '#step-next-999';

            if (button === sendButton) {
                $('.progressbar').addClass('complete');
            }

            if (button === sendButton) {
                let height = $('.multi-step-form .success.message').parents().eq(1).height();
                let message = $('.multi-step-form .success.message');
                message.css('height', height);
                message.addClass('active');
                $('.form-content').hide();
                $('.multi-step-form').submit();
            }

            if (animating) return false;

            animating = true;

            current_fs = $(button).parents().eq(1);
            next_fs = $(button).parents().eq(1).next();
            $('.multi-step-form .progressbar li').eq($('fieldset').index(next_fs)).addClass('active');
            next_fs.show();

            current_fs.animate({
                opacity: 0
            }, {
                step: function (now, mx) {
                    scale = 1 - (1 - now) * 0.2;
                    left = (now * 50) + '%';
                    opacity = 1 - now;

                    current_fs.css({
                        'transform': 'scale(' + scale + ')',
                        'position': 'absolute'
                    })

                    next_fs.css({
                        'left': left,
                        'opacity': opacity
                    })
                },
                duration: 600,
                complete: function () {
                    current_fs.hide();
                    animating = false;
                },
                easing: 'easeInOutBack'
            })
            $(hide).hide();
            $(show).show();
        }
    }

    // Progressbar
    $('.multi-step-form .progressbar li').first().addClass('active');

    $('.multi-step-form .progressbar li').each(function (index) {
        $('.multi-step-form').attr('data-steps', (index + 1));
    })

    // Step Image [ID]
    $('.multi-step-form .step-image').each(function (index) {
        $(this).attr('id', 'step-image-' + (index + 1));

        if (index) {
            $('#step-image-2, #step-image-3, #step-image-4').hide();
        }
    })

    // Step Group [ID]
    $('.multi-step-form .step-group').each(function (index) {
        $(this).attr('id', 'step-group-' + (index + 1));
    })

    // Step Next [ID]
    $('.multi-step-form .step-next').each(function (index) {
        $(this).attr('id', 'step-next-' + (index + 1));
    })

    // Step Prev [ID]
    $('.multi-step-form .step-prev').each(function (index) {
        $(this).attr('id', 'step-prev-' + (index + 2));
    });

    const showLoading = (text) => {
        Swal.fire({
            title: text,
            allowOutsideClick: false,
            showCancelButton: false, // There won't be any cancel button
            showConfirmButton: false, // There won't be any confirm button
            didOpen: () => {
                Swal.showLoading()
            },
            willClose: () => {
                Swal.hideLoading()
            }
        })
    }
    showLoading('Просыпаемся...');
    $.ajax({
        type: 'POST',
        async: true,
        url: "http://localhost:5000/init",
        dataType: 'json',
        success: function (data) {
            Swal.close();
            if (data.success === 1) {
                $('.pathGame').val(data.message);
                $('.pathGame').removeClass('invalid').addClass('valid');
                next('#step-next-1', '#step-group-1', '#step-image-1, #step-title-2', '#step-image-1, #step-title-1');
            } else {
                if (data.yourPath !== '') {
                    $('.pathGame').val(data.yourPath);
                }
                Swal.fire({
                    icon: 'error',
                    title: 'Упс...',
                    text: data.message,
                    allowOutsideClick: false,
                    showConfirmButton: data.showButtons
                });
            }
        }
    });

    $(".setPathGame").on('click', () => {
        showLoading('Ищем игру...');
        let pathGameInput = $('.pathGame');
        let minlength = pathGameInput.data('minlength');
        let value;
        if (pathGameInput.val() === null || pathGameInput.val() === '') {
            value = 0;
        } else {
            value = pathGameInput.val().length;
        }
        if (Number(minlength) <= Number(value)) {
            let postData = pathGameInput.val();
            $.ajax({
                type: 'POST',
                async: true,
                url: "http://localhost:5000/setgamepath/",
                data: {pathGame: postData},
                dataType: 'json',
                success: function (data) {
                    Swal.close();
                    if (data.success === 1) {
                        pathGameInput.removeClass('invalid').addClass('valid');
                        next('#step-next-1', '#step-group-1', '#step-image-1, #step-title-2', '#step-image-1, #step-title-1');
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Упс...',
                            text: data.message,
                            allowOutsideClick: false,
                            showConfirmButton: data.showButtons
                        });
                        pathGameInput.removeClass('valid').addClass('invalid');
                    }
                }
            });
        } else {
            pathGameInput.removeClass('valid').addClass('invalid');
        }
    });

    $(".checkUser").on('click', () => {
        showLoading('Ищу ваш ключ...');
        let licKeyInput = $('.licKey');
        let postData = licKeyInput.val();
        $.ajax({
            type: 'POST',
            async: true,
            url: "http://localhost:5000/checkuser/",
            data: {licKey: postData},
            dataType: 'json',
            success: function (data) {
                Swal.close();
                if (data.success === 1) {
                    $('#username').html(data.userInfo.name);
                    $('#licInfo').html('Ваша лицензия действительна до: ');
                    $('#endDate').html(data.userInfo.endDate);
                    licKeyInput.removeClass('invalid').addClass('valid');
                    next('#step-next-2', '#step-group-2', '#step-image-1, #step-title-3', '#step-image-1, #step-title-2');
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Упс...',
                        text: data.message,
                        allowOutsideClick: false,
                        showConfirmButton: data.showButtons
                    });
                    licKeyInput.removeClass('valid').addClass('invalid');
                }
            }
        });
    });

    const showNotif = (text) => {
        $('.notification').html(text);
        $('.notification').addClass('show');
    }

    $('.setCheat').on('click', () => {
        showLoading('Колдую над игрой...');
        $.ajax({
            type: 'GET',
            async: true,
            url: "http://localhost:5000/setcheatfile",
            dataType: 'json',
            success: function (data) {
                Swal.close();
                if (data.success === 1) {
                    showNotif('Чит успешно запущен!');
                    next('#step-next-3', '#step-group-3', '#step-image-1, #step-title-4', '#step-image-1, #step-title-3');
                    Swal.fire({
                        icon: 'warning',
                        title: 'Внимание!',
                        html: `
                            <p style='color: red'>ЕСЛИ ВЫ ВИДИТЕ ДАННОЕ СООБЩЕНИЕ, НЕ ЗАКРЫВАЙТЕ ИГРУ БЕЗ ОСТАНОВКИ ЧИТА!</p>
                            <p>При внезапном вылете игры, сразу же нажмите кнопку <b>ОСТАНОВИТЬ</b>!</p>`,
                        allowOutsideClick: false,
                        confirmButtonText: 'Я понимаю свои действия!'
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Упс...',
                        text: data.message,
                        allowOutsideClick: false,
                        showConfirmButton: data.showButtons
                    });
                }
            }
        });
    });

    $(".backUpFiles").on('click', () => {
        showLoading('Отмена, отмена...');
        $.ajax({
            type: 'GET',
            async: true,
            url: "http://localhost:5000/backupfile",
            dataType: 'json',
            success: function (data) {
                Swal.close();
                if (data.success === 1) {
                    showNotif('Чит успешно остановлен!');
                    next('#step-next-3', '#step-group-3', '#step-image-1, #step-title-4', '#step-image-1, #step-title-3');
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Упс...',
                        text: data.message,
                        allowOutsideClick: false,
                        showConfirmButton: data.showButtons
                    });
                }
            }
        });
    });


    /*next('#step-next-2', '#step-group-2', '#step-image-1, #step-title-3', '#step-image-1, #step-title-2');
    next('#step-next-3', '#step-group-3', '#step-image-1', '#step-image-1');*/

    function prev(button, show, hide) {

        $(document).on('click', button, function () {

            if (animating) return false;
            animating = true;

            current_fs = $(this).parents().eq(1);
            previous_fs = $(this).parents().eq(1).prev();

            $('.multi-step-form .progressbar li').eq($('fieldset').index(current_fs)).removeClass('active');

            previous_fs.show();
            current_fs.animate({
                opacity: 0
            }, {
                step: function (now, mx) {

                    scale = 0.8 + (1 - now) * 0.2;
                    left = ((1 - now) * 50) + '%';
                    opacity = 1 - now;

                    current_fs.css({
                        'left': left
                    })

                    previous_fs.css({
                        'transform': 'scale(' + scale + ')',
                        'opacity': opacity
                    })
                },
                duration: 600,
                complete: function () {

                    current_fs.hide();
                    animating = false;
                },
                easing: 'easeInOutBack'
            })

            $(hide).hide();
            $(show).show();

            if (button === '#step-prev-3') {
                $('.multi-step-form .progressbar').removeClass('complete');
            }
        })
    }

    prev('#step-prev-2', '#step-image-1, #step-title-1', '#step-image-2, #step-title-2');
    prev('#step-prev-3', '#step-image-2, #step-title-2', '#step-image-3, #step-title-3');

    // Submission
    let leverage_form = $('#leverage-form');

    leverage_form.submit(function (e) {
        e.preventDefault();
    })
})
