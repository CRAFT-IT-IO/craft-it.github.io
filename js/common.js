$(document).ready(function () {
    //let logoDotContainer = $('logo-dot:not([data-display-mode])');
    //let logoDotContainerRightSide = $('logo-dot[data-display-mode]');
    //logoDotContainer.hide();
    //logoDotContainerRightSide.hide();
    //logoDotContainer.initializeLogoDotEffect();
    //logoDotContainerRightSide.initializeLogoDotEffect();

    /* Main side */
    addHeader();
    initLogo();
    //logoDotContainer.show().toggleClass('animated');
    //setInterval(function () {
    //    logoDotContainer.toggleClass('animated');
    //}, 3000);
    /* Main side */
    /* Right side */
    //setTimeout(function () {
    //    logoDotContainerRightSide.show().addClass('animated');
    //    $('.info .logo').animate({ opacity: 1 }, 1100);
    //}, 1000);
    //setInterval(function () {
    //    logoDotContainerRightSide.removeClass('animated');
    //    setTimeout(function () {
    //        logoDotContainerRightSide.addClass('animated');
    //    }, 1000);
    //}, 6000);
    /* Right side */

    $('.content-right').addClass('animated');
    $('.title').animate({ left: 0 }, 1000);
    initContentMenu();
    $('.menu-item').animate({ left: 0 }, 500);
    setTimeout(function () {  $('.menu-item').first().trigger('click', { isStarting: true }); }, 500);
});