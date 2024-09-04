var button = document.querySelector(".hero-button");
var text = document.querySelector(".button-text");
var svg = document.querySelector(".arrow-path");
var contact = document.querySelector(".call-to-action");
var ctaArrow = document.querySelector(".cta-top-svg");

button.addEventListener("mouseover", funcIn, false);
button.addEventListener("mouseout", funcOut, false);
button.addEventListener("click", kickOff, false);
ctaArrow.addEventListener("click", kickOff, false);

function funcIn()
{
    button.setAttribute("style", "background: #F0ECE9;color: black;")
    text.setAttribute("style", "color: black;")
    svg.style.stroke = "black"
}
function funcOut()
{  
   button.setAttribute("style", "color: #F0ECE9;")
   text.setAttribute("style", "color: #F0ECE9;")
   svg.style.stroke = "#F0ECE9"
}
function kickOff()
{
    contact.classList.toggle("active");
}