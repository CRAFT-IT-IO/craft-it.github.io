$(document).ready(function () {
    if($.scrollify == undefined)
        return;

    let dotsMenu = $('div.dots');
    dotsMenu.find('[data-menu]').on('click', function(){
        var sectionName = $(this).data('menu');
        dotsMenu.find('.dot').removeClass('active');
        $(this).addClass('active');

        $.scrollify.move('#'+sectionName);
    });
});