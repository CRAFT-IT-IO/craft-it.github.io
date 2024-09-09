var button = document.querySelector(".hero-button");
var heroBottom = document.querySelector(".hero-bottom");
var text = document.querySelector(".button-text");
var svgArrow = document.querySelector(".svg-arrow");
var svgPath = document.querySelector(".arrow-path");

button.addEventListener("click", () => {
    button.classList.toggle("active");
    heroBottom.classList.toggle("active");
    svgArrow.classList.toggle("active");
    callToAction.classList.toggle("active");

    if (callToAction.classList.contains("active")) {
        document.body.classList.add("no-scroll");
    } else {
        document.body.classList.remove("no-scroll");
    }
});