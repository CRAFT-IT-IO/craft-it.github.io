$(document).ready(function () {
	let header = $('header');
	// Set the value of the --sticky-container-wrap-top variable
	document.documentElement.style.setProperty('--sticky-container-wrap-top'/*, header.outerHeight()*/ + 'px');

	let subtitleHeight = $('.process-grid').siblings('.section-subtitle').outerHeight();
	let pos = header.outerHeight() + subtitleHeight;
	document.documentElement.style.setProperty('--sticky-process-grid-top', pos + 'px');
});
