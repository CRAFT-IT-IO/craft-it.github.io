function toggleMenu() {
	$('.menu').toggleClass('show');
}

document.addEventListener('scroll', function () {
	const header = document.querySelector('header'); // Sélectionnez votre header ici
	if (window.scrollY > 0) {
		header.classList.add('is-scrolling');
	} else {
		header.classList.remove('is-scrolling');
	}
});