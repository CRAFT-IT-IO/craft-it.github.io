$(function() {
    $('.header-logo .logo').click(function(){
        $.scrollify.move("#home");
    });

    initScrollifyHome();
});


/* Scrollify */
function initScrollifyHome(){
    initScrollify(
        {
            // before : beforeScrollifyHomePage,
            afterRender : function () {
                // refreshSelectedSection($.scrollify.current(), $.scrollify.currentIndex());
            }
        }, 'home', 'section');

    // checkFirstAnimation();
}