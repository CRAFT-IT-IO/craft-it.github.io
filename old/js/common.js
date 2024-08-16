$(document).ready(function () {
    let logoDotContainer = $('<logo-dot></logo-dot>');
    $('body').prepend(logoDotContainer);
    logoDotContainer.initializeLogoDotEffect();
    addHeader();
    initLogo();

    $('.content-right').addClass('animated');
    $('.title').animate({ left: 0 }, 500);
    initContentMenu();
    $('.menu-item').animate({ left: 0 }, 500);
    setTimeout(function () {  $('.menu-item').first().trigger('click', { isStarting: true }); }, 500);
});