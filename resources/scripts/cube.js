export let geometry;
export let pointCloud;
export let points = [];
export let initialPositions = [];
export let timeOffsets = [];
export let gridSize = 12; // grid size in X and Y
export let spacing = 5; // Initial spacing
let donutShape = []; // Store torus shape vertices

// Function to create points and update the point cloud (cube form)
export function createPoints(scene, material, currentSpacing = spacing, gridSizeZ = gridSize) {
  points.length = 0; // Réinitialiser le tableau des points
  initialPositions.length = 0; // Réinitialiser les positions initiales
  timeOffsets.length = 0; // Réinitialiser les décalages de temps

  geometry = new THREE.BufferGeometry();

  // Créer une grille de points avec un espacement dynamique et une taille de grille Z
  for (let z = 0; z < gridSizeZ; z++) {
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const posX = x * currentSpacing - ((gridSize - 1) * currentSpacing) / 2;
        const posY = y * currentSpacing - ((gridSize - 1) * currentSpacing) / 2;
        const posZ = z * currentSpacing - ((gridSizeZ - 1) * currentSpacing) / 2;

        points.push(posX, posY, posZ);
        initialPositions.push({ x: posX, y: posY, z: posZ });
        timeOffsets.push(0); // Réinitialiser les décalages de temps
      }
    }
  }

  const vertices = new Float32Array(points);
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

  if (pointCloud) {
    scene.remove(pointCloud);
  }

  pointCloud = new THREE.Points(geometry, material);
  scene.add(pointCloud);
}

// Function to update points based on mouse influence (wave effect)
export function updatePoints(mouseX, mouseY, isMouseInside, easeInOut) {
  const positions = geometry.attributes.position.array;
  const timeFactor = 0.08;

  for (let i = 0; i < positions.length; i += 3) {
    const initialPosition = initialPositions[i / 3];

    // Vérifier que initialPosition est bien défini
    if (!initialPosition || initialPosition.x === undefined || initialPosition.y === undefined || initialPosition.z === undefined) {
      console.error('Initial position is undefined for index', i / 3);
      continue;  // Sauter l'itération si initialPosition est indéfini
    }

    const distanceX = mouseX - initialPosition.x;
    const distanceY = mouseY - initialPosition.y;

    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    const maxDistance = 30;
    const influence = Math.max(0, maxDistance - distance) / maxDistance;

    if (isMouseInside && influence > 0) {
      timeOffsets[i / 3] = Math.min(timeOffsets[i / 3] + timeFactor, 1);
    } else {
      timeOffsets[i / 3] = Math.max(timeOffsets[i / 3] - timeFactor * 0.5, 0);
    }

    const easeValue = easeInOut(timeOffsets[i / 3]);
    const waveEffect = Math.sin(distance * 0.2 + performance.now() * 0.005) * influence * 2 * easeValue;

    positions[i + 2] = initialPosition.z + waveEffect;

    if (isNaN(positions[i + 2])) {
      console.error('NaN value detected in geometry positions at index', i);
      positions[i + 2] = initialPosition.z; // Reset to initial Z if NaN is detected
    }
  }

  geometry.attributes.position.needsUpdate = true;
}

// Function to transform points into a sphere with denser points at the poles
export function transformToSphere(scene, material) {
  points.length = 0;  // Réinitialiser les points
  initialPositions.length = 0;  // Réinitialiser les positions initiales
  timeOffsets.length = 0; // Réinitialiser les décalages de temps

  const radius = 40;  // Rayon de la sphère
  const pointCount = 3000;  // Nombre de points pour la sphère

  // Créer des positions initiales loin de la vue, derrière la caméra
  for (let i = 0; i < pointCount; i++) {
    const posX = (Math.random() - 0.5) * 500;
    const posY = (Math.random() - 0.5) * 500;
    const posZ = (Math.random() - 0.5) * 500;

    points.push(posX, posY, posZ);
    initialPositions.push({ x: posX, y: posY, z: posZ });
    timeOffsets.push(0); // Réinitialiser les décalages de temps
  }

  const vertices = new Float32Array(points);
  geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

  if (pointCloud) {
    scene.remove(pointCloud);  // Supprimer l'ancien pointCloud si nécessaire
  }

  pointCloud = new THREE.Points(geometry, material);
  scene.add(pointCloud);

  // Animation vers la sphère
  const targetPoints = [];
  for (let i = 0; i < pointCount; i++) {
    const theta = Math.random() * Math.PI * 2;  // Angle de longitude
    const phi = Math.acos(1 - 2 * Math.random());  // Angle de latitude

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    targetPoints.push(x, y, z);
  }

  animateSphereTransition(points, targetPoints);
}

function animateSphereTransition(initialPoints, targetPoints) {
  const duration = 2000; // 2 secondes pour la transition
  const startTime = performance.now();

  function animate() {
    const elapsedTime = performance.now() - startTime;
    const t = Math.min(elapsedTime / duration, 1); // Progression entre 0 et 1

    const positions = geometry.attributes.position.array;

    for (let i = 0; i < initialPoints.length; i += 3) {
      positions[i] = THREE.MathUtils.lerp(initialPoints[i], targetPoints[i], t); // X
      positions[i + 1] = THREE.MathUtils.lerp(initialPoints[i + 1], targetPoints[i + 1], t); // Y
      positions[i + 2] = THREE.MathUtils.lerp(initialPoints[i + 2], targetPoints[i + 2], t); // Z
    }

    geometry.attributes.position.needsUpdate = true;

    if (t < 1) {
      requestAnimationFrame(animate); // Continuer jusqu'à la fin de l'animation
    }
  }

  animate();
}

// Function to revert points back to the initial cube shape
export function revertToCube(scene, material, currentSpacing = spacing, gridSizeZ = gridSize) {
  const initialCubePositions = [];
  const positions = geometry.attributes.position.array;

  // Stocker les positions initiales du cube
  for (let z = 0; z < gridSizeZ; z++) {
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const posX = x * currentSpacing - ((gridSize - 1) * currentSpacing) / 2;
        const posY = y * currentSpacing - ((gridSize - 1) * currentSpacing) / 2;
        const posZ = z * currentSpacing - ((gridSizeZ - 1) * currentSpacing) / 2;
        initialCubePositions.push(posX, posY, posZ);
      }
    }
  }

  // Animer le retour des points au cube
  animateSphereToCube(initialCubePositions);
}

function animateSphereToCube(targetPoints) {
  const duration = 2000; // 2 secondes pour la transition
  const startTime = performance.now();

  function animate() {
    const elapsedTime = performance.now() - startTime;
    const t = Math.min(elapsedTime / duration, 1); // Progression entre 0 et 1

    const positions = geometry.attributes.position.array;

    for (let i = 0; i < positions.length; i += 3) {
      positions[i] = THREE.MathUtils.lerp(positions[i], targetPoints[i], t); // X
      positions[i + 1] = THREE.MathUtils.lerp(positions[i + 1], targetPoints[i + 1], t); // Y
      positions[i + 2] = THREE.MathUtils.lerp(positions[i + 2], targetPoints[i + 2], t); // Z
    }

    geometry.attributes.position.needsUpdate = true;

    if (t < 1) {
      requestAnimationFrame(animate); // Continuer jusqu'à la fin de l'animation
    }
  }

  animate();
}



