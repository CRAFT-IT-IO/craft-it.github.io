$(function() {
    let logoDotContainer = $('logo-dot');
    logoDotContainer.hide();
    logoDotContainer.initializeLogoDotEffect();

    let logoContainer = $('<div></div>', { class: 'p logo-effect-container', style: 'display: none' });
    logoDotContainer.find('.content-image').append(logoContainer);
    logoContainer.initializeLogoEffect();
    logoDotContainer.show().toggleClass('animated');
    setTimeout(function () {
        logoContainer.show().addClass('animated');
        setTimeout(function () {
            initContentMenu(['IT WORKSHOP FOR BESKOPEN SOLUTION IN RISK MANAGEMENT'], { delay: 40, withAnimation: true, contentDirection: 'bottom' }, function () {
                addHeader();
                let nextPageButton = $('<div></div>', { class: 'btn-next-page' })
                    .append($('<i></i>', { class: 'arrow-down fa fa-chevron-down', 'aria-hidden': true, alt: 'next-section' }));

                $('.craft-footer ').prepend(nextPageButton);

                var isSCrolling = false;
                let arrow = $('.arrow-down');
                let footerAnimations = $('.craft-footer .footer-item');
                let animationCount = 0;
                for (var i = 0; i < footerAnimations.length; i++) {
                    let animationIndex = $(footerAnimations[i]).attr('animation-order');
                    if (animationIndex > animationCount)
                        animationCount = animationIndex;
                }

                let currentAnimationIndex = 0;
                arrow.on('click', function () {
                    isSCrolling = true;
                    footerAnimation( -1);
                });

                $(window).on('wheel', function (e) {
                    if (isSCrolling)
                        return;

                    isSCrolling = true;
                    let delta = getDelta(e);
                    footerAnimation(delta);                    
                });

                function footerAnimation(delta) {

                    let animationCount = 0;
                    for (var i = 0; i < footerAnimations.length; i++) {
                        let animationIndex = $(footerAnimations[i]).attr('animation-index');
                        if (animationIndex > animationCount)
                            animationCount = animationIndex;
                    }

                    delta < 0 ? ++currentAnimationIndex /* to down*/ : --currentAnimationIndex; /* to up*/

                    if (currentAnimationIndex < 0)
                        currentAnimationIndex = 0;
                    else if (currentAnimationIndex > animationCount)
                        currentAnimationIndex = animationCount;

                    let container = $('.footer-container');
                    container.animate({ top: -(currentAnimationIndex * 100) + '%' }, 1500, function () {
                        currentAnimationIndex == animationCount ? arrow.hide() : arrow.show();
                        isSCrolling = false;
                    });
                }

                function getDelta(e) {
                    let value;
                    if (e.originalEvent) {
                        value = e.originalEvent.wheelDelta || -e.originalEvent.deltaY || -e.originalEvent.detail;
                    } else {
                        value = e.wheelDelta || -e.deltaY || -e.detail;
                    }

                    return Math.max(-1, Math.min(1, value));
                }

            });
        }, 2000);
    }, 2000);
});