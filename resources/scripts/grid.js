// Initialisation de la scène
const canvas = document.getElementById('threejs-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true }); // Fond transparent
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0); // Couleur du fond (totalement transparent)

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 50;

// Création des points du cube
const geometry = new THREE.BufferGeometry();
const points = [];

const gridSize = 10; // Nombre de points sur chaque axe (10x10x10 cube)
const spacing = 5;  // Espacement entre les points
const initialPositions = []; // Stocke les positions initiales des points
const timeOffsets = []; // Stocke les timers pour chaque point

// Création de la grille de points dans un espace 3D (X, Y, Z)
for (let z = 0; z < gridSize; z++) {
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const posX = x * spacing - ((gridSize - 1) * spacing) / 2;
      const posY = y * spacing - ((gridSize - 1) * spacing) / 2;
      const posZ = z * spacing - ((gridSize - 1) * spacing) / 2;

      points.push(posX, posY, posZ);
      initialPositions.push({ x: posX, y: posY, z: posZ });
      timeOffsets.push(0); // Chaque point commence avec un timer à 0
    }
  }
}

const vertices = new Float32Array(points);
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

// Chargement d'une texture de cercle pour les points
const textureLoader = new THREE.TextureLoader();
const circleTexture = textureLoader.load('https://threejs.org/examples/textures/sprites/disc.png');

// Création du matériau des points avec transparence et texture de cercle
const material = new THREE.PointsMaterial({ 
  color: 0xF0ECE9,    // Couleur blanche
  size: 0.4,          // Taille des points
  transparent: true,  // Activer la transparence
  opacity: 0.7,       // Opacité
  map: circleTexture, // Utilisation de la texture de cercle
  alphaTest: 0.5,     // Gère les pixels semi-transparents (ignorer les pixels trop transparents)
  depthWrite: false   // Permet de rendre les points semi-transparents correctement
});

const pointCloud = new THREE.Points(geometry, material);
scene.add(pointCloud);

// Variables pour stocker la position de la souris
let mouseX = 0;
let mouseY = 0;
let isMouseInside = true; // Variable pour savoir si la souris est dans la zone d'influence

// Fonction pour mettre à jour la position de la souris
document.addEventListener('mousemove', (event) => {
  const halfWidth = window.innerWidth / 2;
  const halfHeight = window.innerHeight / 2;

  // Normalisation des coordonnées de la souris dans l'espace 3D du canvas
  mouseX = ((event.clientX - halfWidth) / halfWidth) * 50; // Conversion en coordonnées du monde 3D
  mouseY = ((event.clientY - halfHeight) / halfHeight) * -50; // Inversé pour correspondre à l'axe Y 3D

  isMouseInside = true; // La souris est dans la zone d'influence
});

// Lorsque la souris quitte la fenêtre, on continue l'animation jusqu'à ce qu'elle retourne à la position initiale
document.addEventListener('mouseleave', () => {
  isMouseInside = false; // La souris est sortie de la zone
});

// Fonction d'interpolation ease-in-out
function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// Fonction pour mettre à jour les positions des points avec une interpolation fluide
function updatePoints() {
  const positions = geometry.attributes.position.array;
  const timeFactor = 0.01; // Vitesse de l'animation

  for (let i = 0; i < positions.length; i += 3) {
    const initialPosition = initialPositions[i / 3];
    const distanceX = mouseX - initialPosition.x;
    const distanceY = mouseY - initialPosition.y;

    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY); // Distance à la souris

    const maxDistance = 15; // Distance maximale à laquelle les points sont influencés
    const influence = Math.max(0, maxDistance - distance) / maxDistance; // Influence basée sur la distance

    // Si la souris est dans la zone d'influence, augmenter le timer
    if (isMouseInside && influence > 0) {
      timeOffsets[i / 3] = Math.min(timeOffsets[i / 3] + timeFactor, 1); // Incrémenter le timer jusqu'à 1
    } else {
      // Lorsque la souris quitte, réduire progressivement le timer
      timeOffsets[i / 3] = Math.max(timeOffsets[i / 3] - timeFactor * 0.5, 0); // Décrémenter lentement le timer vers 0
    }

    // Application de l'ease-in-out sur le timer
    const easeValue = easeInOut(timeOffsets[i / 3]);

    // Déplacement en Z influencé par la proximité avec la souris (onde)
    const waveEffect = Math.sin(distance * 0.2 + performance.now() * 0.005) * influence * 2 * easeValue;

    // Appliquer l'effet de vague avec easing
    positions[i + 2] = initialPosition.z + waveEffect;
  }

  geometry.attributes.position.needsUpdate = true; // Indique à Three.js que les positions ont changé
}

// Fonction d'animation
function animate() {
  requestAnimationFrame(animate);

  // Légère rotation automatique du cube
  pointCloud.rotation.x += 0.001;
  pointCloud.rotation.y += 0.001;

  // Mettre à jour les positions des points avec l'effet de vague
  updatePoints();

  // Rendu de la scène
  renderer.render(scene, camera);
}

animate();

// Gestion du redimensionnement de la fenêtre
window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});




