function toggleMenu() {
	$('.menu').toggleClass('show');
}

document.addEventListener('scroll', function () {
	let header = document.querySelector('header');
	if (window.scrollY > 0) {
		header.classList.add('is-scrolling');
	} else {
		header.classList.remove('is-scrolling');
	}
});