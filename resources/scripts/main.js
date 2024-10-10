var button = document.querySelector(".hero-button");
var heroBottom = document.querySelector(".hero-bottom");
var buttonText = document.querySelector(".button-text"); 
var svgArrow = document.querySelector(".svg-arrow");
var svgPath = document.querySelector(".arrow-path");
var callToAction = document.querySelector(".call-to-action");
var mainContent = document.querySelector("main"); 

button.addEventListener("click", () => {
    button.classList.toggle("active");
    heroBottom.classList.toggle("active");
    svgArrow.classList.toggle("active");
    callToAction.classList.toggle("active");


    // Applique ou enlève la classe 'no-scroll' sur 'main' plutôt que sur 'body'
    if (callToAction.classList.contains("active")) {
        mainContent.classList.add("no-scroll");
    } else {
        mainContent.classList.remove("no-scroll");
    }
});

window.addEventListener('scroll', function() {
    const heroBottom = document.querySelector('.hero-bottom');
    const main = document.querySelector('main');
    const rect = main.getBoundingClientRect();

    if (rect.bottom <= window.innerHeight) {
        heroBottom.classList.add('sticky');
    } else {
        heroBottom.classList.remove('sticky');
    }
});

   
// HERO ANIMATION TEXT

document.addEventListener("DOMContentLoaded", function() {
    // Sélectionner tous les éléments avec la classe 'scroll-fade'
    var textWrappers = document.querySelectorAll('.scroll-fade');
    
    // Parcourir chaque élément
    textWrappers.forEach(function(textWrapper) {
        // Récupérer le contenu avant et après le <br>
        var parts = textWrapper.innerHTML.split('<br>');
        
        // Fonction pour envelopper chaque mot dans une <div> et chaque lettre dans un <span>
        function wrapWordsInDiv(text) {
            return text.split(' ').map(word => {
                var wrappedLetters = word.split('').map(letter => `<span>${letter}</span>`).join('');
                return `<div class="hero-word">${wrappedLetters}</div>`; // Enveloppe chaque mot dans une <div>
            }).join(' ');
        }

        // Ajouter des <div> autour de chaque mot et des <span> autour de chaque lettre pour les parties avant et après le <br>
        var wrappedBefore = wrapWordsInDiv(parts[0]);
        var wrappedAfter = wrapWordsInDiv(parts[1]);
        
        // Réassembler le HTML avec les <div> autour de chaque mot
        textWrapper.innerHTML = `${wrappedBefore}<br>${wrappedAfter}`;
        
        // Anime chaque lettre à l'intérieur des mots
        anime.timeline({loop: false})
            .add({
                targets: textWrapper.querySelectorAll('.hero-word span'),
                translateY: [50, 0], // Transition de bas en haut
                opacity: [0, 1],     // Fade-in progressif
                easing: "easeOutExpo",
                duration: 550,
                delay: (el, i) => 10 * i // Ajout d'un délai pour chaque lettre
            });
    });
});

// Initialize GSAP and ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Apply animation to elements with the 'disap' class
gsap.utils.toArray('.disap').forEach((element) => {
  gsap.fromTo(element, 
    { opacity: 0, y: 20 }, // Start state: hidden and translated down
    { 
      opacity: 1, 
      y: 0, 
      duration: 1, 
      ease: 'power2.out', // Ease for smooth transition
      scrollTrigger: {
        trigger: element,
        start: 'top 50%', // When the top of the element reaches 80% of the viewport, the animation starts
        toggleActions: 'play none none reverse', // Play when scrolling down, reverse when scrolling up
        onLeaveBack: () => {
          gsap.to(element, { opacity: 0, y: 20, duration: 1, ease: 'power2.out' }); // Fade out on exit
        }
      }
    }
  );
});

// HOVER EFFECT

    let elements = document.querySelectorAll('.rolling-hover');

    elements.forEach(element => {
        let innerText = element.innerText;
        element.innerHTML = '';

        let textContainer = document.createElement('div');
        textContainer.classList.add('block');

        for (let letter of innerText) {
            let span = document.createElement('span');
            span.innerText = letter.trim() === '' ? '\xa0' : letter;
            span.classList.add('letter');
            textContainer.appendChild(span);
        }

        element.appendChild(textContainer);
        element.appendChild(textContainer.cloneNode(true));
    });

    // Appliquer l'effet au survol
    elements.forEach(element => {
        element.addEventListener('mouseover', () => {
            element.classList.add('play');
        });

        // Retirer la classe 'play' quand le survol s'arrête
        element.addEventListener('mouseleave', () => {
            element.classList.remove('play');
        });
    });


// DREAM DRAFT CRAFT

document.addEventListener("DOMContentLoaded", (event) => {
    gsap.registerPlugin(ScrollTrigger);

    // First layer: No shrinking yet
    let tl1 = gsap.timeline({
        scrollTrigger: {
            trigger: '.process-list li:nth-child(1)',
            start: 'top center',
            end: 'bottom center',
            scrub: true,
            markers: false
        }
    });

    // Just animating opacity of svg-wrapper1
    tl1.to('.svg-wrapper1', {
        opacity: 1,
        duration: 1,
        ease: 'power1.out'
    });

    // Second layer: Trigger shrinkage of the first <li> and opacity of the first <p>
    let tl2 = gsap.timeline({
        scrollTrigger: {
            trigger: '.process-list li:nth-child(2)',
            start: 'top center',
            end: 'bottom center',
            scrub: true,
            markers: false
        }
    });

    tl2.to('.svg-wrapper2', {
        opacity: 1,
        duration: .8,
        ease: 'power1.out'
    }).to('.svg-c-dot-layer', {
        y: 25, // Adjusted to 25 pixels
        duration: .8,
        ease: 'power1.out'
    }, 0).to('.svg-text-wrapper2', {
        y: 0, // Remains at 0 since no movement
        duration: .8,
        ease: 'power1.out'
    }, 0).to('.process-list li:nth-child(1)', {
        height: (i, target) => {
            let h3 = target.querySelector('h3');
            let padding = parseFloat(getComputedStyle(target).paddingTop);
            return h3.offsetHeight + padding; // Shrink to h3 height + padding
        },
        paddingTop: '1rem',
        paddingBottom: '1rem',
        duration: .8,
        ease: 'power1.out'
    }, 0).to('.process-list li:nth-child(1) p', {
        opacity: 0, // Fade out the paragraph
        duration: .3,
        ease: 'power1.out'
    }, 0);

    // Third layer: Trigger shrinkage of the second <li> and opacity of the second <p>
    let tl3 = gsap.timeline({
        scrollTrigger: {
            trigger: '.process-list li:nth-child(3)',
            start: 'top center',
            end: 'bottom center',
            scrub: true,
            markers: false
        }
    });

    tl3.to('.svg-wrapper3', {
        opacity: 1,
        duration: .8,
        ease: 'power1.out'
    }).to('.svg-text-wrapper3', {
        y: -25, // Adjusted to -25 pixels for upward movement
        duration: .8,
        ease: 'power1.out'
    }, 0).to('.svg-text-wrapper2', {
        y: 0, // Remains at 0
        duration: .8,
        ease: 'power1.out'
    }, 0).to('.svg-c-dot-layer', {
        y: 25, // Adjusted to 25 pixels for movement
        duration: .8,
        ease: 'power1.out'
    }, 0).to('.process-list li:nth-child(2)', {
        height: (i, target) => {
            let h3 = target.querySelector('h3');
            let padding = parseFloat(getComputedStyle(target).paddingTop);
            return h3.offsetHeight + padding; // Shrink to h3 height + padding
        },
        paddingTop: '1rem',
        paddingBottom: '1rem',
        duration: .8,
        ease: 'power1.out'
    }, 0).to('.process-list li:nth-child(2) p', {
        opacity: 0, // Fade out the paragraph
        duration: 0.5,
        ease: 'power1.out'
    }, 0);
});


    
// COLLABORATION MODEL SWIPE

    document.addEventListener('DOMContentLoaded', function() {
        const container = document.querySelector('.collaboration_models');
        
        let isDown = false;
        let startX;
        let scrollLeft;

        // Mouse Down Event - Start Dragging
        container.addEventListener('mousedown', (e) => {
            isDown = true;
            container.classList.add('active');
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        });

        // Mouse Leave Event - Stop Dragging when leaving the container
        container.addEventListener('mouseleave', () => {
            isDown = false;
            container.classList.remove('active');
        });

        // Mouse Up Event - Stop Dragging
        container.addEventListener('mouseup', () => {
            isDown = false;
            container.classList.remove('active');
        });

        // Mouse Move Event - Handle Scrolling while Dragging
        container.addEventListener('mousemove', (e) => {
            if (!isDown) return; // Only run if the mouse is held down
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 2; // Adjust this multiplier to change scrolling speed
            container.scrollLeft = scrollLeft - walk;
        });

        // Touch Start Event for Mobile Devices
        let touchStartX;
        let touchScrollLeft;

        container.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].pageX - container.offsetLeft;
            touchScrollLeft = container.scrollLeft;
        });

        // Touch Move Event for Swipe Scrolling on Touch Devices
        container.addEventListener('touchmove', (e) => {
            const x = e.touches[0].pageX - container.offsetLeft;
            const walk = (x - touchStartX) * 2;
            container.scrollLeft = touchScrollLeft - walk;
        });
    });


    