import {
  createPoints,
  updatePoints,
  pointCloud,
  revertToCube,
  transformToSphere,
  initialPositions,
} from './cube.js';

const canvas = document.getElementById('threejs-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 80;  // Position initiale de la caméra

let outroTransitionProgress = 0;  // Progression de la transition vers la sphère
let scrollRotationProgress = 0;   // Progression de la rotation déclenchée par le scroll
const scrollThreshold = 100; // Quantité minimale de scroll avant de déclencher le snap

let lastScrollPosition = window.scrollY;  // Stocke la dernière position de scroll
let pointsToSphereProgress = 0;  // Suivi de la progression de la transformation cube-sphère

let cameraCanReposition = true; // Variable de contrôle pour la reposition de la caméra

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);

const material = new THREE.PointsMaterial({
  color: 0x353331, 
  size: 0.5,
  transparent: false,
  map: new THREE.TextureLoader().load('https://threejs.org/examples/textures/sprites/disc.png'),
  alphaTest: 0.5,
  depthWrite: false,
});

// Initialiser le cube
createPoints(scene, material);

// Variables pour le comportement de la souris et le scroll
let mouseX = 0, mouseY = 0, isMouseInside = true, scrollActivated = false;
const initialCameraZ = 80;  // Position initiale de la caméra
let rotating = true; // Rotation basique du cube
let rotationTarget = { x: 0, y: 0 }; // Cible pour le snapping
let isInOutro = false;  // Suivi de la section outro active
let resetPointsToInitial = false;
let isInHero = true;  // Animation par défaut de la section hero

// Sélection des sections à observer
const outroSection = document.getElementById('outro');
const heroSection = document.getElementById('hero');

// Fonction de lissage (lerp)
function lerp(start, end, t) {
  return start + (end - start) * t;
}

// **Intersection Observer pour le hero** : Détecte si la section hero est active
const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      isInHero = true;
      rotating = true;  // Assurer la rotation de base dans le hero
      console.log("Hero: Rotation de base active");
    } else {
      isInHero = false;
      rotating = false;
      console.log("Hero: Rotation de base arrêtée");
    }
  });
}, {
  threshold: 0.9  
});

// Observer les sections
heroObserver.observe(heroSection);

// Fonction pour trouver la face la plus proche à 90 degrés pour le snapping
function snapToClosestFace(currentRotation) {
  const snapAngleX = Math.round(currentRotation.x / (Math.PI / 2)) * (Math.PI / 2);
  const snapAngleY = Math.round(currentRotation.y / (Math.PI / 2)) * (Math.PI / 2);
  return { x: snapAngleX, y: snapAngleY };
}

// Fonction pour animer la sphère vers la position actuelle de la caméra
function animateSphereToCamera() {
  const startZ = pointCloud.position.z;  // Position actuelle de la sphère
  const targetZ = camera.position.z - 80;  // Position de la caméra moins une petite distance (pour que la sphère ne se superpose pas à la caméra)
  const duration = 800;  // Durée de l'animation (2 secondes)

  const startTime = performance.now();

  function animate() {
    const elapsedTime = performance.now() - startTime;
    const t = Math.min(elapsedTime / duration, 3);  // Progression de l'animation

    pointCloud.position.z = lerp(startZ, targetZ, t);  // Déplacer la sphère vers la position de la caméra

    if (t < 1) {
      requestAnimationFrame(animate);  // Continuer l'animation tant que t est inférieur à 1
    }
  }

  animate();
}

// Fonction pour ramener la sphère à sa position initiale
function animateSphereBackToPosition() {
  const startZ = pointCloud.position.z;
  const targetZ = 0;  // Position initiale de la sphère
  const duration = 800;  // Durée de l'animation (2 secondes)

  const startTime = performance.now();

  function animate() {
    const elapsedTime = performance.now() - startTime;
    const t = Math.min(elapsedTime / duration, 3);

    pointCloud.position.z = lerp(startZ, targetZ, t);  // Ramener la sphère à sa position d'origine

    if (t < 1) {
      requestAnimationFrame(animate);
    }
  }

  animate();
}

// Intersection Observer pour l'outro
const outroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      isInOutro = true;
      scrollActivated = false;
      rotating = false;

      transformToSphere(scene, material);  // Déclencher la transformation du cube en sphère

      // Ajouter une animation pour amener la sphère vers la position actuelle de la caméra
      animateSphereToCamera();
      console.log("Outro: Transformation en sphère et déplacement vers la caméra");

    } else {
      isInOutro = false;
      scrollActivated = true;
      rotating = true;

      // Ajouter une animation pour ramener la sphère à sa position initiale
      animateSphereBackToPosition();
      revertToCube(scene, material);  // Revenir au cube
      console.log("Outro: Retour au cube et déplacement inverse");
    }
  });
}, {
  threshold: 0.5  // Déclencher lorsque 50 % de la section outro est visible
});

// Observer la section outro
outroObserver.observe(outroSection);

let isTransitioning = false;  // Flag pour suivre l'état de la transition
let hasSnapped = false;  // Flag pour détecter si le snap a déjà eu lieu

// Gestion du scroll
window.addEventListener('scroll', () => {
  if (isInOutro || isTransitioning) return;  // Ignorer le scroll lorsqu'on est dans l'outro ou pendant une transition

  const scrollAmount = window.scrollY;
  const scrollDirection = scrollAmount > lastScrollPosition ? 'down' : 'up';  // Détecter la direction du scroll
  lastScrollPosition = scrollAmount;  // Mettre à jour la position du scroll

  // **Zoom basé sur le scroll**
  if (cameraCanReposition) {
    camera.position.z = initialCameraZ - scrollAmount * 0.03;  // Déplacer la caméra selon le scroll pour le cube
  }

  // **Snap rotation basé sur le scroll vers le bas, uniquement la première fois**
  if (scrollAmount > scrollThreshold && scrollDirection === 'down' && !hasSnapped) {
    scrollActivated = true;
    rotating = false;

    // Snap du cube vers la face la plus proche (première fois seulement)
    if (pointCloud && !isTransitioning) {
      rotationTarget = snapToClosestFace(pointCloud.rotation);
      scrollRotationProgress = 0;
      hasSnapped = true;  // Désactiver le snap après la première fois
      console.log("Scroll: Snap vers une face déclenché une seule fois");
    }
  }

  // **Transformation inverse lors du scroll vers le haut**
  if (scrollDirection === 'up' && scrollAmount < scrollThreshold && !isTransitioning) {
    pointsToSphereProgress = Math.max(pointsToSphereProgress - 0.02, 0);  // Revenir au cube
    scrollActivated = true;  // Activer l'animation pour que `animate` la gère
    hasSnapped = false;  // Réinitialiser le flag pour permettre un autre snap lors du prochain scroll vers le bas
    console.log("Scroll: Retour au cube et réinitialisation du snap");
  }
});

let lastFrameTime = performance.now();

// Fonction d'animation continue
function animate() {

  const now = performance.now();
  const deltaTime = now - lastFrameTime;
  lastFrameTime = now;

  // Ajuste la vitesse de l'animation selon le deltaTime
  const transitionSpeed = 0.02 * (deltaTime / 16);  // 16 ms = 60 fps

  requestAnimationFrame(animate);

  if (pointCloud) {
    // Gérer l'animation de l'outro (sphère)
    if (isInOutro) {
      const transitionSpeed = 0.02;
      outroTransitionProgress = Math.min(outroTransitionProgress + transitionSpeed, 1);
      pointCloud.rotation.x = lerp(pointCloud.rotation.x, 0, outroTransitionProgress);   // Arrêter progressivement la rotation en X
      pointCloud.rotation.y += 0.001 * outroTransitionProgress;  // Ralentir la rotation en Y

    // Gérer la rotation standard du cube dans la section hero
    } else if (isInHero && rotating && initialPositions.length > 0) {
      const transitionSpeed = 0.02;
      outroTransitionProgress = Math.max(outroTransitionProgress - transitionSpeed, 0);  // Retour au cube
      pointCloud.rotation.x += 0.002 * (1 - outroTransitionProgress);  // Rotation standard du cube
      pointCloud.rotation.y += 0.002 * (1 - outroTransitionProgress);
    }

    // Si le scroll est activé (snap)
    if (scrollActivated) {
      const transitionSpeed = 0.01;  // Vitesse du snap
      scrollRotationProgress = Math.min(scrollRotationProgress + transitionSpeed, 1);  // Progression du snap

      // Snap vers la face la plus proche
      pointCloud.rotation.x = lerp(pointCloud.rotation.x, rotationTarget.x, scrollRotationProgress);
      pointCloud.rotation.y = lerp(pointCloud.rotation.y, rotationTarget.y, scrollRotationProgress);

      // Désactiver le snap une fois terminé
      if (scrollRotationProgress === 1) {
        scrollActivated = false;
        console.log("Snap terminé");
      }
    }

    // Mettre à jour les points lorsque la souris est à l'intérieur du cube
    if (!scrollActivated && !isInOutro) {
      updatePoints(mouseX, mouseY, isMouseInside, easeInOut);  // Mettre à jour les points hors de l'outro
    }
  }

  renderer.render(scene, camera);
}

animate();


function easeInOut(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}


// Handle window resize
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});