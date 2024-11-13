var button = document.querySelector(".hero-button");
var buttonText = document.querySelector(".button-text");
var svgArrow = document.querySelector(".svg-arrow");
var svgPath = document.querySelector(".arrow-path");
var callToAction = document.querySelector(".call-to-action");
var mainContent = document.querySelector("main");

// HERO ANIMATION TEXT

document.addEventListener("DOMContentLoaded", function () {
    // Sélectionner tous les éléments avec la classe 'scroll-fade'
    var textWrappers = document.querySelectorAll('.scroll-fade');

    // Parcourir chaque élément
    textWrappers.forEach(function (textWrapper) {
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
        anime.timeline({ loop: false })
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
                start: 'top 50%', // When the top of the element reaches 50% of the viewport, the animation starts
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
            trigger: '.approach-section .approach:nth-child(1)',
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
            trigger: '.approach-section .approach:nth-child(2)',
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
        y: 50, // Adjusted to 25 pixels
        duration: .8,
        ease: 'power1.out'
    }, 0).to('.svg-text-wrapper2', {
        y: 0, // Remains at 0 since no movement
        duration: .8,
        ease: 'power1.out'
    }, 0);

    // Third layer: Trigger shrinkage of the second <li> and opacity of the second <p>
    let tl3 = gsap.timeline({
        scrollTrigger: {
            trigger: '.approach-section .approach:nth-child(3)',
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
        y: -50, // Adjusted to -25 pixels for upward movement
        duration: .8,
        ease: 'power1.out'
    }, 0).to('.svg-text-wrapper2', {
        y: 0, // Remains at 0
        duration: .8,
        ease: 'power1.out'
    }, 0).to('.svg-c-dot-layer', {
        y: 50, // Adjusted to 25 pixels for movement
        duration: .8,
        ease: 'power1.out'
    }, 0);
});


// HOVER DECODE EFFECT

// Sélection du texte cible
const textElement = document.querySelector(".coding");
const finalText = textElement?.innerText;
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789&?*%!@#";

// Fonction pour générer un caractère aléatoire
function randomChar() {
  return chars[Math.floor(Math.random() * chars.length)];
}

// Fonction de decoding temporaire avec la bonne longueur
function temporaryDecode(element, finalText) {
  let iterations = 0;

  const interval = setInterval(() => {
    element.innerText = finalText
      .split("")
      .map((char, i) => (i < iterations ? finalText[i] : randomChar()))
      .join("");

    if (iterations >= finalText.length) clearInterval(interval);
    iterations += 1;
  }, 50);
}

// Appliquer l’effet au hover temporaire
textElement?.addEventListener("mouseenter", () => temporaryDecode(textElement, finalText));
textElement?.addEventListener("mouseleave", () => {
  textElement.innerText = finalText; // Restaure le texte final
});
