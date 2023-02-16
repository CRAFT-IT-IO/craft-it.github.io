function addHeader() {
    let header = $('<header></header>');
    let headerContent = $('<div></div>', { class: 'header-content' });

    let headerLogo = $('<div></div>', { class: 'header-logo' });
        //.append($('<img></img>', { src: 'images/CRAFT-IT_Logo.svg', alt: 'Craft-IT logo', class: 'logo' }));

    let button = $('<button></button>', { type: 'button', class: 'hamburger is-closed', 'data-toggle': 'offcanvas' })
        .append($('<span></span>', { class: 'hamb-top' }))
        .append($('<span></span>', { class: 'hamb-middle' }))
        .append($('<span></span>', { class: 'hamb-bottom' }));

    let sideBar = $('<ul></ul>', { class: 'nav sidebar-nav' })
        .append('<li><a page="what-we-do">WHAT WE DO</a></li>')
        .append('<li><a page="banking-solutions" back-color="#0028A1">BANKING SOLUTIONS</a></li>')
        .append('<li><a page="modus-cogitandi">MODUS COGITANDI</a></li>')
        .append('<li><a page="get-in-touch">GET IN TOUCH</a></li>');

    sideBar.find('a').on('click', function () {
        redirect($(this).attr('page'), $(this).attr('back-color'));
    });

    let hrefParts = window.location.href.split('/');
    let currentPage = hrefParts[hrefParts.length - 1].replace('.html', '');

    let selectedItem = sideBar.find('a[page="' + currentPage + '"]');
    if (selectedItem.length != 0)
        selectedItem.closest('li').addClass('selected');

    let navBar = $('<nav></nav>', { class: 'navbar navbar-inverse navbar-fixed-top is-closed', id: 'sidebar-wrapper', role: 'navigation' })
        .append(sideBar);

    let headerMenu = $('<div></div>', { class: 'header-menu', id: 'wrapper' })
        //.append($('<div></div>', { class: 'overlay hide' }))
        .append(button)
        .append(navBar);

    //headerContent.append(headerMenu);//.append(headerMenu);
    header.append(headerMenu);
    $('body').prepend(header);
}

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