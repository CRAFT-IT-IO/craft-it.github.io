var scrollifyCallBacks = { };
var scrollifyScrollAnimation
function initScrollify(callbacks, mainPage, section, scrollAnimation){
    if(scrollAnimation == null)
        scrollAnimation = true;

    scrollifyScrollAnimation = scrollAnimation;

    $.scrollify({
        section : section + '', // convert to string otherwise it thinks it is an object.
        sectionName : "section", // [data-section]
        scrollbars: false,
        scrollSpeed: 1500,
        updateHash: false,
        easing: "easeOutExpo",
        interstitialSection: '.craft-it.ignore',
        // standardScrollElements : '.section-container, .dots',
        before: scrollifyBefore,
        after: callbacks.after,
        afterResize: callbacks.afterResize,
        afterRender: callbacks.afterRender
    });
    scrollifyCallBacks = callbacks;
    $.scrollify.move('#home');
}

function checkNextSection(delta){
    let currentIndex = $.scrollify.currentIndex();

    if(delta > 0){
        $.scrollify.previous();
        if(currentIndex == $.scrollify.currentIndex())
            $.scrollify.next();
    }else
    {
        $.scrollify.next();
        if(currentIndex == $.scrollify.currentIndex())
            $.scrollify.previous();
    }
}

// $(window).on('wheel', function(e){
//     console.log('wheel current : ' + $.scrollify.current());
//     let currentSection = $.scrollify.current();
//     let delta = getDelta(e);
//
//     if(currentSection == null)
//     {
//         checkNextSection(delta);
//         return;
//     }
//
//     let currentSectionName = $.scrollify.current().data('section');
//     console.log('current section : ' + currentSectionName);
//
//     if(!currentSection.is('.section-container'))
//     {
//         checkNextSection(delta);
//         return;
//     }
//
//     let currentSectionIndex = $.scrollify.currentIndex();
//     subSectioncrolling(delta > 0 ? --currentSectionIndex : ++currentSectionIndex, currentSection, true);
// });
/* Scrollify */
var isScrolling = false;
function subSectioncrolling(indexToDisplay, currentSection, changeSelection){
    if(isScrolling)   return;

    let subSectionIndex = $.scrollify.currentIndex();
    let displayNextElt = indexToDisplay > subSectionIndex;
    let subSections = currentSection.find('.sub-section');
    let nbSubSections = subSections.length;

    if(nbSubSections == 0)
        return;

    isScrolling = true;
    let selectedSubSection = subSections.filter('.selected');
    let currentSubSectionIndex = 0;

    if(selectedSubSection.length == 0) {
        selectedSubSection = $(subSections[0]);
        selectedSubSection.addClass('selected');
        displayNextElt = true;
        currentSubSectionIndex = 1
    }else{
        currentSubSectionIndex = subSections.index(selectedSubSection) + 1;
    }
    let istoDown = true;
    if(changeSelection) {
        if (displayNextElt) {
            istoDown = true;
            ++currentSubSectionIndex;
        } else {
            istoDown = false;
            --currentSubSectionIndex;
        }
    }

    let oldSelection = selectedSubSection;
    if(currentSubSectionIndex > 0 && currentSubSectionIndex <= nbSubSections) {
        selectedSubSection.removeClass('selected');
        selectedSubSection = $(subSections[currentSubSectionIndex - 1]);
        selectedSubSection.addClass('selected');
    }
    else{
        if(currentSubSectionIndex <= 0){
            if($.scrollify.currentIndex() != 0)
                $.scrollify.previous();
        }
        else if($.scrollify.currentIndex() != $('section.craft-it').length)
            $.scrollify.next()

        isScrolling = false;
        return;
    }

    if(changeSelection) {
        let container = currentSection.find('.sub-section-container');
        let topPosition = 0;
        console.log('current Index : ' + currentSubSectionIndex);
        console.log('is to down : ' + istoDown);
        if(scrollifyScrollAnimation) {
            if (istoDown)
                topPosition = parseInt(container.css('top')) - (oldSelection.height() * 0.75);
            else {
                if (currentSubSectionIndex == 1)
                    topPosition = 0;
                else
                    topPosition = parseInt(container.css('top')) + (oldSelection.height() * 0.75);
            }

            console.log(' new top : ' + topPosition);
            // fake animate because transform property doesn't work with animate
            container.animate({top: topPosition + 'px'}, {
                duration: 1000
            });
        }
    }

    subSections.removeClass('sub-section-animated');
    subSections.find('*:not(.footer)').css('opacity', 0.7);
    subSections.find('img').css('opacity', 0);

    selectedSubSection.addClass('sub-section-animated');
    selectedSubSection.find('*').not('img').animate(
        {
            'opacity': 1
        }, 1000, function() {
            isScrolling = false;
        });

    selectedSubSection.find('img').animate(
        {
            'opacity': 1
        }, 2000, function() {
            isScrolling = false;
        });
}

function getDelta(e){
    let  value;
    if (e.originalEvent) {
        value = e.originalEvent.wheelDelta || -e.originalEvent.deltaY || -e.originalEvent.detail;
    } else {
        value = e.wheelDelta || -e.deltaY || -e.detail;
    }

    return Math.max(-1, Math.min(1, value));
}

function scrollifyBefore(index, sections){
    let currentSection = sections[index];
    let sectionName = currentSection.attr('data-section');

    if(scrollifyCallBacks.before && typeof scrollifyCallBacks.before === 'function')
        scrollifyCallBacks.before(index, sections);

    refreshSelectionDotMenuItem(sectionName);
    refreshSelectedSection(currentSection, index);

    if(currentSection.is('.section-container'))
        subSectioncrolling(index, currentSection, false);

    return true;
}

function refreshSelectionDotMenuItem(sectionName){
    $('.dot').removeClass('active');
    $('.dot[data-menu="' + sectionName +'"]').addClass('active');
}

function refreshSelectedSection(currentSection, currentIndex){
    if(currentIndex == 0)
        currentSection.addClass('animated');

    $('.section-animated').removeClass('section-animated');
    currentSection.addClass('section-animated');
}

function redirect(page){
    let overlay = $('.overlay');
    if(overlay.length == 0){
        overlay = $('<div></div>', { class: 'overlay' });
    }

    overlay.removeClass('hide');
    overlay.css({
        'left' : '-100%',
        'display' : 'block',
        'background-color' : 'white',
        'z-index' : 99999
    });

    overlay.animate({ left: 0 }, 1000, function(){
        window.location.href = page;
    });
}

$(function() {
    let copyright = $('.footer-copyright');
    copyright.text(new Date().getFullYear());

    $('.btn-next-page').on('click', function(){
        $.scrollify.next();
    });

    $('.find-out').on('click', function(e){
        if($(this).data('move-to') != null) {
            $.scrollify.move('#' + $(this).data('move-to'));
            e.preventDefault();
            return;
        }

        if($(this).data('redirect-to') != null)
            redirect($(this).data('redirect-to'));
    });
});

