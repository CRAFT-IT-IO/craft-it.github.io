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


// LOADER

window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    const topHalf = document.querySelector('.top-half');
    const bottomHalf = document.querySelector('.bottom-half');
  
    // GSAP timeline for the loader animation
    gsap.timeline()
      .to(topHalf, { y: '-50vh', duration: 1, ease: 'power2.inOut' })  // Slide top-half upwards
      .to(bottomHalf, { y: '50vh', duration: 1, ease: 'power2.inOut' }, 0)  // Slide bottom-half downwards simultaneously
      .to(topHalf, { height: 0, duration: 1, ease: 'power2.inOut' })  // Shrink the top-half vertically
      .to(bottomHalf, { height: 0, duration: 1, ease: 'power2.inOut', onComplete: () => {
          // Hide the loader after the animation is complete
          loader.style.display = 'none';
        }
      }, '-=1');  // Shrink the bottom-half simultaneously
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

        const text = document.querySelector('.text1');
        const para = document.querySelector('.para1');
        text.innerHTML = text.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
        para.innerHTML = para.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

        document.addEventListener("DOMContentLoaded", (event) => {
            gsap.registerPlugin(ScrollTrigger)
        });

        let tl1 = gsap.timeline({
            scrollTrigger: {
                trigger: '.bp1',
                start: '-10% center',
                end: '30% center',
                markers: true,
                scrub: true
            }
        })

        tl1.to('.letter', {
            y: 0,
        }, )
        tl1.to('.svg-wrapper1', {
            scale: 1,
        },1 )
        tl1.to('.text1',{
            x: -350,
        }, 1)
        tl1.to('.para1',{
            x: 250,
        }, 1)

        let tl2 = gsap.timeline({
            scrollTrigger: {
                trigger: '.bp2',
                start: '-20% center',
                end: '20% center',
                markers: true,
                scrub: true
            }
        })

        tl2.to('.svg-wrapper2' ,{
            opacity: 1
        })
        tl2.to('.svg-text-wrapper1' ,{
            y: 50
        }, 1)
        tl2.to('.svg-text-wrapper2' ,{
            y: -50
        }, 1)
        tl2.to('.text2',{
            opacity: 1,
            x: -350
        }, 1)
        tl2.to('.para2',{
            opacity: 1,
            x: 350,
        }, 1)

        let tl3 = gsap.timeline({
            scrollTrigger: {
                trigger: '.bp3',
                start: '-20% center',
                end: '20% center',
                markers: true,
                scrub: true
            }
        })

        tl3.to('.svg-wrapper3', {
            opacity: 1,
        }).to('.svg-text-wrapper3',{
            y: -100,
        }, 1).to('.svg-text-wrapper2',{
            y: 0,
        }, 1).to('.svg-text-wrapper1',{
            y: 100,
        }, 1).to('.text3',{
            opacity: 1,
            x: -350,
        }, 1).to('.para3',{
            opacity: 1,
            x: 350,
        }, 1);


        const lenis = new Lenis()
        lenis.on('scroll', (e) => {
        console.log(e)
        })
        function raf(time) {
        lenis.raf(time)
        requestAnimationFrame(raf)
        }
        requestAnimationFrame(raf)