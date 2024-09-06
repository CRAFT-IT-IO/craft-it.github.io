var button = document.querySelector(".hero-button");
var heroBottom = document.querySelector(".hero-bottom");
var text = document.querySelector(".button-text");
var svgArrow = document.querySelector(".svg-arrow");
var svgPath = document.querySelector(".arrow-path");

button.addEventListener("mouseover", funcIn, false);
button.addEventListener("mouseout", funcOut, false);
button.addEventListener("click", kickOff, false);

function funcIn()
{
    // button.setAttribute("style", "background: #F0ECE9;color: black;")
    // text.setAttribute("style", "color: black;")
    // svg.style.stroke = "black"
}
function funcOut()
{  
//    button.setAttribute("style", "color: #F0ECE9;")
//    text.setAttribute("style", "color: #F0ECE9;")
//    svg.style.stroke = "#F0ECE9"
}
function kickOff()
{
    button.classList.toggle("active");
    heroBottom.classList.toggle("active");
    svgArrow.classList.toggle("active");

    // contact.classList.toggle("active");
    // button.classList.toggle("active");
    // if(button.classList.contains("active")){
    //     console.log("yes")
    //     button.setAttribute("style", "color: #F0ECE9;")
    //     text.setAttribute("style", "color: #F0ECE9;")
    //     svg.style.stroke = "#F0ECE9"
    // }
}