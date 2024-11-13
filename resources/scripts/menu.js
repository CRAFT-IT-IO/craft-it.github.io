$(document).ready(function () {
	let menu = $('.menu');
	menu.on('click', (e) => {
		if (e.target.nodeName == 'A')
			return;

		menu.toggleClass('show');
		e.preventDefault();
		e.stopPropagation();
	});
});


document.addEventListener('scroll', function () {
	let header = document.querySelector('header');
	if (window.scrollY > 0) {
		header.classList.add('is-scrolling');
	} else {
		header.classList.remove('is-scrolling');
	}
});