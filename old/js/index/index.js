
$(function () {
    setTimeout(function () {
        $('.craft-footer').addClass('animated');
        addHeader();
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
            footerAnimation(-1);
        });

        $(window).on('wheel', function (e) {
            if (isSCrolling || $('.footer-container').css('overflow') == 'auto') {
                return;
            }

            console.log('target scroll : ' + e.target);
            isSCrolling = true;
            let delta = getDelta(e);
            footerAnimation(delta);
        });

        var footerAnimation = function (delta, animationIndex) {
            let animationCount = getAnimationCount();
            if (animationIndex == null && delta != 0)
                delta < 0 ? ++currentAnimationIndex /* to down*/ : --currentAnimationIndex; /* to up*/
            else {
                currentAnimationIndex = animationIndex;
            }

            if (currentAnimationIndex < 0)
                currentAnimationIndex = 0;
            else if (currentAnimationIndex > animationCount)
                currentAnimationIndex = animationCount;

            let currentItem = animationCount == footerAnimations.length - 1 ? $(footerAnimations[currentAnimationIndex]) :
                $(footerAnimations).filter('[animation-index=' + currentAnimationIndex + ']').first();

            let container = $('.footer-container');
            let newTop = currentAnimationIndex == 0 ? 0 : -currentItem.position().top + 20;
            container.animate({ top: newTop }, 1500, function () {
                currentAnimationIndex == animationCount ? arrow.hide() : arrow.show();
                isSCrolling = false;
            });

            setTimeout(function () {
                $('.dot').removeClass('active');
                $('.dot[data-index="' + currentAnimationIndex + '"]').addClass('active');
            }, 800);
        }
        window["footerAnimation"] = footerAnimation;

        function getDelta(e) {
            let value;
            if (e.originalEvent) {
                value = e.originalEvent.wheelDelta || -e.originalEvent.deltaY || -e.originalEvent.detail;
            } else {
                value = e.wheelDelta || -e.deltaY || -e.detail;
            }

            return Math.max(-1, Math.min(1, value));
        }

        function getAnimationCount() {
            let animationCount = 0;
            for (var i = 0; i < footerAnimations.length; i++) {
                let animationIndex = $(footerAnimations[i]).attr('animation-index');
                if (animationIndex > animationCount)
                    animationCount = animationIndex;
                else if (animationCount != 0) {
                    let currentTop = $(footerAnimations[i]);
                    let oldTop = $(footerAnimations[i - 1]);

                    if (oldTop.position().top != currentTop.position().top)
                        animationCount++;
                }
            }

            return animationCount;
        }
    }, 800);
});