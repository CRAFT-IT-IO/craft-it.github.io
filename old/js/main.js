var isMenuClosed = false;
var interval;
var isRunning = false;

$(document).ready(function () {
    $(document).on('click', '.hamburger, .overlay', hamburgerMenuClick);

    var r = document.querySelector(':root');
    var rs = getComputedStyle(r);
    var mainBckColor = rs.getPropertyValue('--scrollbar-back-color-main');

    $(window).on('wheel', function (e) {
        if ($('.craft-it').css('overflow') != 'auto')
            return;

        var currentBckColor = rs.getPropertyValue('--scrollbar-back-color');
        if (isRunning)
            clearTimeout(interval);

        isRunning = true;
        r.style.setProperty('--scrollbar-back-color-main', currentBckColor);

        interval = setTimeout(function () {
            r.style.setProperty('--scrollbar-back-color-main', mainBckColor);
            isRunning = false;
        }, 500);
    });
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
    header.addClass('animated').append([headerContent, rightPart]);
    headerContent.append(leftPart);

    header.find('a').on('click', function () {
        redirect($(this).attr('page'), $(this).attr('back-color'));
    });

    let hrefParts = window.location.href.split('/');
    let currentPage = hrefParts[hrefParts.length - 1].replace('.html', '');

    header.find('a[page="' + currentPage + '"]').each(function (i, item) {
        $(this).parent().addClass('selected');
    });

    if (delay) {
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
    let contentMenu = $('.content-menu').show();
    var menuItems = $('.menu-item');
    let rightContent = $('.content-right-content');
    rightContent.empty();

    if (menuItems.length == 0)
        return;

    menuItems.show();

    menuItems.on('click', function (e, args) {
        if ($(this).is('.selected'))
            return;

        rightContent.empty();
        let menuItem = $(this);
        menuItems.removeClass('selected');
        menuItem.addClass('selected');

        let menuItemsContent = contentDisplay;
        let itemToDisplay = contentMenu.find('.content-menu-display[data-display="' + menuItem.data('display') + '"]').clone();
        if (args && args.isStarting) {
            rightContent.append(itemToDisplay);
            return;
        }

        let contentDirection = args && args.contentDirection ? args.contentDirection : 'right'; // or bottom
        contentDirection == 'right' ? itemToDisplay.css('right', '-150%') : itemToDisplay.css('bottom', '-50%');
        rightContent.append(itemToDisplay);

        itemToDisplay.animate(contentDirection == 'right' ? { right: 0 } : { bottom: 0 }, 800);
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
    let logo = $('<img></img>', { src: path != null ? 'images/' + path : 'images/logo/CRAFT-IT_Logo_Craft-IT_BASELINE.svg' });
    logo.on('click', function () { redirect('index'); });
    $('.header-left').empty().append(logoContainer.append(logo));
}