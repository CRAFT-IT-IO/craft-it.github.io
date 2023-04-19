var isMenuClosed = false;
$(document).ready(function () {
    $(document).on('click', '.hamburger, .overlay', hamburgerMenuClick);

});

function hamburgerMenuClick() {
    let items = $('.hamburger, .navbar');
    let isMenuClosed = items[0].classList.contains('is-closed');

    items.removeClass('is-open is-closed');
    items.addClass(isMenuClosed ? 'is-open' : 'is-closed');
    $('.overlay').toggleClass('hide');
    $('#wrapper').toggleClass('toggled');
}

function burgerMenu() {
    let button = $('<button></button>', { type: 'button', class: 'hamburger is-closed', 'data-toggle': 'offcanvas' })
        .append($('<span></span>', { class: 'hamb-top' }))
        .append($('<span></span>', { class: 'hamb-middle' }))
        .append($('<span></span>', { class: 'hamb-bottom' }));

    let sideBar = $('<ul></ul>', { class: 'nav sidebar-nav' })
        .append('<li><a page="expertise" back-color="var(--red)">EXPERTISE</a></li>')
        .append('<li><a page="banking-solutions" back-color="var(--blue)">BANKING SOLUTIONS</a></li>')
        .append('<li><a page="our-technique" back-color="var(--aqua)">OUR TECHNIQUE</a></li>')
        .append('<li><a page="contacting-us" back-color="var(--red)">CONTACTING US</a></li>');

    let navBar = $('<nav></nav>', { class: 'navbar navbar-inverse navbar-fixed-top is-closed', id: 'sidebar-wrapper', role: 'navigation' })
        .append(sideBar);

    let headerMenu = $('<div></div>', { class: 'header-menu', id: 'wrapper' })
        .append(button)
        .append(navBar);

    return headerMenu;
}

function headerMenu() {
    let menuWrap = $('<div></div>', { class: 'menu-wrap' })
        .append('<div><a page="expertise" back-color="var(--red)">EXPERTISE</a></div>')
        .append('<div><a page="banking-solutions" back-color="var(--blue)">BANKING SOLUTIONS</a></div>')
        .append('<div><a page="our-technique" back-color="var(--aqua)">OUR TECHNIQUE</a></div>')
        .append('<div><a page="contacting-us" back-color="var(--red)">CONTACTING US</a></div>');

    return menuWrap;
}

function addHeader(delay) {
    let header = $('<header></header>');
    let headerContent = $('<header-content></header-content>');
    let menuWrap = headerMenu();
    let mobileMenu = burgerMenu();

    let leftPart = $('<div></div>', { class: 'header-left' });
    let rightPart = $('<div></div>', { class: 'header-right' }).append(menuWrap).append(mobileMenu);
    header.addClass('animated').append(headerContent);
    headerContent.append([leftPart, rightPart]);

    header.find('a').on('click', function () {
        redirect($(this).attr('page'), $(this).attr('back-color'));
    });

    let hrefParts = window.location.href.split('/');
    let currentPage = hrefParts[hrefParts.length - 1].replace('.html', '');

    header.find('a[page="' + currentPage + '"]').each(function (i, item) {
        $(this).parent().addClass('selected');
    });

    if (delay) {
        debugger;
        setTimeout(function () { $('body').prepend(header); }, delay);
        return;
    }

    $('body').prepend(header);
}

function redirect(page, backcolor) {
    let overlay = $('.overlay');
    if (overlay.length == 0) {
        overlay = $('<div></div>', { class: 'overlay' });
        $('body').append(overlay);
    }

    if (!backcolor)
        backcolor = 'white';

    overlay.removeClass('hide');
    overlay.css({
        'left': '-100%',
        'display': 'block',
        'background-color': backcolor,
        'z-index': 99999
    });

    overlay.animate({ left: 0 }, 500, function () {
        window.location.href = page + '.html';
    });
}

function initContentMenu(menuItemTexts, params, callback) {
    let contentDisplay = $('.content-menu-display');
    //contentDisplay.filter(':not(:first-child)').hide();
    let contentMenu = $('.content-menu').show();
    //contentMenu.append($('<img></img>', { class: 'menu-item-arrow', src: 'images/resources/arrow.png', alt: 'arrow' }));
    var menuItems = $('.menu-item');

    if (menuItems.length == 0)
        return;

    menuItems.show();
    let arrow = $('.menu-item-arrow');
    let deltaTop = arrow.height() / 2;
    menuItems.on('click', function (e, args) {
        if ($(this).is('.selected'))
            return;

        if (deltaTop == 0)
            deltaTop = arrow.height() / 2;

        let menuItem = $(this);
        let position = menuItem.position();
        menuItems.removeClass('selected');
        arrow.animate({ left: '-2vw', top: position.top + (menuItem.height() / 2) - deltaTop }, 500);
        menuItem.addClass('selected');

        let menuItemsContent = contentDisplay;
        if (args && args.isStarting) {
            menuItemsContent = menuItemsContent.filter(':not(:first)');
        }

        let contentDirection = args && args.contentDirection ? args.contentDirection : 'right'; // or bottom
        let itemToDisplay = menuItemsContent.removeClass('selected').hide();
        contentDirection == 'right' ? menuItemsContent.css('right', '-150%') : menuItemsContent.css('bottom', '-50%');
        itemToDisplay.filter('[data-display="' + menuItem.data('display') + '"]').show();

        itemToDisplay.animate(contentDirection == 'right' ? { right: 0 } : { bottom: 0 }, 1200);
        itemToDisplay.addClass('selected');
    });

    if (params?.withAnimation)
        initContentMenuWithAnimation(menuItems, menuItemTexts, callback, params);
}

function initContentMenuWithAnimation(menuItems, menuItemTexts, callback, params) {
    let time = 200;
    let delay = params?.delay == null ? 80 : params.delay;

    for (var index = 0; index < menuItems.length; index++) {
        let menuItem = $(menuItems[index]);
        if (index == 1)
            setTimeout(function () {
                menuItems.first().trigger('click', { contentDirection: params.contentDirection });
            }, time);

        let textParts = menuItemTexts[index].split('\n');
        for (var textPartsIndex = 0; textPartsIndex < textParts.length; textPartsIndex++) {
            let txt = textParts[textPartsIndex];
            if (textPartsIndex > 0) {
                time += delay;
                setTimeout(function () {
                    menuItem.append($('</br>'));
                }, time);
            }
            for (var j = 0; j < txt.length; j++) {
                time += delay;
                setTimeout(function (texteMessage) {
                    menuItem.html(menuItem.html().replace('_', '') + texteMessage + '_');
                }, time, txt[j]);
            }
        }

        setTimeout(function (currentIndex) {
            menuItem.html(menuItem.html().replace('_', ''));
            if (currentIndex == 0 && callback)
                callback();
        }, time, index);
    }

    setTimeout(function () {
        if (menuItems.length == 1)
            menuItems.first().trigger('click', { contentDirection: params.contentDirection });
    }, time);
}

function initLogo(path) {
    let logoContainer = $('<logo class="animated"></logo>');
    logoContainer.empty();
    let logo = $('<img></img>', { src: path != null ? 'images/' + path : 'images/logo/CRAFT-IT_Logo_Craft-IT_BASELINE.svg' });
    logo.on('click', function () { redirect('index'); });
    $('.header-left').append(logoContainer.append(logo));
}