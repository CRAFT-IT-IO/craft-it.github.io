const canvas = document.getElementById('moodys-threejs-canvas') || document.createElement('canvas');
canvas.id = 'moodys-threejs-canvas';
document.body.appendChild(canvas);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 600;
camera.position.y = 0;

const cameraInitialY = camera.position.y; 
const cameraInitialZ = camera.position.z;  

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setClearColor(0xffffff, 0);

// Fonction pour mettre à jour la taille du renderer en fonction de la taille de la fenêtre
function resizeRendererToWindow() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

// Appeler la fonction de redimensionnement pour initialiser correctement la taille
resizeRendererToWindow();

// Ajouter un événement pour le redimensionnement de la fenêtre
window.addEventListener('resize', resizeRendererToWindow);

// Fonction pour ajuster la position Y de la caméra au scroll
function handleScroll() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollFactor = Math.min(1, scrollTop / document.documentElement.scrollHeight);

  // Ajuster simplement la position Y de la caméra en fonction du facteur de scroll
  camera.position.y = cameraInitialY + scrollFactor * 80;
  camera.position.z = cameraInitialZ + scrollFactor * -80; 
  camera.position.x = scrollFactor * -50; 
}

// Ajouter l'événement de défilement
window.addEventListener('scroll', handleScroll);

// Paramètres pour les couches de points
const numPoints = 600;
const numLines = 100;
const lineSpacingZ = 5;
const waveAmplitude1 = 20;
const echoAmplitudeY1 = 0.9;
const echoAmplitudeZ1 = 1;
const waveFrequency1 = 0.05;
const flowSpeed1 = 0.01;
const echoDelay1 = 0.1;

const waveAmplitude2 = 10;
const echoAmplitudeY2 = 0.8;
const echoAmplitudeZ2 = 2;
const waveFrequency2 = 0.08;
const flowSpeed2 = 0.02;
const echoDelay2 = 0.15;

const waveAmplitude3 = 5;
const echoAmplitudeY3 = 0.7;
const echoAmplitudeZ3 = 3;
const waveFrequency3 = 0.1;
const flowSpeed3 = 0.03;
const echoDelay3 = 0.12;

// Création des points pour les trois couches
const points1 = [];
const points2 = [];
const points3 = [];
const randomOffsets1 = [];
const randomOffsets2 = [];
const randomOffsets3 = [];

for (let line = 0; line < numLines; line++) {
  for (let i = 0; i < numPoints; i++) {
    const x = i * 2 - numPoints;
    const y = (Math.random() - 0.5) * 5;
    const z = line * lineSpacingZ;

    points1.push(x, y, z);
    randomOffsets1.push((Math.random() - 0.5) * 0.5);

    points2.push(x, y, z + 10);
    randomOffsets2.push((Math.random() - 0.5) * 0.5);

    points3.push(x, y, z + 20);
    randomOffsets3.push((Math.random() - 0.5) * 0.5);
  }
}

// Géométrie et matériel pour la première couche
const vertices1 = new Float32Array(points1);
const geometry1 = new THREE.BufferGeometry();
geometry1.setAttribute('position', new THREE.BufferAttribute(vertices1, 3));

const material1 = new THREE.PointsMaterial({
  color: 0x333333,
  size: 0.2,
  transparent: true,
  opacity: 0.8,
});

const pointCloud1 = new THREE.Points(geometry1, material1);
scene.add(pointCloud1);

// Géométrie et matériel pour la deuxième couche
const vertices2 = new Float32Array(points2);
const geometry2 = new THREE.BufferGeometry();
geometry2.setAttribute('position', new THREE.BufferAttribute(vertices2, 3));

const material2 = new THREE.PointsMaterial({
  color: 0x666666,
  size: 0.2,
  transparent: true,
  opacity: 0.5,
});

const pointCloud2 = new THREE.Points(geometry2, material2);
scene.add(pointCloud2);

// Géométrie et matériel pour la troisième couche
const vertices3 = new Float32Array(points3);
const geometry3 = new THREE.BufferGeometry();
geometry3.setAttribute('position', new THREE.BufferAttribute(vertices3, 3));

const material3 = new THREE.PointsMaterial({
  color: 0x999999,
  size: 0.2,
  transparent: true,
  opacity: 0.4,
});

const pointCloud3 = new THREE.Points(geometry3, material3);
scene.add(pointCloud3);

// Fonction d'animation pour les trois couches de points
function animateWave() {
  const positions1 = geometry1.attributes.position.array;
  const positions2 = geometry2.attributes.position.array;
  const positions3 = geometry3.attributes.position.array;
  const time = performance.now() * 0.001;

  for (let line = 0; line < numLines; line++) {
    const phaseOffset1 = line * echoDelay1;
    const currentAmplitudeY1 = waveAmplitude1 * Math.pow(echoAmplitudeY1, line);

    for (let i = 0; i < numPoints; i++) {
      const idx = (line * numPoints + i) * 3;
      const randomOffset1 = randomOffsets1[line * numPoints + i];

      positions1[idx] += flowSpeed1 * (1 + randomOffset1 * 0.2);
      if (positions1[idx] > numPoints) {
        positions1[idx] = -numPoints;
      }

      positions1[idx + 1] = Math.sin(positions1[idx] * waveFrequency1 + time + phaseOffset1 + randomOffset1) * currentAmplitudeY1;
      positions1[idx + 2] = line * lineSpacingZ + Math.sin(positions1[idx] * waveFrequency1 + time + phaseOffset1 + randomOffset1) * echoAmplitudeZ1;
    }
  }

  for (let line = 0; line < numLines; line++) {
    const phaseOffset2 = line * echoDelay2;
    const currentAmplitudeY2 = waveAmplitude2 * Math.pow(echoAmplitudeY2, line);

    for (let i = 0; i < numPoints; i++) {
      const idx = (line * numPoints + i) * 3;
      const randomOffset2 = randomOffsets2[line * numPoints + i];

      positions2[idx] += flowSpeed2 * (1 + randomOffset2 * 0.2);
      if (positions2[idx] > numPoints) {
        positions2[idx] = -numPoints;
      }

      positions2[idx + 1] = Math.sin(positions2[idx] * waveFrequency2 + time + phaseOffset2 + randomOffset2) * currentAmplitudeY2;
      positions2[idx + 2] = line * lineSpacingZ + 10 + Math.sin(positions2[idx] * waveFrequency2 + time + phaseOffset2 + randomOffset2) * echoAmplitudeZ2;
    }
  }

  for (let line = 0; line < numLines; line++) {
    const phaseOffset3 = line * echoDelay3;
    const currentAmplitudeY3 = waveAmplitude3 * Math.pow(echoAmplitudeY3, line);

    for (let i = 0; i < numPoints; i++) {
      const idx = (line * numPoints + i) * 3;
      const randomOffset3 = randomOffsets3[line * numPoints + i];

      positions3[idx] += flowSpeed3 * (1 + randomOffset3 * 0.2);
      if (positions3[idx] > numPoints) {
        positions3[idx] = -numPoints;
      }

      positions3[idx + 1] = Math.sin(positions3[idx] * waveFrequency3 + time + phaseOffset3 + randomOffset3) * currentAmplitudeY3;
      positions3[idx + 2] = line * lineSpacingZ + 20 + Math.sin(positions3[idx] * waveFrequency3 + time + phaseOffset3 + randomOffset3) * echoAmplitudeZ3;
    }
  }

  geometry1.attributes.position.needsUpdate = true;
  geometry2.attributes.position.needsUpdate = true;
  geometry3.attributes.position.needsUpdate = true;

  renderer.render(scene, camera);
  requestAnimationFrame(animateWave);
}

animateWave();


// Gestion de la redimension de la fenêtre
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});