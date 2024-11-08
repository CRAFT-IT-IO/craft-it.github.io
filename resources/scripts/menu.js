function toggleMenu() {
    const menu = document.getElementById('menuItems');
    if (menu.style.display === 'none' || menu.style.display === '') {
        menu.style.display = 'block';
        menu.classList.add('show');
    } else {
        menu.style.display = 'none';
        menu.classList.remove('show');
    }
}