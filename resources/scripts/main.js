var button = document.querySelector(".hero-button");
var heroBottom = document.querySelector(".hero-bottom");
var buttonText = document.querySelector(".button-text"); // Renommé pour éviter le conflit
var svgArrow = document.querySelector(".svg-arrow");
var svgPath = document.querySelector(".arrow-path");
var callToAction = document.querySelector(".call-to-action");
var mainContent = document.querySelector("main"); // Sélectionne l'élément 'main'

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


// ANIMATION TEXTE


    document.addEventListener("DOMContentLoaded", function() {
        // Sélectionner tous les éléments avec la classe 'scroll-fade'
        var textWrappers = document.querySelectorAll('.scroll-fade');
        
        // Parcourir chaque élément
        textWrappers.forEach(function(textWrapper) {
            // Récupérer le contenu avant et après le <br>
            var parts = textWrapper.innerHTML.split('<br>');
            
            // Ajouter des <span> autour de chaque partie du texte
            textWrapper.innerHTML = `<span>${parts[0]}</span><br><span>${parts[1]}</span>`;
            
            // Anime les parties avant et après le <br>
            anime.timeline({loop: false})
                .add({
                    targets: textWrapper.querySelectorAll('span'),
                    translateY: [50, 0], // Transition de bas en haut
                    opacity: [0, 1],     // Fade-in progressif
                    easing: "easeOutExpo",
                    duration: 750,
                    delay: (el, i) => 250 * i // Ajout d'un délai pour chaque segment (avant et après le <br>)
                });
        });
    });



