$(document).ready(function () {
    let logoDotContainer = $('logo-dot:not([data-display-mode])');
    let logoDotContainerRightSide = $('logo-dot[data-display-mode]');
    logoDotContainer.hide();
    logoDotContainer.initializeLogoDotEffect();
    logoDotContainerRightSide.initializeLogoDotEffect();

    initLogo();
    logoDotContainer.show().toggleClass('animated');
    setTimeout(function () {
        setInterval(function () { logoDotContainer.toggleClass('animated'); }, 3000);
    }, 1000);

    $('.content-right').addClass('animated');
    $('.title').animate({ left: 0 }, 1000);
    initContentMenu();
    $('.menu-item').animate({ left: 0 }, 1000);
    setTimeout(function () { addHeader(1000); $('.menu-item').first().trigger('click', { isStarting: true }); }, 1000);
});