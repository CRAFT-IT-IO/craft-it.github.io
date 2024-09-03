// Récupérer l'élément canvas
const canvas = document.getElementById('threejs-canvas');
 
// Configurer la scène
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 7; // Reculez la caméra pour voir plus de la grille
 
// Configurer le rendu
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
 
// Paramètres de la grille
const gridSize = 50; // Augmenter la densité de la grille
const pointRadius = 0.02; // Réduire la taille des points
const lineOpacity = 0.05; // Rendre les lignes plus transparentes
const crossOpacity = 0.3; // Opacité des croix
const crossSize = 0.1; // Taille des croix
const points = [];
const intersections = []; // Stocker les positions des intersections
 
// Définir les matériaux pour les lignes et les croix
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: lineOpacity });
const crossMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: crossOpacity });
 
for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
        const x = (i - gridSize / 2) * 0.5;
        const y = (j - gridSize / 2) * 0.5;
        const z = 0;
 
        intersections.push({ x, y, occupied: false }); // Stocker les intersections
 
        // Créer des lignes entre les points
        if (i < gridSize - 1) {
            const lineGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x, y, z), new THREE.Vector3(x + 0.5, y, z)]);
            const line = new THREE.Line(lineGeometry, lineMaterial);
            scene.add(line);
        }
        if (j < gridSize - 1) {
            const lineGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x, y, z), new THREE.Vector3(x, y + 0.5, z)]);
            const line = new THREE.Line(lineGeometry, lineMaterial);
            scene.add(line);
        }
 
        // Ajouter une croix à l'intersection de chaque deuxième carré
        if ((i + j) % 2 === 0) {
            // Ligne horizontale de la croix
            const crossHorizontalGeometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(x - crossSize / 2, y, z),
                new THREE.Vector3(x + crossSize / 2, y, z),
            ]);
            const crossHorizontalLine = new THREE.Line(crossHorizontalGeometry, crossMaterial);
            scene.add(crossHorizontalLine);
 
            // Ligne verticale de la croix
            const crossVerticalGeometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(x, y - crossSize / 2, z),
                new THREE.Vector3(x, y + crossSize / 2, z),
            ]);
            const crossVerticalLine = new THREE.Line(crossVerticalGeometry, crossMaterial);
            scene.add(crossVerticalLine);
        }
    }
}
 
// Fonction pour créer un ease-in-out
function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
 
// Fonction pour déplacer un point d'une intersection à une autre
function movePoint(point) {
    const currentIndex = intersections.findIndex(pos => pos.x === point.position.x && pos.y === point.position.y);
    if (currentIndex === -1) return;
 
    // Marquer l'ancienne intersection comme libre
    intersections[currentIndex].occupied = false;
 
    // Choisir une intersection adjacente libre
    const adjacentIndices = [currentIndex - 1, currentIndex + 1, currentIndex - gridSize, currentIndex + gridSize];
    const validIndices = adjacentIndices.filter(index => {
        return index >= 0 && index < intersections.length && !intersections[index].occupied;
    });
 
    if (validIndices.length === 0) {
        fadeOutPoint(point); // Si aucune intersection libre, faire disparaître le point
        return;
    }
 
    const newIndex = validIndices[Math.floor(Math.random() * validIndices.length)];
    const newPosition = intersections[newIndex];
    newPosition.occupied = true;
 
    const duration = 1000; // Durée du déplacement en ms
    const startTime = Date.now();
 
    function animateMove() {
        const elapsed = Date.now() - startTime;
        const t = Math.min(elapsed / duration, 1); // Interpolation linéaire
        const easeT = easeInOut(t); // Appliquer l'effet ease-in-out
 
        point.position.x = THREE.MathUtils.lerp(point.position.x, newPosition.x, easeT);
        point.position.y = THREE.MathUtils.lerp(point.position.y, newPosition.y, easeT);
 
        if (t < 1) {
            requestAnimationFrame(animateMove);
        } else {
            fadeOutPoint(point); // Faire disparaître le point une fois arrivé
            setTimeout(createMovingPoint, 500); // Créer un nouveau point après un délai
        }
    }
 
    animateMove();
}
 
// Fonction pour créer un point qui va se déplacer
function createMovingPoint() {
    const freeIntersections = intersections.filter(pos => !pos.occupied);
    if (freeIntersections.length === 0) return;
 
    const startPosition = freeIntersections[Math.floor(Math.random() * freeIntersections.length)];
    startPosition.occupied = true;
 
    const pointGeometry = new THREE.SphereGeometry(pointRadius, 16, 16);
    const pointMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
    const point = new THREE.Mesh(pointGeometry, pointMaterial);
    point.position.set(startPosition.x, startPosition.y, 0);
    scene.add(point);
 
    fadeInPoint(point, () => movePoint(point)); // Faire apparaître le point puis le déplacer
}
 
// Fonction pour faire apparaître un point
function fadeInPoint(point, callback) {
    const duration = 200; // Durée de l'animation en ms
    const startTime = Date.now();
 
    function animateFadeIn() {
        const elapsed = Date.now() - startTime;
        const t = Math.min(elapsed / duration, 1);
 
        point.material.opacity = t;
 
        if (t < 1) {
            requestAnimationFrame(animateFadeIn);
        } else {
            if (callback) callback();
        }
    }
 
    animateFadeIn();
}
 
// Fonction pour faire disparaître un point
function fadeOutPoint(point) {
    const duration = 200; // Durée de l'animation en ms
    const startTime = Date.now();
 
    function animateFadeOut() {
        const elapsed = Date.now() - startTime;
        const t = Math.min(elapsed / duration, 1);
 
        point.material.opacity = 1 - t;
 
        if (t < 1) {
            requestAnimationFrame(animateFadeOut);
        } else {
            scene.remove(point); // Supprimer le point une fois totalement transparent
        }
    }
 
    animateFadeOut();
}
 
// Créer plusieurs points qui se déplacent de manière aléatoire
for (let i = 0; i < 20; i++) {
    setTimeout(createMovingPoint, i * 100); // Espacer l'apparition des points
}
 
// Gérer la redimension des fenêtres
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
 
animate();