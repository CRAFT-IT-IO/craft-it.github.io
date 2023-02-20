/*
<div class="content-image">
    img class="logo-effect" src="images/logos/craft-it_logo.svg" alt="Craft-IT logo" />
    <div class="p letter_a"></div>
    <div class="p cr"></div>
    <div class="p ft"></div>
    <div class="p it_makes_sense"></div>
    <div class="p red_circle"></div>
</div>
 */

$.fn.initializeLogoEffect = function() {
    let contentImage = $('<div></div>', { class: 'content-image' });
    //contentImage.append($('<img></img>', { class: 'logo-effect', src: 'images/logos/craft-it_logo.svg', alt: 'Craft-It Logo' }));
    contentImage.append($('<img></img>', { class: 'logo-effect', src: 'images/logo2.png', alt: 'Craft-It Logo' }));
    contentImage.append($('<div></div>', { class: 'p letter_a' }));
    contentImage.append($('<div></div>', { class: 'p cr' }));
    contentImage.append($('<div></div>', { class: 'p ft' }));
    contentImage.append($('<div></div>', { class: 'p it_makes_sense' }));
    contentImage.append($('<div></div>', { class: 'p red_circle' }));

    $(this).append(contentImage);
}