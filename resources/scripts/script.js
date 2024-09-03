var item = document.querySelector(".hero-button");
var text = document.querySelector(".button-text");
var svg = document.querySelector(".arrow-path");
item.addEventListener("mouseover", funcIn, false);
item.addEventListener("mouseout", funcOut, false);

function funcIn()
{
    item.setAttribute("style", "background: #F0ECE9;color: black;")
    text.setAttribute("style", "color: black;")
    svg.style.stroke = "black"
}

function funcOut()
{  
   item.setAttribute("style", "color: #F0ECE9;")
   text.setAttribute("style", "color: #F0ECE9;")
   svg.style.stroke = "#F0ECE9"
}