const canvas = document.getElementById('threejs-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 80; // Position initiale de la caméra

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);

// PointsMaterial pour les points du cube
const material = new THREE.PointsMaterial({
  color: 0x1F1C1A,
  size: 0.3,
  transparent: false,
  alphaTest: 0.5,
  depthWrite: false,
});

// Variables pour le cube
let geometry;
let pointCloud;
const gridSize = 12; // Taille de la grille en X, Y et Z
const spacing = 5; // Espacement entre les points
let velocities = []; // Stocker les vitesses des points

// Variables pour l'effet de souris
let mouse = new THREE.Vector2(); // Position de la souris en 2D
let raycaster = new THREE.Raycaster(); // Raycaster pour projeter la souris en 3D
const mouseInfluenceRadius = 20; // Rayon d'influence de la souris
const mouseForce = 15; // Intensité de la force de déplacement
let animationTriggered = false; // Drapeau pour éviter les animations répétées

// Variables pour l'effet de recul de la caméra
let initialCameraZ = camera.position.z;
let mainScrollActive = false; // Indique si la section <main> est active
let scrollStartPosition = 0; // Position du scroll au moment où <main> devient visible

// Fonction pour créer un cube de points
function createCube() {
  geometry = new THREE.BufferGeometry();
  const vertices = [];
  const initialPositions = []; // Positions initiales pour réinitialisation
  velocities = []; // Initialiser les vitesses des particules

  // Créer une grille de points
  for (let z = 0; z < gridSize; z++) {
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const posX = x * spacing - ((gridSize - 1) * spacing) / 2;
        const posY = y * spacing - ((gridSize - 1) * spacing) / 2;
        const posZ = z * spacing - ((gridSize - 1) * spacing) / 2;

        vertices.push(posX, posY, posZ);
        initialPositions.push(posX, posY, posZ);
        velocities.push(0, 0, 0); // Ajouter une vitesse initiale de 0
      }
    }
  }

  const verticesArray = new Float32Array(vertices);
  geometry.setAttribute('position', new THREE.BufferAttribute(verticesArray, 3));

  geometry.initialPositions = new Float32Array(initialPositions); // Stocker les positions initiales dans la géométrie
  geometry.velocities = new Float32Array(velocities); // Stocker les vitesses dans la géométrie
  pointCloud = new THREE.Points(geometry, material);
  scene.add(pointCloud);
}

// Créer le cube
createCube();

// Fonction pour perturber les points sous l'influence de la souris
function disturbPoints() {
  if (animationTriggered) return; // Empêcher les animations répétées

  const positions = geometry.attributes.position.array;
  const initialPositions = geometry.initialPositions;
  const velocities = geometry.velocities;

  // Convertir la position de la souris en un point 3D
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(pointCloud);

  if (intersects.length > 0) {
    const point = intersects[0].point; // Position du point où la souris est projetée

    for (let i = 0; i < positions.length; i += 3) {
      const dx = positions[i] - point.x;
      const dy = positions[i + 1] - point.y;
      const dz = positions[i + 2] - point.z;

      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (distance < mouseInfluenceRadius) {
        const force = (mouseInfluenceRadius - distance) / mouseInfluenceRadius * mouseForce;

        velocities[i] += (dx / distance) * force;
        velocities[i + 1] += (dy / distance) * force;
        velocities[i + 2] += (dz / distance) * force;
      }
    }

    animationTriggered = true; // Marquer l'animation comme déclenchée
  }

  // Appliquer les vitesses pour un mouvement fluide
  for (let i = 0; i < positions.length; i += 3) {
    const dx = initialPositions[i] - positions[i];
    const dy = initialPositions[i + 1] - positions[i + 1];
    const dz = initialPositions[i + 2] - positions[i + 2];

    // Rappel vers la position initiale (comme un ressort)
    const springForce = 0.02;

    velocities[i] += dx * springForce;
    velocities[i + 1] += dy * springForce;
    velocities[i + 2] += dz * springForce;

    // Appliquer un effet de friction pour ralentir progressivement
    const damping = 0.8;
    velocities[i] *= damping;
    velocities[i + 1] *= damping;
    velocities[i + 2] *= damping;

    // Mettre à jour les positions
    positions[i] += velocities[i];
    positions[i + 1] += velocities[i + 1];
    positions[i + 2] += velocities[i + 2];
  }

  geometry.attributes.position.needsUpdate = true;
}

// Fonction pour gérer le mouvement de la souris
function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  animationTriggered = false; // Réinitialiser l'état à chaque mouvement de la souris
}

// Fonction pour ajuster la caméra en fonction du scroll
function handleScroll() {
  if (!mainScrollActive) return;

  const scrollPosition = window.scrollY - scrollStartPosition; // Scroll relatif depuis l'entrée de <main>
  const scrollFactor = 0.025; // Facteur de déplacement de la caméra (ajustable)
  camera.position.z = initialCameraZ + scrollPosition * scrollFactor; // Ajuster la position Z
}

// Détecter quand la section <main> est visible
const mainSection = document.querySelector('main');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      mainScrollActive = true;
      initialCameraZ = camera.position.z; // Capturer la position actuelle de la caméra
      scrollStartPosition = window.scrollY; // Capturer la position actuelle du scroll
      window.addEventListener('scroll', handleScroll);
    } else {
      mainScrollActive = false;
      window.removeEventListener('scroll', handleScroll);
    }
  });
}, {
  threshold: 0.1, // Déclenche lorsque 50% de <main> est visible
});

// Observer la section <main>
observer.observe(mainSection);

// Écouter le mouvement de la souris
window.addEventListener('mousemove', onMouseMove);

// Fonction pour animer le cube
function animate() {
  requestAnimationFrame(animate);

  // Perturber les points sous l'influence de la souris
  disturbPoints();

  // Rotation continue du cube
  if (pointCloud) {
    pointCloud.rotation.x += 0.002;
    pointCloud.rotation.y += 0.002;
  }

  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

animate();




