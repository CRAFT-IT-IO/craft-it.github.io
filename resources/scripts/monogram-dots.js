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
const points = [];
const gridSize = 12; // Taille de la grille en X, Y et Z
const spacing = 5; // Espacement entre les points

// Fonction pour créer un cube de points
function createCube() {
  geometry = new THREE.BufferGeometry();
  const vertices = [];

  // Créer une grille de points
  for (let z = 0; z < gridSize; z++) {
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const posX = x * spacing - ((gridSize - 1) * spacing) / 2;
        const posY = y * spacing - ((gridSize - 1) * spacing) / 2;
        const posZ = z * spacing - ((gridSize - 1) * spacing) / 2;

        vertices.push(posX, posY, posZ);
      }
    }
  }

  const verticesArray = new Float32Array(vertices);
  geometry.setAttribute('position', new THREE.BufferAttribute(verticesArray, 3));

  pointCloud = new THREE.Points(geometry, material);
  scene.add(pointCloud);
}

// Créer le cube
createCube();

// Fonction pour animer le cube
function animate() {
  requestAnimationFrame(animate);

  // Rotation continue du cube
  if (pointCloud) {
    pointCloud.rotation.x += 0.002;
    pointCloud.rotation.y += 0.002;
  }

  renderer.render(scene, camera);
}

// Redimensionnement de la fenêtre
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Lancer l'animation
animate();


// Gestion de la redimension de la fenêtre
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
