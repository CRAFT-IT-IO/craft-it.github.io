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
const lineOpacity = 0.1; // Rendre les lignes plus transparentes
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

// Fonction pour étendre une ligne d'une intersection à une autre
function extendLine(start, end, callback) {
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(start.x, start.y, 0), new THREE.Vector3(start.x, start.y, 0)]);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });
    const line = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(line);

    const duration = 1000; // Durée de l'extension en ms
    const startTime = Date.now();

    function animateLine() {
        const elapsed = Date.now() - startTime;
        const t = Math.min(elapsed / duration, 1);
        const easeT = easeInOut(t);

        // Mise à jour de la géométrie de la ligne pour l'étendre
        line.geometry.setFromPoints([
            new THREE.Vector3(start.x, start.y, 0),
            new THREE.Vector3(
                THREE.MathUtils.lerp(start.x, end.x, easeT),
                THREE.MathUtils.lerp(start.y, end.y, easeT),
                0
            )
        ]);

        if (t < 1) {
            requestAnimationFrame(animateLine);
        } else {
            contractLine(line, end, callback); // Contracter la ligne après l'extension
        }
    }

    animateLine();
}

// Fonction pour contracter une ligne vers la destination finale
function contractLine(line, end, callback) {
    const start = new THREE.Vector3(line.geometry.attributes.position.array[0], line.geometry.attributes.position.array[1], 0);
    const duration = 1000; // Durée de la contraction en ms
    const startTime = Date.now();

    function animateContract() {
        const elapsed = Date.now() - startTime;
        const t = Math.min(elapsed / duration, 1);
        const easeT = easeInOut(t);

        // Mise à jour de la géométrie de la ligne pour la contracter vers la position finale
        line.geometry.setFromPoints([
            new THREE.Vector3(
                THREE.MathUtils.lerp(start.x, end.x, easeT),
                THREE.MathUtils.lerp(start.y, end.y, easeT),
                0
            ),
            new THREE.Vector3(end.x, end.y, 0)
        ]);

        if (t < 1) {
            requestAnimationFrame(animateContract);
        } else {
            scene.remove(line); // Supprimer la ligne une fois la contraction terminée
            if (callback) callback();
        }
    }

    animateContract();
}

// Fonction pour créer un mouvement aléatoire de ligne sur la grille
function createExtendingPoint() {
    const freeIntersections = intersections.filter(pos => !pos.occupied);
    if (freeIntersections.length === 0) return;

    const startPosition = freeIntersections[Math.floor(Math.random() * freeIntersections.length)];
    startPosition.occupied = true;

    const maxSteps = 4; // Maximum number of steps to move (can be adjusted)
    const possiblePositions = intersections.filter(pos => {
        const distanceX = Math.abs(pos.x - startPosition.x);
        const distanceY = Math.abs(pos.y - startPosition.y);

        // Allow movement only if it's purely horizontal or vertical, and within maxSteps
        const isHorizontal = (distanceX > 0 && distanceX <= 0.5 * maxSteps) && (distanceY === 0);
        const isVertical = (distanceY > 0 && distanceY <= 0.5 * maxSteps) && (distanceX === 0);

        return (isHorizontal || isVertical) && !pos.occupied;
    });

    if (possiblePositions.length === 0) {
        startPosition.occupied = false; // Libérer la position si aucun déplacement possible
        return;
    }

    const endPosition = possiblePositions[Math.floor(Math.random() * possiblePositions.length)];
    endPosition.occupied = true;

    extendLine(startPosition, endPosition, () => {
        endPosition.occupied = false; // Libérer l'intersection à la fin du mouvement
        setTimeout(createExtendingPoint, 500); // Relancer le processus de déplacement
    });
}

// Créer plusieurs lignes pour démarrer l'animation en continu
for (let i = 0; i < 20; i++) {
    setTimeout(createExtendingPoint, i * 1000); // Espacer l'apparition des lignes
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
