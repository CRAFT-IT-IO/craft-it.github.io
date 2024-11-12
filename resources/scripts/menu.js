$(document).ready(function () {
	$('.menu-item-selected, .toggle-menu, .arrow-back').on('click', (e) => {
		$('.menu').toggleClass('show');
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