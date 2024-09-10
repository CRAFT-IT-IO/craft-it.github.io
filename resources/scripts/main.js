var button = document.querySelector(".hero-button");
var heroBottom = document.querySelector(".hero-bottom");
var text = document.querySelector(".button-text");
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
