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


// DREAM DRAFT CRAFT

document.addEventListener("DOMContentLoaded", (event) => {
    gsap.registerPlugin(ScrollTrigger);

    let masterTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: '.container-outer-box',
            start: 'top center',
            end: 'bottom center',
            scrub: false,
            markers: false
        }
    });

    masterTimeline
        .to('.svg-wrapper1', {
            opacity: 1,
            duration: 0.6,
            ease: 'power1.out'
        })
        .to('.svg-wrapper2', {
            opacity: 1,
            duration: 0.5,
            ease: 'power1.out'
        })
        .to('.svg-c-dot-layer', {
            y: 50,
            duration: 0.5,
            ease: 'power1.out'
        }, "<")
        .to('.svg-text-wrapper2', {
            y: 0,
            duration: 0.5,
            ease: 'power1.out'
        }, "<")
        .to('.svg-wrapper3', {
            opacity: 1,
            duration: 0.5,
            ease: 'power1.out'
        })
        .to('.svg-text-wrapper3', {
            y: -50,
            duration: 0.5,
            ease: 'power1.out'
        }, "<")
        .to('.svg-text-wrapper2', {
            y: 0,
            duration: 0.5,
            ease: 'power1.out'
        }, "<")
        .to('.svg-c-dot-layer', {
            y: 50,
            duration: 0.5,
            ease: 'power1.out'
        }, "<");
});

// HOVER DECODE EFFECT

// Sélectionner tous les éléments ayant la classe "coding"
const textElements = document.querySelectorAll(".coding");
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

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

// Appliquer l’effet au hover temporaire pour chaque élément
textElements.forEach((element) => {
  const finalText = element.innerText;

  element.addEventListener("mouseenter", () => temporaryDecode(element, finalText));
  element.addEventListener("mouseleave", () => {
    element.innerText = finalText; // Restaure le texte final
  });
});
